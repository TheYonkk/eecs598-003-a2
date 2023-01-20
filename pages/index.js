import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import utilStyles from "../styles/utils.module.css";
import styles from "./index.module.css";
import Link from "next/link";
import Date from "../components/date";

export default function Home() {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>Thank you for selecting my HIT.</p>
        <p>
          On the following page, you will be given some instructions. After you
          understand the instructions, you will be able to load your task.
        </p>
        <p>
          Upon completing the task, you will be given a completion code to enter
          into MTurk.
        </p>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <div className={styles.nextPage}>
          <p className={utilStyles.headingMd}>
            <Link href="/task">Easy enough, let's go! →</Link>
          </p>
        </div>
      </section>
    </Layout>
  );
}
