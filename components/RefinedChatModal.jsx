"use client"
import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Send, Mic, Bot, User, Minus } from 'lucide-react'

export default function RefinedChatModal({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    { id: 1, text: "নমস্কার! আমি SasthoAi। আপনার স্বাস্থ্য সংক্রান্ত যেকোনো প্রশ্ন করতে পারেন। 😊", sender: "ai", timestamp: new Date() }
  ])
  const [inputText, setInputText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  useEffect(() => { scrollToBottom() }, [messages])
  useEffect(() => { 
    if (isOpen && !isMinimized) setTimeout(() => inputRef.current?.focus(), 250) 
  }, [isOpen, isMinimized])

  const handleSend = async () => {
    if (!inputText.trim()) return
    const currentText = inputText
    const userMsg = { id: Date.now(), text: currentText, sender: "user", timestamp: new Date() }
    setMessages(prev => [...prev, userMsg])
    setInputText("")
    setIsTyping(true)

    try {
      let replyText = ''
      const systemPrompt = 'You are SasthoAi, a helpful Bengali health assistant. Provide concise, safe, and balanced information in Bengali. Avoid diagnosis; suggest consulting a doctor for serious issues.'

      if (typeof window !== 'undefined' && window.puter?.ai?.chat) {
        const response = await window.puter.ai.chat([
          { role: 'system', content: systemPrompt },
          { role: 'user', content: String(currentText) },
        ])
        replyText = (response?.choices?.[0]?.message?.content || response?.content || String(response)).toString()
      } else {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: currentText })
        })
        const data = await res.json()
        replyText = data?.reply || 'দুঃখিত, আমি এখন উত্তর দিতে পারছি না। পরে আবার চেষ্টা করুন।'
      }

      const aiMsg = { id: Date.now() + 1, text: replyText, sender: 'ai', timestamp: new Date() }
      setMessages(prev => [...prev, aiMsg])
    } catch (e) {
      const aiMsg = { id: Date.now() + 1, text: 'নেটওয়ার্ক ত্রুটি হয়েছে। দয়া করে আবার চেষ্টা করুন।', sender: 'ai', timestamp: new Date() }
      setMessages(prev => [...prev, aiMsg])
    } finally {
      setIsTyping(false)
    }
  }

  const onKey = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend() } }
  const toggleMic = () => setIsListening(v => !v)

  // Minimized button click handler
  const handleMinimize = () => setIsMinimized(true)
  const handleRestore = () => setIsMinimized(false)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Only show backdrop if not minimized */}
          {!isMinimized && (
            <motion.div
              className="fixed inset-0 bg-black/50 chat-modal-backdrop z-50"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={onClose}
            />
          )}
          {/* Modal when not minimized */}
          {!isMinimized && (
            <motion.div
              className="fixed inset-0 bg-white rounded-none shadow-2xl z-[60] max-w-full mx-auto flex flex-col overflow-hidden"
              initial={{ opacity: 0, y: 60, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 60, scale: 0.96 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              role="dialog" aria-modal="true" aria-label="AI Health Chat"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-[#eef6f0] bg-[linear-gradient(180deg,#F7FFF9,white)]">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                      style={{ background: "linear-gradient(135deg, var(--primary), #3a9f4f)" }}>
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-main">AI Health Chat</h3>
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      <span className="text-xs text-primary font-medium">Online</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <motion.button
                    onClick={handleMinimize}
                    className="p-2 rounded-full hover:bg-[#F0FDF4] transition-colors touch-target"
                    aria-label="Minimize chat"
                    whileTap={{ scale: 0.95 }}
                  >
                    <Minus className="w-5 h-5 text-gray-500" />
                  </motion.button>
                  <motion.button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-[#F0FDF4] transition-colors touch-target"
                    aria-label="Close chat"
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </motion.button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-[#F7FFF9] to-white chat-messages">
                {messages.map((m) => (
                  <motion.div
                    key={m.id}
                    className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 message-bubble drop-bubble ${m.sender === "user"
                        ? "text-white bg-gradient-to-br from-[var(--primary)] to-[#3a9f4f] border-transparent ml-auto"
                        : "text-main bg-white border-[#eef6f0] mr-auto"} shadow-card border`}
                      style={{
                        // background is now handled by Tailwind classes above
                      }}
                    >
                      <div className={`flex items-start space-x-2 ${m.sender === "user" ? "flex-row-reverse space-x-reverse" : ""}`}>
                        {m.sender === "ai" && (
                          <div className="w-6 h-6 bg-[#F0FDF4] text-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Bot className="w-3 h-3" />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="text-sm leading-relaxed">{m.text}</p>
                          <p className={`text-[11px] mt-1 ${m.sender === "user" ? "text-white/80 text-right" : "text-gray-400"}`}>
                            {m.timestamp.toLocaleTimeString("bn-BD", { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                        {m.sender === "user" && (
                          <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <User className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div className="flex justify-start" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="bg-white border border-[#eef6f0] rounded-2xl px-4 py-3 shadow-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-[#F0FDF4] text-primary rounded-full flex items-center justify-center">
                          <Bot className="w-3 h-3" />
                        </div>
                        <div className="flex space-x-1">
                          <motion.span className="w-2 h-2 bg-primary rounded-full" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity }} />
                          <motion.span className="w-2 h-2 bg-primary rounded-full" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} />
                          <motion.span className="w-2 h-2 bg-primary rounded-full" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border bg-white">
                <div className="flex items-end justify-between gap-3">
                  <div className="flex-1 relative flex items-end">
                    <textarea
                      ref={inputRef}
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={onKey}
                      placeholder="Your Question.."
                      className="w-full px-4 py-3 pr-12 border border-[#e8eee9] rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)] focus:border-transparent text-sm max-h-24"
                      rows="1"
                      style={{ minHeight: "48px" }}
                      aria-label="Type your message"
                    />
                    <motion.button
                      onClick={toggleMic}
                      aria-label="Voice input"
                      className={`absolute right-3  flex items-center justify-center top-1/2 -translate-y-1/2 p-2 rounded-full touch-target transition-all ${isListening ? "bg-red-500 text-white shadow-lg" : "bg-[#F0FDF4] text-primary hover:brightness-95"}`}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Mic className={`w-4 h-4 ${isListening ? "animate-pulse" : ""}`} />
                    </motion.button>
                  </div>
                  <motion.button
                    onClick={handleSend}
                    disabled={!inputText.trim()}
                    className="ml-2 p-3 rounded-2xl bg-primary text-white shadow-soft hover:brightness-95 disabled:bg-gray-300 disabled:cursor-not-allowed touch-target flex-shrink-0"
                    whileHover={{ scale: inputText.trim() ? 1.05 : 1 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Send message"
                  >
                    <Send className="w-5 h-5" />
                  </motion.button>
                </div>
                <p className="text-[11px] text-gray-500 mt-2 text-center">AI দ্বারা উৎপন্ন তথ্য। গুরুত্বপূর্ণ সিদ্ধান্তে ডাক্তারের পরামর্শ নিন।</p>
              </div>
            </motion.div>
          )}

          {/* Minimized bar */}
          {isMinimized && (
            <motion.div
              className="fixed bottom-4 right-4 z-[60] bg-white border border-[#eef6f0] rounded-2xl shadow-lg flex items-center px-4 py-2 space-x-3 cursor-pointer min-w-[220px] max-w-xs"
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              style={{ boxShadow: "0 4px 24px 0 rgba(0,0,0,0.10)" }}
              onClick={handleRestore}
              role="button"
              tabIndex={0}
              aria-label="Restore chat"
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white bg-gradient-to-br from-[var(--primary)] to-[#3a9f4f]">
                <Bot className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <span className="font-semibold text-main text-sm">AI Health Chat</span>
                <span className="ml-2 w-2 h-2 inline-block rounded-full bg-primary animate-pulse align-middle" />
              </div>
              <motion.button
                onClick={(e) => { e.stopPropagation(); setIsMinimized(false); }}
                className="p-1 rounded-full hover:bg-[#F0FDF4] transition-colors touch-target"
                aria-label="Restore chat"
                whileTap={{ scale: 0.95 }}
                tabIndex={-1}
                type="button"
              >
                {/* Up arrow or expand icon, but using Minus rotated for simplicity */}
                <Minus className="w-4 h-4 text-gray-500 rotate-90" />
              </motion.button>
              <motion.button
                onClick={(e) => { e.stopPropagation(); onClose(); }}
                className="p-1 rounded-full hover:bg-[#F0FDF4] transition-colors touch-target ml-1"
                aria-label="Close chat"
                whileTap={{ scale: 0.95 }}
                tabIndex={-1}
                type="button"
              >
                <X className="w-4 h-4 text-gray-500" />
              </motion.button>
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  )
}
