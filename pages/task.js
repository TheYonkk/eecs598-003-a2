import Head from "next/head";
import Image from "next/image";
import Layout, { siteTitle } from "../components/layout";
import utilStyles from "../styles/utils.module.css";
import styles from "./task.module.css";
import Link from "next/link";
import Date from "../components/date";
import { useEffect, useState } from "react";
import imageIDs from "../data/img_id_to_img_name.json";
import questionData from "../data/v2_OpenEnded_mscoco_val2014_questions.json";
import { database } from "../firebase/firebase";
import { ref, set, push } from "firebase/database";
import { useRouter } from "next/router";
import Accordion from "../components/accordion";
import { example1, example2, example3 } from "../components/Examples/examples";

export default function Task() {
  const IMAGE_URL_BASE =
    "https://eecs583-yonkers-a2.s3.us-east-2.amazonaws.com/val2014/";
  const router = useRouter();
  const [isTaskLoaded, setIsTaskLoaded] = useState(false);
  const [imageID, setImageID] = useState();
  const [selectedQuestion, setSelectedQuestion] = useState();
  const [answer, setAnswer] = useState("");
  const [submitEnabled, setSubmitEnabled] = useState(true);

  // empty array means that this effect is ran only once, and that's after the component is rendered
  useEffect(() => {
    // get list of possible IDs
    const ids = Object.keys(imageIDs);

    // randomly select an ID to use
    setImageID(ids[Math.floor(Math.random() * ids.length)]);
  }, []);

  // determine the question whenever the selected image changes
  useEffect(() => {
    // get all of the potential questions for this id
    var questions = [];
    questionData["questions"].forEach((question) => {
      if (question["image_id"] == imageID) {
        questions = [...questions, question];
      }
    });

    // randomly select a question
    const q = questions[Math.floor(Math.random() * questions.length)];
    setSelectedQuestion(
      questions[Math.floor(Math.random() * questions.length)]
    );
  }, [imageID]);

  const saveToDb = ({ data }) => {
    setSubmitEnabled(false); // disable submitting a second time
    const responsesRef = ref(database, "responses"); // gets the /responses part of the db
    const newResponseRef = push(responsesRef); // creates a unique key and returns it as a reference
    const responsePromise = set(newResponseRef, {
      question: selectedQuestion,
      answer: answer,
      image: {
        id: imageID,
        file: imageIDs[imageID],
        link: `${IMAGE_URL_BASE}${imageIDs[imageID]}`,
      },
    }); // actually maps the key to some data

    // handle accept (nav to new page with database insert key) or reject
    responsePromise
      .then(() => {
        router.push(`/thanks/${newResponseRef.key}`);
      })
      .catch(() => {
        console.log("There was an error submitting!");
        setSubmitEnabled(true);
      });
  };

  const imageLoader = ({ src, width, quality }) => {
    return `${IMAGE_URL_BASE}${src}`;
  };

  const handleEnterAnswer = (event) => {
    setAnswer(event.target.value);
  };

  return (
    <Layout>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section>
        <h2 className={utilStyles.heading2Xl}>Instructions</h2>
        <p>
          You will be asked one question regarding an image shown to you. The
          question will be open-ended and potentially subjective. It is your
          task to answer the question as succincly and accurately as possible
          (in one, or maybe two words).
        </p>
        <p>
          If this if your first HIT from Dave, please expand the examples below
          to get an idea of good and bad answers:
        </p>
        <Accordion title="Example #1">{example1}</Accordion>
        <Accordion title="Example #2">{example2}</Accordion>
        <Accordion title="Example #3">{example3}</Accordion>
      </section>

      {isTaskLoaded && imageID ? (
        <section className={`${utilStyles.padding1px}`}>
          <h2 className={utilStyles.heading2Xl}>Your image:</h2>
          <div className={styles.taskImageContainer}>
            <Image
              loader={imageLoader}
              src={imageIDs[imageID]}
              fill
              style={{ objectFit: "contain" }}
              alt={imageIDs[imageID]}
            />
          </div>
          <h3 className={utilStyles.headingLg}>
            Please answer the following question:
          </h3>
          <p>{selectedQuestion["question"]}</p>
          <input
            className={styles.answerInput}
            type="text"
            value={answer}
            onChange={handleEnterAnswer}
          />
          <p>
            <button
              className={styles.buttonBlue}
              onClick={saveToDb}
              disabled={!submitEnabled}
            >
              Submit
            </button>
          </p>
        </section>
      ) : (
        <section className={`${utilStyles.padding1px} ${styles.loadTask}`}>
          <p>
            <button
              className={styles.buttonBlue}
              onClick={setIsTaskLoaded.bind(true)}
            >
              Load task
            </button>
          </p>
        </section>
      )}
    </Layout>
  );
}
