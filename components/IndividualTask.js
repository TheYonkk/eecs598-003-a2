import styles from "./IndividualTask.module.css";
import utilStyles from "./../styles/utils.module.css";
import Image from "next/image";
import { useEffect, useState } from "react";

const imageLoader = ({ src, width, quality }) => {
  return `${src}`;
};

const API_ENDPOINT = "https://daveyonkers.com/ask";
const SCORE_THRESHOLD = 0.01; // only display suggestions with a score above this threshold

export default function Task({
  number,
  imageUrl,
  question,
  answer,
  handleEnterAnswer,
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionButtons, setSuggestionButtons] = useState([]);

  // when the component mounts, send a post request to the ask API to get the suggestions for the answer to the question and image
  useEffect(() => {
    const requestData = {
      question: question,
      image_url: imageUrl,
    };

    const fetchSuggestions = async () => {

      fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      })
        // convert the response to json
        .then((response) => response.json())
        .then((data) => {
          setSuggestions(data);
        });
    };

    fetchSuggestions().catch((err) => {
      console.log(err);
    });
  }, [imageUrl, question]);

  // when either the suggestions or the handler changes, update the suggestionButtons
  useEffect(() => {

    // if there are no suggestions, return an empty array
    if (suggestions.length === 0) {
      setSuggestionButtons([]);
      return;
    }

    // map each response to a suggestion component
    const suggestionButtons = suggestions.map((suggestion, index) => {
      // only display suggestions with a score above the threshold
      if (suggestion["score"] < SCORE_THRESHOLD) {
        return null;
      }

      return (
        <div
          className={`${styles.buttonBlue} ${styles.suggestion}`}
          key={index}
          onClick={() =>
            handleEnterAnswer(number, "answer", suggestion["answer"])
          }
        >
          {suggestion["answer"]}
        </div>
      );
    });
    setSuggestionButtons(suggestionButtons);
  }, [suggestions, handleEnterAnswer, number]);

  return (
    <div className={styles.individualTaskContainer} key={number}>
      <h3 className={utilStyles.headingXl}>Image #{number}</h3>
      <div className={styles.taskImageContainer}>
        <Image
          loader={imageLoader}
          src={imageUrl}
          fill
          style={{ objectFit: "contain" }}
          alt={imageUrl}
        />
      </div>
      <h3 className={utilStyles.headingLg}>
        Please answer the following question:
      </h3>
      <p className={styles.question}>{question}</p>

      {suggestionButtons.length > 0 && (
        <>
          <div className={styles.suggestionsHeaderContainer}>
            <p className={styles.suggestionsHeader}>Suggestions:</p>
          </div>
          <div className={styles.suggestionsContainer}>
            {suggestionButtons.map((suggestion) => {
              return suggestion;
            })}
          </div>
        </>
      )}

      <input
        className={styles.answerInput}
        type="text"
        value={answer}
        placeholder="Enter your own answer here."
        onChange={(e) => handleEnterAnswer(number, "answer", e.target.value)}
      />
      <div className={styles.checkboxContainer}>
        <div className={styles.checkbox}>
          <input
            type="checkbox"
            id={"na" + number}
            name={"na" + number}
            onChange={(e) =>
              handleEnterAnswer(
                number,
                "questionDoesNotApply",
                e.target.checked
              )
            }
          />
          <label for={"na" + number} className={styles.checkboxLabel}>
            Question does not apply.
          </label>
        </div>
      </div>
      <div className={styles.checkboxContainer}>
        <div className={styles.checkbox}>
          <input
            type="checkbox"
            id={"noAns" + number}
            name={"noAns" + number}
            onChange={(e) =>
              handleEnterAnswer(number, "cannotAnswer", e.target.checked)
            }
          />
          <label for={"noAns" + number} className={styles.checkboxLabel}>
            I cannot answer this question.
          </label>
        </div>
      </div>
    </div>
  );
}
