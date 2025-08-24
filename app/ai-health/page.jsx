"use client"

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Send, CornerDownLeft, Brain } from 'lucide-react'
import EnhancedHeader from '../../components/EnhancedHeader'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import useAuth from '../../hooks/use-auth'

const ChatMessage = ({ message, type }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className={`flex mb-4 ${type === 'user' ? 'justify-end' : 'justify-start'}`}
  >
    <div
      className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-sm relative
        ${type === 'user'
          ? 'bg-primary text-primary-foreground rounded-br-none ml-8'
          : 'bg-card text-card-foreground rounded-bl-none mr-8 border border-border'
        }`}
    >
      {type === 'ai' && (
        <Brain className="absolute -left-8 top-1 h-6 w-6 text-primary" />
      )}
      <p className="text-sm sm:text-base leading-relaxed">{message}</p>
    </div>
  </motion.div>
)

export default function AiHealthPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi there! I'm Sastho AI, your personal health assistant. How can I help you today?", type: 'ai' },
    { id: 2, text: "I've been feeling a bit under the weather. Could you tell me about the symptoms of a common cold?", type: 'user' },
  ])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (input.trim() === '') return

    const newUserMessage = { id: messages.length + 1, text: input, type: 'user' }
    setMessages(prevMessages => [...prevMessages, newUserMessage])
    setInput('')

    // Simulate AI response
    const aiResponse = { id: messages.length + 2, text: "For a common cold, you might experience symptoms like a runny nose, sore throat, cough, congestion, slight body aches, or a mild headache. Remember, this is general information and not a substitute for professional medical advice.", type: 'ai' }
    setTimeout(() => {
      setMessages(prevMessages => [...prevMessages, aiResponse])
    }, 1500)
  }

  if (loading || !user) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-background to-white">
        <EnhancedHeader />
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-lg text-muted-foreground">Loading AI Health...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="flex flex-col h-screen bg-gradient-to-b from-background to-white">
      <EnhancedHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4 pt-4 pb-20 sm:pb-24 max-w-2xl mx-auto w-full"> {/* Added pb-20/24 for input space */}
        {messages.map(msg => (
          <ChatMessage key={msg.id} message={msg.text} type={msg.type} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 shadow-lg-top z-10 sm:p-6"> {/* Fixed input at bottom */}
        <div className="max-w-2xl mx-auto flex space-x-3">
          <Input
            type="text"
            placeholder="Ask Sastho AI anything..."
            className="flex-1 rounded-xl border border-input focus:border-primary focus:ring-1 focus:ring-primary shadow-sm text-base py-3 px-4"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => { if (e.key === 'Enter') handleSendMessage() }}
          />
          <Button
            size="icon"
            className="rounded-xl w-12 h-12 bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2 shadow-md"
            onClick={handleSendMessage}
          >
            <Send className="h-6 w-6" /> {/* Increased icon size */}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center flex items-center justify-center">
          Press <CornerDownLeft className="inline-block h-4 w-4 mx-1" /> {/* Increased icon size */}
          to send
        </p>
      </div>
    </main>
  )
}
