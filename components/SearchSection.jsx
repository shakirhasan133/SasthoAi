"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Mic, Sparkles } from "lucide-react"

export default function SearchSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isListening, setIsListening] = useState(false)
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

  const handleVoiceSearch = () => {
    setIsListening(!isListening)
    // Voice search functionality would be implemented here
  }

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
    // Navigate to disease details page
    setTimeout(() => {
      window.location.href = `/disease/${suggestion.toLowerCase().replace(/\s+/g, "-")}`
    }, 100)
  }

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Navigate to disease details page
      window.location.href = `/disease/${searchQuery.toLowerCase().replace(/\s+/g, "-")}`
    }
  }

  return (
    <motion.section
      className="px-4 py-8"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
          <motion.div
            className="inline-flex items-center space-x-2 bg-purple-50 px-4 py-2 rounded-full mb-4"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-medium text-purple-700">AI-Powered Health Search</span>
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">What health concern can I help you with?</h2>
          <p className="text-gray-600 text-sm">Search any disease or symptom for instant AI-generated information</p>
        </div>

        <div className="relative">
          <div className="relative bg-white rounded-2xl shadow-card border border-green-100 overflow-hidden">
            <div className="flex items-center">
              <div className="pl-4 pr-2">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search diseases, symptoms, treatments..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="flex-1 py-4 px-2 text-gray-800 placeholder-gray-400 bg-transparent border-none outline-none text-base"
                aria-label="Search health information"
              />
              <motion.button
                onClick={handleVoiceSearch}
                className={`m-2 p-3 rounded-xl transition-all duration-200 ${
                  isListening
                    ? "bg-red-500 text-white"
                    : "bg-gray-50 text-gray-600 hover:bg-green-50 hover:text-green-600"
                }`}
                whileTap={{ scale: 0.95 }}
                aria-label="Voice search"
              >
                <Mic className={`w-5 h-5 ${isListening ? "animate-pulse" : ""}`} />
              </motion.button>
            </div>
          </div>

          {showSuggestions && filteredSuggestions.length > 0 && (
            <motion.div
              className="absolute top-full left-0 right-0 bg-white rounded-2xl shadow-lg border border-green-100 mt-2 overflow-hidden z-10"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {filteredSuggestions.map((suggestion, index) => (
                <motion.button
                  key={suggestion}
                  className="w-full text-left px-4 py-3 hover:bg-green-50 transition-colors duration-150 border-b border-gray-50 last:border-b-0"
                  onClick={() => handleSuggestionClick(suggestion)}
                  whileHover={{ backgroundColor: "rgba(76, 185, 99, 0.05)" }}
                >
                  <span className="text-gray-800 font-medium">{suggestion}</span>
                </motion.button>
              ))}
            </motion.div>
          )}

          {searchQuery && (
            <motion.button
              className="w-full mt-3 bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl font-semibold shadow-soft transition-colors duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={handleSearch}
            >
              Search with AI
            </motion.button>
          )}
        </div>
      </div>
    </motion.section>
  )
}
