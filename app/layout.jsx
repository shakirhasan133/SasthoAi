import "./globals.css"
import GlobalChat from "../components/GlobalChat"
import Script from 'next/script'

export const metadata = {
  title: "SasthoAi - Your AI Health Companion",
  description: "Search diseases and get AI-powered health information instantly",
  keywords: "health, AI, disease search, medical information",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#4CB963" />
        {/* Puter.js SDK for client-side AI, storage, etc. */}
        <Script src="https://js.puter.com/v2/" strategy="afterInteractive" />
      </head>
      <body>
        {children}
        <GlobalChat />
      </body>
    </html>
  )
}
