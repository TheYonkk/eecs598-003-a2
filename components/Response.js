import { useState } from "react";
import utilStyles from "../styles/utils.module.css";
import styles from "./Response.module.css";
import Image from "next/image";
import { database } from "../firebase/firebase";
import { ref, set } from "firebase/database";
import 'react-tooltip/dist/react-tooltip.css'

export default function Response({ id, data }) {

  const copyToClipboard = () => {
    navigator.clipboard.writeText(id);
  };

  const markAsReviewed = () => {
    copyToClipboard();
    const responseRef = ref(database, "responses/" + id + "/reviewed");
    set(responseRef, true);
  };

  return (
    <div key={id} className={styles.response}>
      <div className={styles.responseBody}>
        <div className={styles.responseContent}>
          <h3 className={styles.responseTitle}>Response <span id={id} data-tooltip-content="click to copy to clipboard" onClick={copyToClipboard}>{id}</span></h3>
          <p className={styles.responseQuestion}>Q: {data.question.question}</p>
          <p className={styles.responseAnswer}>A: {data.answer}</p>
          <button className={styles.buttonBlue} onClick={markAsReviewed}>
            Copy ID and mark as reviewed
          </button>
        </div>
        <div className={styles.responseImage}>
          <Image
            src={data.image.link}
            fill
            style={{ objectFit: "contain" }}
            alt={data.image.file}
          />
        </div>
      </div>
    </div>
  );
}
