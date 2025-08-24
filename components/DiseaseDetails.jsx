"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Activity, AlertCircle, Shield, Stethoscope, Heart, Utensils, Info, BookOpen, ChevronDown, Loader2 } from 'lucide-react'
import diseaseData from "./data/disease-samples"
import { useEffect } from 'react'

export default function DiseaseDetails({ diseaseSlug = "diabetes" }) {
  const [expanded, setExpanded] = useState({})
  const [aiContent, setAiContent] = useState(null)
  const [loading, setLoading] = useState(true)
  const disease = diseaseData[diseaseSlug]
  const resolvedName = disease?.name || decodeURIComponent(String(diseaseSlug)).replace(/-/g, ' ')

  useEffect(() => {
    let isCancelled = false
    setLoading(true)
    async function enrich() {
      try {
        const resp = await fetch(`/api/disease?name=${encodeURIComponent(resolvedName)}`)
        if (!resp.ok) {
          if (!isCancelled) setLoading(false)
          return
        }
        const json = await resp.json()
        if (!isCancelled && json && typeof json === 'object') {
          setAiContent({
            symptoms: Array.isArray(json.symptoms) ? json.symptoms : (disease?.symptoms || []),
            causes: Array.isArray(json.causes) ? json.causes : (disease?.causes || []),
            prevention: Array.isArray(json.prevention) ? json.prevention : (disease?.prevention || []),
            treatment: Array.isArray(json.treatment) ? json.treatment : (disease?.treatment || []),
            healthGuidelines: Array.isArray(json.healthGuidelines) ? json.healthGuidelines : (disease?.healthGuidelines || []),
            diet: Array.isArray(json.diet) ? json.diet : (disease?.diet || []),
            otherInfo: Array.isArray(json.otherInfo) ? json.otherInfo : (disease?.otherInfo || []),
          })
          setLoading(false)
        }
      } catch (_) {
        if (!isCancelled) setLoading(false)
      }
    }
    enrich()
    return () => { isCancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diseaseSlug])

  const sections = [
    { key: "symptoms", title: "লক্ষণ", icon: Activity, color: "red", data: aiContent?.symptoms || disease?.symptoms || [] },
    { key: "causes", title: "কারণ", icon: AlertCircle, color: "orange", data: aiContent?.causes || disease?.causes || [] },
    { key: "prevention", title: "প্রতিকার", icon: Shield, color: "green", data: aiContent?.prevention || disease?.prevention || [] },
    { key: "treatment", title: "চিকিৎসা", icon: Stethoscope, color: "blue", data: aiContent?.treatment || disease?.treatment || [] },
    { key: "healthGuidelines", title: "স্বাস্থ্য নিয়ম", icon: Heart, color: "purple", data: aiContent?.healthGuidelines || disease?.healthGuidelines || [] },
    { key: "diet", title: "খাদ্য তালিকা", icon: Utensils, color: "green", data: aiContent?.diet || disease?.diet || [] },
    { key: "otherInfo", title: "অন্যান্য প্রয়োজনীয় তথ্য", icon: Info, color: "gray", data: aiContent?.otherInfo || disease?.otherInfo || [] }
  ]

  const colorPill = (c) => ({
    red: "bg-red-50 text-red-600 border-red-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100",
    green: "bg-[#F0FDF4] text-primary border-[#e1f3e7]",
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
    gray: "bg-gray-50 text-gray-600 border-gray-100"
  }[c] || "bg-gray-50 text-gray-600 border-gray-100")

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0FDF4] to-white">
      <motion.header
        className="sticky top-0 z-50 px-4 py-4 border-b border-[#e1f3e7] bg-white/90 glass-effect"
        initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4 }}
      >
        <div className="max-w-md mx-auto flex items-center space-x-3">
          <motion.button onClick={() => window.history.back()} aria-label="Go back"
            className="p-2 rounded-xl bg-[#F0FDF4] text-primary shadow-md hover:brightness-95 focus:ring-2 focus:ring-primary focus:ring-offset-2"
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-main">রোগের বিস্তারিত</h1> {/* Adjusted font size for header title */}
            <p className="text-xs text-gray-600">AI চালিত স্বাস্থ্য তথ্য</p>
          </div>
        </div>
      </motion.header>

      <div className="px-4 py-6">
        <div className="max-w-md mx-auto">
          <motion.div
            className="bg-white rounded-3xl p-6 shadow-lg border border-[#e1f3e7] mb-8 text-center" /* Larger rounded corners, softer shadow, more margin */
            initial={{ scale: 0.97, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }}
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full text-white flex items-center justify-center" /* Rounded logo container */
                 style={{ background: "linear-gradient(135deg, var(--primary), #3a9f4f)" }}>
              <BookOpen className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-extrabold text-main mb-2">{resolvedName}</h2> {/* Larger, bolder disease name */}
            <p className="text-base text-gray-600 leading-relaxed">বিস্তারিত তথ্য ও পরামর্শ</p> {/* Larger description */}
          </motion.div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
              <span className="text-sm text-gray-500">AI চিন্তা করছে... একটু অপেক্ষা করুন</span>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {sections.map((s, idx) => (
                  <motion.div key={s.key}
                    className="bg-white rounded-2xl border border-[#f1f5f2] shadow-lg overflow-hidden" /* Softer shadow */
                    initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05, duration: 0.3 }}
                  >
                    <button
                      className="w-full p-4 flex items-center justify-between hover:bg-[#F7FFF9] transition-colors focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-t-2xl" /* Added focus ring, rounded top */
                      onClick={() => setExpanded(e => ({ ...e, [s.key]: !e[s.key] }))}
                      aria-expanded={!!expanded[s.key]} aria-controls={`${s.key}-content`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-xl border ${colorPill(s.color)}`}>
                          <s.icon className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-semibold text-main">{s.title}</h3>
                      </div>
                      <motion.div animate={{ rotate: expanded[s.key] ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      </motion.div>
                    </button>
                    <motion.div
                      id={`${s.key}-content`}
                      initial={false}
                      animate={{ height: expanded[s.key] ? "auto" : 0, opacity: expanded[s.key] ? 1 : 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 border-t border-[#f1f5f2]"> {/* Padding for content, border top */}
                        <ul className="space-y-3">
                          {s.data.map((item, i) => (
                            <li key={i} className="flex items-start space-x-3 text-gray-700">
                              <span className="w-2 h-2 rounded-full mt-2 bg-primary flex-shrink-0" /> {/* Added flex-shrink */} 
                              <span className="text-base leading-relaxed">{item}</span> {/* Larger text for list items */}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>

              <motion.div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-2xl p-4 shadow-md" /* Softer shadow, more margin */
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              >
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-yellow-700 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-yellow-800 leading-relaxed">
                    এই তথ্যগুলো শিক্ষামূলক। কোনো চিকিৎসা সিদ্ধান্তের আগে অবশ্যই ডাক্তারের পরামর্শ নিন।
                  </p>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
