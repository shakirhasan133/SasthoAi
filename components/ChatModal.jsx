"use client"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Send, Mic, Bot, User } from "lucide-react"

export default function ChatModal({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      id: 0,
      text: "SasthoAi is online.",
      sender: "system",
      timestamp: new Date(),
    },
    {

      id: 1,
      text: "হাই! আমি SasthoAi। আপনার স্বাস্থ্য সংক্রান্ত যেকোনো প্রশ্ন করতে পারেন। আমি সাহায্য করতে এখানে আছি।",
      sender: "ai",
      timestamp: new Date(),
    },
  ])
  const [inputText, setInputText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus()
      }, 300)
    }
  }, [isOpen])

  const handleSendMessage = async () => {
    if (!inputText.trim()) return

    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputText("")
    setIsTyping(true)

    try {
      let replyText = ''
      const systemPrompt = 'You are SasthoAi, a helpful Bengali health assistant. Provide concise, safe, and balanced information in Bengali. Avoid diagnosis; suggest consulting a doctor for serious issues.'

      if (typeof window !== 'undefined' && window.puter?.ai?.chat) {
        // Prefer Puter.js client-side chat
        const response = await window.puter.ai.chat([
          { role: 'system', content: systemPrompt },
          { role: 'user', content: String(userMessage.text) },
        ])
        replyText = (response?.choices?.[0]?.message?.content || response?.content || String(response)).toString()
      } else {
        // Fallback to existing API route if Puter is not ready
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: userMessage.text })
        })
        const data = await res.json()
        replyText = data?.reply || 'দুঃখিত, আমি এখন উত্তর দিতে পারছি না।'
      }

      const aiResponse = {
        id: Date.now() + 1,
        text: replyText,
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
    } catch (e) {
      const aiResponse = {
        id: Date.now() + 1,
        text: 'নেটওয়ার্ক ত্রুটি হয়েছে। দয়া করে আবার চেষ্টা করুন।',
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
    } finally {
      setIsTyping(false)
    }
  }

  

  const handleVoiceInput = () => {
    setIsListening(!isListening)
    // Voice input functionality would be implemented here
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 chat-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-x-4 top-[8%] bottom-[8%] bg-card rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden max-w-md mx-auto"
            initial={{ scale: 0.8, opacity: 0, y: 100 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 100 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border bg-gradient-to-r from-secondary to-background">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-foreground rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">AI Health Chat</h3>
                  <p className="text-sm text-primary">● Online</p>
                </div>
              </div>
              <motion.button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-muted transition-colors duration-200"
                whileTap={{ scale: 0.95 }}
                aria-label="Close chat"
              >
                <X className="w-6 h-6 text-muted-foreground" />
              </motion.button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-secondary/20 to-background chat-messages">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 message-bubble ${
                      message.sender === "user"
                        ? "bg-primary text-white rounded-br-md"
                        : message.sender === "ai" ? "bg-background border border-border text-foreground rounded-bl-md shadow-sm" : "text-muted-foreground italic text-center w-full"
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.sender === "ai" && (
                        <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Bot className="w-3 h-3 text-primary" />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className={`text-sm leading-relaxed ${message.sender === "user" ? "text-white" : ""}`}>{message.text}</p>
                        <p className={`text-xs mt-2 ${message.sender === "user" ? "text-white/80" : "text-muted-foreground"}`}>
                          {message.timestamp.toLocaleTimeString("bn-BD", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      {message.sender === "user" && (
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <User className="w-3 h-3 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  className="flex justify-start"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="bg-background border border-border rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
                        <Bot className="w-3 h-3 text-primary" />
                      </div>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                        <div
                          className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        />
                        <div
                          className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-border bg-background">
              <div className="flex items-end space-x-3">
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="আপনার স্বাস্থ্য সংক্রান্ত প্রশ্ন লিখুন..."
                    className="w-full px-6 py-4 pr-16 bg-input border-2 border-border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm max-h-24 text-foreground"
                    rows="1"
                    style={{ minHeight: "48px" }}
                  />
                  <motion.button
                    onClick={handleVoiceInput}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-colors duration-200 touch-target ${
                      isListening ? "bg-destructive text-destructive-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Voice input"
                  >
                    <Mic className={`w-4 h-4 ${isListening ? "animate-pulse" : ""}`} />
                  </motion.button>
                </div>
                <motion.button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim()}
                  className="p-3 bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed text-primary-foreground rounded-2xl transition-colors duration-200 flex-shrink-0 touch-target"
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: inputText.trim() ? 1.05 : 1 }}
                  aria-label="Send message"
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
              <p className="text-xs text-muted-foreground mt-3 text-center">
                AI দ্বারা উৎপন্ন তথ্য। গুরুত্বপূর্ণ স্বাস্থ্য সিদ্ধান্তের জন্য ডাক্তারের পরামর্শ নিন।
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
