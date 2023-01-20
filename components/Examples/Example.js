import { useState } from "react";
import utilStyles from "../../styles/utils.module.css";
import styles from "./Example.module.css";
import Image from "next/image";

export default function Example({
  imageData,
  question,
  goodAnswers,
  badAnswers,
}) {
  const imageLoader = ({ src, width, quality }) => {
    return `${src}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        <div>
        <Image
          loader={imageLoader}
          src={imageData.url}
          width={imageData.width}
          height={imageData.height}
          alt={"an example image"} // oops, kinda bad alt
        />
        </div>
      </div>
      <p className={`${utilStyles.headingMd} ${styles.header}`}>Question:</p>
      <p className={styles.content}>{question}</p>
      <p className={`${utilStyles.headingMd} ${styles.header}`}>Acceptable answers:</p>
      <ul className={styles.content}>
        {goodAnswers.map(answer => <li key={answer}>{answer}</li>)}
      </ul>
      <p className={`${utilStyles.headingMd} ${styles.header}`}>Unacceptable answers:</p>
      <ul className={styles.content}>
        {badAnswers.map(answer => <li key={answer}>{answer}</li>)}
      </ul>
    </div>
  );
}
