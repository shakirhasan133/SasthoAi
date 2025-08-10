"use client"
import { motion } from "framer-motion"
import { Bot, User } from "lucide-react"

export default function ChatMessage({ message, index }) {
  return (
    <motion.div
      className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          message.sender === "user"
            ? "bg-green-500 text-white rounded-br-md"
            : "bg-white border border-gray-100 text-gray-800 rounded-bl-md shadow-sm"
        }`}
      >
        <div className="flex items-start space-x-2">
          {message.sender === "ai" && (
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Bot className="w-3 h-3 text-green-600" />
            </div>
          )}
          <div className="flex-1">
            <p className="text-sm leading-relaxed">{message.text}</p>
            <p className={`text-xs mt-1 ${message.sender === "user" ? "text-green-100" : "text-gray-400"}`}>
              {message.timestamp.toLocaleTimeString("bn-BD", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          {message.sender === "user" && (
            <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <User className="w-3 h-3 text-white" />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
