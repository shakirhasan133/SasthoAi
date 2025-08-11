"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { Search, BrainCircuit, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Input } from "@/components/ui/input"


export default function ImprovedCentralSearch() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsLoading(true)
    setError(null)
    setResults(null)

    try {
      const res = await fetch(`/api/disease?name=${encodeURIComponent(query.trim())}`)
      if (!res.ok) {
        throw new Error('Failed to fetch disease details')
      }
      const data = await res.json()
      setResults(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
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
          disabled={isLoading}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white rounded-full px-6 py-2.5 font-semibold text-base hover:bg-primary/90 transition-colors flex items-center disabled:bg-primary/70"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            <BrainCircuit className="w-5 h-5 mr-2" />
          )}
          <span>{isLoading ? 'Searching...' : 'AI Search'}</span>
        </button>
      </form>

      <div className="mt-8">
        {error && <p className="text-red-500 text-center">{error}</p>}
        {results && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{query}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-lg">Symptoms</h4>
                <ul className="list-disc pl-5 text-gray-700">
                  {results.symptoms?.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-lg">Treatments</h4>
                <ul className="list-disc pl-5 text-gray-700">
                  {results.treatment?.map((t, i) => <li key={i}>{t}</li>)}
                </ul>
              </div>
               {results.causes?.length > 0 && (
                <div>
                  <h4 className="font-semibold text-lg">Causes</h4>
                  <ul className="list-disc pl-5 text-gray-700">
                    {results.causes.map((c, i) => <li key={i}>{c}</li>)}
                  </ul>
                </div>
              )}
              {results.prevention?.length > 0 && (
                <div>
                  <h4 className="font-semibold text-lg">Prevention</h4>
                  <ul className="list-disc pl-5 text-gray-700">
                    {results.prevention.map((p, i) => <li key={i}>{p}</li>)}
                  </ul>
                </div>
              )}
              {results.healthGuidelines?.length > 0 && (
                <div>
                  <h4 className="font-semibold text-lg">Health Guidelines</h4>
                  <ul className="list-disc pl-5 text-gray-700">
                    {results.healthGuidelines.map((h, i) => <li key={i}>{h}</li>)}
                  </ul>
                </div>
              )}
              {results.diet?.length > 0 && (
                <div>
                  <h4 className="font-semibold text-lg">Diet</h4>
                  <ul className="list-disc pl-5 text-gray-700">
                    {results.diet.map((d, i) => <li key={i}>{d}</li>)}
                  </ul>
                </div>
              )}
              {results.otherInfo?.length > 0 && (
                <div>
                  <h4 className="font-semibold text-lg">Other Info</h4>
                  <ul className="list-disc pl-5 text-gray-700">
                    {results.otherInfo.map((o, i) => <li key={i}>{o}</li>)}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </motion.div>
  )
}
