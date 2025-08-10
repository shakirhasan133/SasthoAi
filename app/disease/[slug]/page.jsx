import Head from "next/head"
import DiseaseDetails from "../../../components/DiseaseDetails"

export default function DiseaseDetailsPage({ params }) {
  const slug = params?.slug || "diabetes"
  return (
    <>
      <Head>
        <title>{`SasthoAi — ${slug} বিস্তারিত`}</title>
        <meta name="description" content="রোগের বিস্তারিত তথ্য, লক্ষণ, কারণ, প্রতিকার ও চিকিৎসা।" />
      </Head>
      <DiseaseDetails diseaseSlug={slug} />
    </>
  )
}
