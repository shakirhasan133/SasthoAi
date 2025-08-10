"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Sparkles } from "lucide-react"

export default function CentralSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredSuggestions, setFilteredSuggestions] = useState([])

  const healthSuggestions = [
    "ডায়াবেটিস",
    "উচ্চ রক্তচাপ",
    "হৃদরোগ",
    "হাঁপানি",
    "মাইগ্রেন",
    "জ্বর",
    "কাশি",
    "মাথাব্যথা",
    "পেটব্যথা",
    "বুকব্যথা",
    "শ্বাসকষ্ট",
    "বমি",
    "ডায়রিয়া",
    "চর্মরোগ",
    "অ্যালার্জি",
    "আর্থ্রাইটিস",
    "থাইরয়েড",
    "কিডনি রোগ",
    "লিভার রোগ",
    "ক্যান্সার",
  ]

  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchQuery(value)

    if (value.length > 0) {
      const filtered = healthSuggestions.filter(
        (suggestion) => suggestion.toLowerCase().includes(value.toLowerCase()) || suggestion.includes(value),
      )
      setFilteredSuggestions(filtered.slice(0, 5))
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion)
    setShowSuggestions(false)
    handleSearch(suggestion)
  }

  const handleSearch = async (query = searchQuery) => {
    const q = query.trim()
    if (!q) return
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      // If results exist, navigate to the first result by name; otherwise fallback to slug from query
      const target = data?.[0]?.name || q
      window.location.href = `/disease/${target.toLowerCase().replace(/\s+/g, "-")}`
    } catch (e) {
      window.location.href = `/disease/${q.toLowerCase().replace(/\s+/g, "-")}`
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSearch()
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      <motion.section
        className="w-full max-w-md"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* AI Badge */}
        <motion.div
          className="text-center mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <motion.div
            className="inline-flex items-center space-x-2 bg-purple-50 px-4 py-2 rounded-full mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-medium text-purple-700">AI-Powered Health Search</span>
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">What health concern can I help you with?</h2>
          <p className="text-gray-600">Search any disease or symptom for instant information</p>
        </motion.div>

        {/* Search Input */}
        <div className="relative">
          <motion.div
            className="relative bg-white rounded-3xl shadow-lg border-2 border-green-100 overflow-hidden"
            whileFocus={{ borderColor: "#4CB963" }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center p-2">
              <div className="pl-4 pr-2">
                <Search className="w-6 h-6 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Type disease name here..."
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyPress={handleKeyPress}
                className="flex-1 py-4 px-2 text-gray-800 placeholder-gray-400 bg-transparent border-none outline-none text-lg"
                aria-label="Search health information"
              />
            </div>
          </motion.div>

          {/* Suggestions Dropdown */}
          {showSuggestions && filteredSuggestions.length > 0 && (
            <motion.div
              className="absolute top-full left-0 right-0 bg-white rounded-2xl shadow-xl border border-green-100 mt-2 overflow-hidden z-10"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {filteredSuggestions.map((suggestion, index) => (
                <motion.button
                  key={suggestion}
                  className="w-full text-left px-6 py-4 hover:bg-green-50 transition-colors duration-150 border-b border-gray-50 last:border-b-0"
                  onClick={() => handleSuggestionClick(suggestion)}
                  whileHover={{ backgroundColor: "rgba(76, 185, 99, 0.05)" }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <span className="text-gray-800 font-medium text-lg">{suggestion}</span>
                </motion.button>
              ))}
            </motion.div>
          )}

          {/* Search Button */}
          <motion.button
            onClick={() => handleSearch()}
            disabled={!searchQuery.trim()}
            className="w-full mt-4 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-5 rounded-3xl font-semibold text-lg shadow-lg transition-all duration-200"
            whileHover={{ scale: searchQuery.trim() ? 1.02 : 1 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {searchQuery.trim() ? "Search Disease Info" : "Enter a disease name"}
          </motion.button>
        </div>

        {/* Quick Examples */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <p className="text-sm text-gray-500 mb-3">Popular searches:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {["ডায়াবেটিস", "উচ্চ রক্তচাপ", "হাঁপানি"].map((example, index) => (
              <motion.button
                key={example}
                onClick={() => handleSuggestionClick(example)}
                className="px-4 py-2 bg-gray-100 hover:bg-green-50 hover:text-green-600 text-gray-600 rounded-full text-sm font-medium transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.9 + index * 0.1 }}
              >
                {example}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.section>
    </div>
  )
}
