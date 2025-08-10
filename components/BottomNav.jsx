"use client"
import { motion } from "framer-motion"
import { Home, Search, User } from "lucide-react"

export default function BottomNav() {
  const navItems = [
    { icon: Home, label: "Home", active: true },
    { icon: Search, label: "Search", active: false },
    { icon: User, label: "Profile", active: false },
  ]

  return (
    <motion.nav
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-2 z-50"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
    >
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-around">
          {navItems.map((item, index) => (
            <motion.button
              key={item.label}
              className={`flex flex-col items-center space-y-1 py-2 px-4 rounded-xl transition-all duration-200 ${
                item.active ? "text-green-500 bg-green-50" : "text-gray-400 hover:text-gray-600"
              }`}
              whileTap={{ scale: 0.95 }}
              aria-label={item.label}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.nav>
  )
}
