import styles from "./IndividualTask.module.css";
import utilStyles from "./../styles/utils.module.css";
import Image from "next/image";

const imageLoader = ({ src, width, quality }) => {
  return `${src}`;
};

export default function Task({
  number,
  imageUrl,
  question,
  answer,
  handleEnterAnswer,
}) {
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
      <p>{question}</p>
      <input
        className={styles.answerInput}
        type="text"
        value={answer}
        onChange={(e) => handleEnterAnswer(number, "answer", e.target.value)}
      />
      <div className={styles.checkBox}>
        <input type="checkbox" id={"na" + number} name={"na" + number} onChange={(e) => handleEnterAnswer(number, "questionDoesNotApply", e.target.checked)}/>
        <label for={"na" + number}>Question does not apply.</label>
      </div>
      <div className={styles.checkBox}>
        <input type="checkbox" id={"noAns" + number} name={"noAns" + number} onChange={(e) => handleEnterAnswer(number, "cannotAnswer", e.target.checked)}/>
        <label for={"noAns" + number}>I cannot answer this question.</label>
      </div>
    </div>
  );
}
