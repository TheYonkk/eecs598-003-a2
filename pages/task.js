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
import { example1, example2, example3 } from "../components/Examples/examples";
import Accordion from "../components/Accordion";
import IndividualTask from "../components/IndividualTask";

const NUM_IMAGES = 25;

export default function Task() {
  const IMAGE_URL_BASE =
    "https://eecs583-yonkers-a2.s3.us-east-2.amazonaws.com/val2014/";
  const router = useRouter();
  const [isTaskLoaded, setIsTaskLoaded] = useState(false);
  const [submitEnabled, setSubmitEnabled] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [answers, setAnswers] = useState([]);

  // empty array means that this effect is ran only once, and that's after the component is rendered
  useEffect(() => {
    // data structure to store the image and question data
    const qData = [];

    // get list of possible IDs
    const ids = Object.keys(imageIDs);

    // randomly imageIDs to use
    for (let i = 0; i < NUM_IMAGES; i++) {
      qData.push({
        image: { id: ids[Math.floor(Math.random() * ids.length)] },
      });
    }

    // construct the full image name and image url from the image id, then add it to the datastructure
    for (let i = 0; i < qData.length; i++) {
      qData[i].image.file = imageIDs[qData[i].image.id];
      qData[i].image.url = IMAGE_URL_BASE + qData[i].image.file;
    }

    // for each imageID, select a random question from the list of potential questions for that imageID
    for (let i = 0; i < qData.length; i++) {
      const potentialQuestions = [];
      questionData["questions"].forEach((question) => {
        if (question["image_id"] == qData[i].image.id) {
          potentialQuestions.push(question);
        }
      });
      qData[i].question =
        potentialQuestions[
          Math.floor(Math.random() * potentialQuestions.length)
        ];
    }

    setTasks(qData);

  }, []);


  const saveToDb = ({ data }) => {
    setSubmitEnabled(false); // disable submitting a second time
    const responsesRef = ref(database, "responses"); // gets the /responses part of the db
    const newResponseRef = push(responsesRef); // creates a unique key and returns it as a reference

    // merge the question and answer into a single object, then append it to the list of responses
    const responses = [];
    for (let i = 0; i < tasks.length; i++) {
      responses.push({
        question: tasks[i].question,
        answer: answers[i]
          ? answers[i]
          : {
              answer: "",
              questionDoesNotApply: false,
              cannotAnswer: false,
            },
        image: tasks[i].image,
      });
    }

    const responsePromise = set(newResponseRef, {
      responses: responses,
      reviwed: false,
    });

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

  const handleEnterAnswer = (taskNumber, code, text) => {
    const newAnswers = [...answers];

    // if the previous index is empty, initialize it with empty/false values
    if (!newAnswers[taskNumber - 1]) {
      newAnswers[taskNumber - 1] = {
        answer: "",
        questionDoesNotApply: false,
        cannotAnswer: false,
      };
    }

    switch (code) {
      case "answer":
        newAnswers[taskNumber - 1].answer = text;
        break;
      case "questionDoesNotApply":
        newAnswers[taskNumber - 1].questionDoesNotApply = text;
        break;
      case "cannotAnswer":
        newAnswers[taskNumber - 1].cannotAnswer = text;
        break;
    }

    setAnswers(newAnswers);
  };

  return (
    <Layout>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section>
        <h2 className={utilStyles.heading2Xl}>Instructions</h2>
        <p>
          You will be asked one question for each image shown to you. There will
          be a total of {NUM_IMAGES} images, and each question be open-ended and
          potentially subjective. It is your task to answer the question as
          succincly as possible (in one, or maybe two words).
        </p>
        <p>
          If the question does not apply to the image, please check "question
          does not apply" and move on to the next image. Similarly, if you
          absolutely cannot answer the question, please check "I cannot answer
          this question" and move on to the next image.
        </p>
        <p>
          At the end of the HIT, you will be asked to save your answers. After
          saving, you will be given a completion code which you must enter in
          the "Provide survey code here" box in order to recieve credit for the
          HIT.
        </p>
        <p>
          If this if your first HIT from Dave, please expand the examples below
          to get an idea of good and bad answers:
        </p>
        <Accordion title="Example #1">{example1}</Accordion>
        <Accordion title="Example #2">{example2}</Accordion>
        <Accordion title="Example #3">{example3}</Accordion>
      </section>

      {isTaskLoaded && tasks.length > 0 ? (
        <section className={`${utilStyles.padding1px}`}>
          <h2 className={utilStyles.heading2Xl}>Your images:</h2>

          {tasks.map((task, index) => {
            return (
              <IndividualTask
                key={index}
                number={index + 1}
                imageUrl={task.image.url}
                question={task.question.question}
                answer={answers[index]?.answer}
                handleEnterAnswer={handleEnterAnswer}
              />
            );
          })}

          <p>
            <button
              className={styles.buttonBlue}
              onClick={saveToDb}
              disabled={!submitEnabled}
            >
              Save answers
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
