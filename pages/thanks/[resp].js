import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import Layout, { siteTitle } from "../../components/layout";
import utilStyles from "../../styles/utils.module.css";
import styles from "./thanks.module.css";

export default function thanks() {
  const [isCodeCopied, setIsCodeCopied] = useState(false);

  // get the thank you code!
  const router = useRouter();
  const { resp } = router.query;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(resp);
    setIsCodeCopied(true);
  };

  return (
    <Layout>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section>
        <h2 className={utilStyles.heading2Xl}>Thank you!</h2>
        <p>Your survey completion code is:</p>
        <div>
          <div className={styles.code}>{resp}</div>
          <div className={styles.clipboard}>
            {isCodeCopied ? <div className={styles.copied}>Code copied!</div> : <a onClick={copyToClipboard}>Copy to clipboard</a>}
          </div>
        </div>
        <p>Please enter this code in MTurk to be eligible for your reward.</p>
        <p>Have a great day!</p>
      </section>
    </Layout>
  );
}
