"use client"

import { useState } from "react"
import FloatingChatButton from "./FloatingChatButton"
import RefinedChatModal from "./RefinedChatModal"

export default function GlobalChat() {
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <>
      <FloatingChatButton onClick={() => setIsChatOpen(true)} />
      <RefinedChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  )
}


