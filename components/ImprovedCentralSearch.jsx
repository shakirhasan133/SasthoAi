"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { Search, BrainCircuit } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"


export default function ImprovedCentralSearch() {
  const router = useRouter()
  const [query, setQuery] = useState("")

  const handleSearch = async (e) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) return
    const slug = encodeURIComponent(trimmed.toLowerCase().replace(/\s+/g, '-'))
    router.push(`/disease/${slug}`)
  }

  const handleKey = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSearch(e)
    }
  }

  return (
    <motion.div
      className="w-full max-w-2xl mx-auto my-8"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, delay: 0.2 }}
    >
      <form
        onSubmit={handleSearch}
        className="relative rounded-full shadow-lg bg-white flex items-center"
      >
        <Search className="absolute left-6 w-5 h-5 text-gray-400" />
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKey}
          placeholder="e.g., Diabetes, Hypertension, Migraine..."
          className="w-full pl-14 pr-40 py-4 text-lg bg-transparent rounded-full focus:outline-none text-gray-800 placeholder-gray-400 h-14"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white rounded-full px-6 py-2.5 font-semibold text-base hover:bg-primary/90 transition-colors flex items-center"
        >
          <BrainCircuit className="w-5 h-5 mr-2" />
          <span>AI Search</span>
        </button>
      </form>

      <div className="mt-8" />
    </motion.div>
  )
}
