"use client"
import Head from "next/head"
import EnhancedHeader from "../components/EnhancedHeader"
import ImprovedCentralSearch from "../components/ImprovedCentralSearch"
import RecentTopSearch from "../components/RecentTopSearch"

export default function HomePage() {
  // Chat UI moved to GlobalChat included in RootLayout

  return (
    <>
      <Head>
        <title>SasthoAi — Find trusted health info instantly</title>
        <meta name="description" content="Search diseases and chat with AI to get trusted, instant health information. Mobile-first, simple and fast." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#4CB963" />
      </Head>

      <main className="min-h-screen bg-gradient-to-b from-[#F0FDF4] to-white">
        <EnhancedHeader />
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <ImprovedCentralSearch />
          <RecentTopSearch />
        </div>
        {/* GlobalChat renders globally from layout */}
      </main>
    </>
  )
}
