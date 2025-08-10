"use client"
import { motion } from "framer-motion"
import { MessageCircle } from 'lucide-react'

export default function FloatingChatButton({ onClick }) {
  return (
    <motion.button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-[60] w-16 h-16 bg-primary text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-200 flex items-center justify-center touch-target"
      aria-label="Open AI Health Chat"
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.4 }}
    >
      <MessageCircle className="w-7 h-7" />
      <motion.span
        className="absolute inset-0 rounded-full border-2 border-[rgba(76,185,99,0.5)]"
        animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0, 0.6] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        aria-hidden="true"
      />
    </motion.button>
  )
}
