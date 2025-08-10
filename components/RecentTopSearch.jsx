"use client"
import { motion } from "framer-motion"
import { Clock, Flame, ArrowRight } from 'lucide-react'
import Link from "next/link"

export default function RecentTopSearch() {
  const recent = ["ডায়াবেটিস", "উচ্চ রক্তচাপ", "হাঁপানি"]
  const top = [
    { name: "ডায়াবেটিস", searches: "2.1M" },
    { name: "উচ্চ রক্তচাপ", searches: "1.8M" },
    { name: "হৃদরোগ", searches: "1.4M" },
    { name: "হাঁপানি", searches: "1.1M" },
    { name: "মাইগ্রেন", searches: "0.9M" }
  ]

  const getSlug = (q) => q.toLowerCase().replace(/\s+/g, "-")

  return (
    <section className="px-4 pb-10">
      <div className="max-w-md mx-auto space-y-8">
        {/* Recent Searches */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center space-x-2 mb-3">
            <Clock className="w-4 h-4 text-gray-500" />
            <h3 className="text-sm font-semibold text-main">Recent searches</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {recent.map((r, i) => (
              <motion.div
                key={r}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.05 * i }}
              >
                <Link
                  href={`/disease/${getSlug(r)}`}
                  className="px-3 py-2 bg-white text-main rounded-full text-sm border border-[#e1f3e7] hover:bg-[#F0FDF4] hover:text-[color:var(--primary)] shadow-card transition-colors"
                  prefetch={false}
                >
                  {r}
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Top Searched Diseases */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Flame className="w-4 h-4 text-orange-500" />
              <h3 className="text-sm font-semibold text-main">Top searched diseases</h3>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 py-1">
            {top.slice(0, 4).map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.06 * i }}
              >
                <Link
                  href={`/disease/${getSlug(item.name)}`}
                  className="w-full bg-white rounded-2xl p-4 border border-[#e1f3e7] shadow-card text-left hover:shadow-md transition-shadow block"
                  prefetch={false}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-main">{item.name}</span>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="text-xs text-gray-500">{item.searches} searches</div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
