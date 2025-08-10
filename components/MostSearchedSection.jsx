"use client"
import { motion } from "framer-motion"
import { TrendingUp, ChevronRight } from "lucide-react"

const popularDiseases = [
  { name: "Diabetes", searches: "2.1M", trend: "+12%" },
  { name: "Hypertension", searches: "1.8M", trend: "+8%" },
  { name: "COVID-19", searches: "1.5M", trend: "-5%" },
  { name: "Migraine", searches: "980K", trend: "+15%" },
  { name: "Asthma", searches: "750K", trend: "+3%" },
]

export default function MostSearchedSection() {
  return (
    <motion.section
      className="px-4 py-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <h3 className="text-lg font-semibold text-gray-800">Most Searched</h3>
          </div>
          <button className="text-green-500 text-sm font-medium hover:text-green-600 transition-colors">
            View All
          </button>
        </div>

        <div className="space-y-3">
          {popularDiseases.map((disease, index) => (
            <motion.div
              key={disease.name}
              className="bg-white rounded-xl p-4 shadow-card border border-gray-50 hover:border-green-100 transition-all duration-200 cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 mb-1">{disease.name}</h4>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-500">{disease.searches} searches</span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        disease.trend.startsWith("+") ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                      }`}
                    >
                      {disease.trend}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
