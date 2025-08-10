"use client"
import { motion } from "framer-motion"

export default function Header() {
  return (
    <motion.header
      className="glass-effect sticky top-0 z-50 px-4 py-4 border-b border-green-100"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-md mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-soft">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">SasthoAi</h1>
            <p className="text-xs text-gray-600">Your AI Health Companion</p>
          </div>
        </div>
        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    </motion.header>
  )
}
