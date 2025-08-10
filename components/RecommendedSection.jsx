"use client"
import { motion } from "framer-motion"
import { BookOpen, Clock, Star } from "lucide-react"

const articles = [
  {
    title: "10 Early Signs of Diabetes You Shouldn't Ignore",
    readTime: "5 min read",
    rating: 4.8,
    image: "/placeholder.svg?height=120&width=200",
    category: "Prevention",
  },
  {
    title: "Understanding Heart Disease: Causes and Prevention",
    readTime: "7 min read",
    rating: 4.9,
    image: "/placeholder.svg?height=120&width=200",
    category: "Cardiology",
  },
  {
    title: "Mental Health: Managing Stress and Anxiety",
    readTime: "6 min read",
    rating: 4.7,
    image: "/placeholder.svg?height=120&width=200",
    category: "Mental Health",
  },
]

export default function RecommendedSection() {
  return (
    <motion.section
      className="px-4 py-6 pb-24"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
    >
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-green-500" />
            <h3 className="text-lg font-semibold text-gray-800">Recommended Articles</h3>
          </div>
          <button className="text-green-500 text-sm font-medium hover:text-green-600 transition-colors">
            View All
          </button>
        </div>

        <div className="space-y-4">
          {articles.map((article, index) => (
            <motion.article
              key={article.title}
              className="bg-white rounded-xl overflow-hidden shadow-card border border-gray-50 hover:border-green-100 transition-all duration-200 cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
            >
              <div className="flex">
                <div className="flex-1 p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full font-medium">
                      {article.category}
                    </span>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2 line-clamp-2 leading-tight">{article.title}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{article.readTime}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>{article.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="w-20 h-20 m-4 rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={article.image || "/placeholder.svg"}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
