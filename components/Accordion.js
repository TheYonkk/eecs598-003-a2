import { useState } from "react";
import utilStyles from "../styles/utils.module.css";
import styles from "./Accordion.module.css";

// accordion mostly borrowed from
// https://www.freecodecamp.org/news/build-accordion-menu-in-react-without-external-libraries/
export default function Accordion({title, children}) {
    const [isActive, setIsActive] = useState(false);

    return (
      <div className={styles.accordionItem}>
        <div className={styles.accordionTitle} onClick={() => setIsActive(!isActive)}>
          <div>{title}</div>
          <div>{isActive ? '-' : '+'}</div>
        </div>
        {isActive && <div className={styles.accordionContent}>{children}</div>}
      </div>
    );
}
