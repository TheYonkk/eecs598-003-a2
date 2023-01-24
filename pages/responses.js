import { onValue, ref } from "firebase/database";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout, { siteTitle } from "../components/layout";
import Response from "../components/Response";
import { database } from "../firebase/firebase";
import utilStyles from "../styles/utils.module.css";

export default function Responses() {
  const router = useRouter();
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    const responsesRef = ref(database, "responses");
    onValue(responsesRef, (snapshot) => {
      const data = snapshot.val();
      const unhandledResponses = [];
      for (const key in data) {
        if (!data?.[key]?.reviewed) {
          unhandledResponses.push({ id: key, data: data[key] });
        }
      }
      setResponses(unhandledResponses);
    });
  }, []);

  return (
    <Layout>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section>
        <h2 className={utilStyles.heading2Xl}>Responses</h2>
        <p>
          The following annotations are HITs that have been submitted, but not
          yet marked as verified.
        </p>
      </section>
      <section>
        {responses.length > 0 ? (
          responses.map(({ id, data }) => <Response id={id} data={data} />)
        ) : (
          <p>There are currently no unreviewed responses</p>
        )}
      </section>
    </Layout>
  );
}
