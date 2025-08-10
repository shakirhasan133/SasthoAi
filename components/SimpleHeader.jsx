"use client"
import { motion } from "framer-motion"

export default function SimpleHeader() {
  return (
    <motion.header
      className="px-4 py-6"
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-md mx-auto text-center">
        <motion.div
          className="flex items-center justify-center space-x-3 mb-3"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-soft">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">SasthoAi</h1>
        </motion.div>
        <p className="text-gray-600 text-lg font-medium">Find trusted health info instantly</p>
      </div>
    </motion.header>
  )
}
