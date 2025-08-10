"use client"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Mic, TrendingUp, Send } from 'lucide-react'
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function ImprovedCentralSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredSuggestions, setFilteredSuggestions] = useState([])
  const [aiSuggestions, setAiSuggestions] = useState([])
  const [aiLoading, setAiLoading] = useState(false)
  const latestReqIdRef = useRef(0)
  const [isListening, setIsListening] = useState(false)
  const inputRef = useRef(null)
  const router = useRouter()

  const healthSuggestions = [
    { name: "ডায়াবেটিস", trending: true }, { name: "উচ্চ রক্তচাপ", trending: true },
    { name: "হৃদরোগ", trending: false }, { name: "হাঁপানি", trending: true },
    { name: "মাইগ্রেন", trending: false }, { name: "জ্বর", trending: false },
    { name: "কাশি", trending: false }, { name: "মাথাব্যথা", trending: false },
    { name: "পেটব্যথা", trending: false }, { name: "বুকব্যথা", trending: false }
  ]

  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchQuery(value)
    if (value.length > 0) {
      const filtered = healthSuggestions.filter(s => s.name.toLowerCase().includes(value.toLowerCase()) || s.name.includes(value))
      setFilteredSuggestions(filtered.slice(0, 6))
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }

  // Debounced AI autocomplete using server API (OpenRouter/DeepSeek)
  useEffect(() => {
    const q = searchQuery.trim()
    if (!q) {
      setAiSuggestions([])
      return
    }
    const timeout = setTimeout(async () => {
      const reqId = ++latestReqIdRef.current
      try {
        setAiLoading(true)
        const resp = await fetch(`/api/suggest?q=${encodeURIComponent(q)}`)
        let list = []
        if (resp.ok) {
          const arr = await resp.json()
          if (Array.isArray(arr)) list = arr
        }
        const unique = Array.from(new Set((list || []).map(s => String(s))))
        if (latestReqIdRef.current === reqId) {
          setAiSuggestions(unique)
        }
      } catch (_) {
        if (latestReqIdRef.current === reqId) setAiSuggestions([])
      } finally {
        if (latestReqIdRef.current === reqId) setAiLoading(false)
      }
    }, 350)
    return () => clearTimeout(timeout)
  }, [searchQuery])

  const goToDisease = (q) => {
    const slug = q.toLowerCase().replace(/\s+/g, "-")
    router.push(`/disease/${slug}`)
  }

  const handleSuggestionClick = (s) => {
    setSearchQuery(s.name)
    setShowSuggestions(false)
    goToDisease(s.name)
  }

  const handleVoice = () => {
    setIsListening(!isListening)
    inputRef.current?.focus()
  }

  const handleSubmit = async () => {
    const q = searchQuery.trim()
    if (!q) return
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      const target = data?.[0]?.name || q
      goToDisease(target)
    } catch (e) {
      goToDisease(q)
    }
  }

  const handleKey = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <section className="flex items-center justify-center px-4 py-8">
      <motion.div
        className="w-full max-w-md"
        initial={{ scale: 0.97, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative">
          <div className="relative bg-white rounded-3xl shadow-card border border-[#e1f3e7] overflow-visible transition-shadow">
            <div className="flex items-center gap-2 py-2 pl-4 pr-2">      
              <Input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleKey}
                placeholder="Type a disease name..."
                aria-label="Search diseases"
                className="flex-1 h-12 bg-transparent border-0 ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-2 text-[16px] text-main placeholder:text-gray-400 shadow-none"
              />
              <div className="flex items-center gap-2 pr-1">
                <motion.button
                  onClick={handleVoice}
                  aria-label="Voice search"
                  className={`inline-flex items-center justify-center w-11 h-11 rounded-2xl transition-colors duration-200 ${isListening ? "bg-red-500 text-white shadow-lg" : "bg-gray-50 text-gray-600 hover:bg-[#F0FDF4] hover:text-primary"}`}
                  whileTap={{ scale: 0.95 }}
                >
                  <Mic className={`w-5 h-5 ${isListening ? "animate-pulse" : ""}`} />
                </motion.button>
                <motion.button
                  onClick={handleSubmit}
                  aria-label="Search"
                  disabled={!searchQuery.trim()}
                  className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-primary text-white shadow-soft disabled:bg-gray-300 disabled:text-white/80 disabled:cursor-not-allowed hover:brightness-95 transition-colors"
                  whileHover={{ scale: searchQuery.trim() ? 1.03 : 1 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Search className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {showSuggestions && (filteredSuggestions.length > 0 || aiSuggestions.length > 0) && (
              <motion.div
                className="absolute top-full left-0 right-0 bg-white rounded-2xl shadow-2xl border border-[#e1f3e7] mt-2 overflow-hidden z-20"
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                role="listbox"
                aria-label="Search suggestions"
              >
                {/* AI suggestions first if available */}
                {aiSuggestions.map((name, i) => {
                  const slug = String(name).toLowerCase().replace(/\s+/g, "-")
                  return (
                    <Link key={`ai-${i}-${name}`} href={`/disease/${slug}`} passHref legacyBehavior>
                      <motion.a
                        className="w-full text-left px-4 py-3 hover:bg-[#F0FDF4] transition-colors duration-150 border-b border-gray-50 block"
                        whileHover={{ scale: 1.005 }}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.02, duration: 0.18 }}
                        role="option"
                        aria-selected="false"
                        tabIndex={0}
                        onClick={() => { setSearchQuery(String(name)); setShowSuggestions(false) }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-main font-medium">{String(name)}</span>
                          <span className="inline-flex items-center text-xs text-purple-600">AI</span>
                        </div>
                      </motion.a>
                    </Link>
                  )
                })}

                {filteredSuggestions.map((s, i) => {
                  const slug = s.name.toLowerCase().replace(/\s+/g, "-")
                  return (
                    <Link
                      key={`local-${s.name}`}
                      href={`/disease/${slug}`}
                      onClick={() => {
                        setSearchQuery(s.name)
                        setShowSuggestions(false)
                      }}
                      passHref
                      legacyBehavior
                    >
                      <motion.a
                        className="w-full text-left px-4 py-3 hover:bg-[#F0FDF4] transition-colors duration-150 border-b border-gray-50 last:border-b-0 block"
                        whileHover={{ scale: 1.005 }}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (aiSuggestions.length * 0.02) + i * 0.03, duration: 0.2 }}
                        role="option"
                        aria-selected="false"
                        tabIndex={0}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-main font-medium">{s.name}</span>
                          {s.trending && (
                            <span className="inline-flex items-center text-xs text-orange-600">
                              <TrendingUp className="w-3 h-3 mr-1" /> Trending
                            </span>
                          )}
                        </div>
                      </motion.a>
                    </Link>
                  )
                })}
              </motion.div>
            )}
          </AnimatePresence>
          
        </div>
      </motion.div>
    </section>
  )
}
