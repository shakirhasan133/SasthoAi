"use client"
import { motion } from "framer-motion"
import { MessageCircle, Search, Shield, Zap } from 'lucide-react'

export default function FeatureHighlights() {
  const features = [
    { icon: Search, title: "Instant Search", description: "Find disease info in seconds" },
    { icon: MessageCircle, title: "AI Chat", description: "Personalized health guidance" },
    { icon: Shield, title: "Trusted Info", description: "Clear, reliable content" },
    { icon: Zap, title: "Fast & Simple", description: "Mobile-first experience" }
  ]

  return (
    <motion.section
      className="px-4 pb-10"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
    >
      <div className="max-w-md mx-auto">
        <div className="grid grid-cols-2 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="bg-white rounded-2xl p-4 shadow-card border border-[#eef6f0] hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              whileHover={{ y: -2 }}
            >
              <div className="w-10 h-10 rounded-xl bg-[color:var(--bg-info)] text-primary flex items-center justify-center mb-2 border border-[#e1f3e7]">
                <f.icon className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-main text-sm">{f.title}</h4>
              <p className="text-xs text-gray-600">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
