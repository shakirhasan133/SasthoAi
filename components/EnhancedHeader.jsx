"use client"
import { motion } from "framer-motion"
import { Sparkles } from 'lucide-react'

export default function EnhancedHeader() {
  return (
    <motion.header
      className="px-4 pt-8 pb-4"
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-md mx-auto text-center">
        <motion.div
          className="flex items-center justify-center space-x-3 mb-3"
          whileHover={{ scale: 1.03 }}
        >
          <div
            className="w-12 h-12 rounded-2xl shadow-soft flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, var(--primary), #3a9f4f)" }}
            aria-label="SasthoAi logo"
          >
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <h1 className="text-3xl font-bold text-main">SasthoAi</h1>
        </motion.div>

        <div className="flex items-center justify-center space-x-2 mb-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm text-gray-600 font-medium">AI Powered</span>
        </div>

        <p className="text-gray-700 text-base font-medium">Find trusted health info instantly</p>
      </div>
    </motion.header>
  )
}
