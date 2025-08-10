// OpenRouter + DeepSeek integration and helpers
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'
const DEFAULT_MODEL = process.env.OPENROUTER_MODEL || 'deepseek/deepseek-chat'

async function chatWithOpenRouter(messages, options = {}) {
  const apiKey = process.env.OPENROUTER_API_KEY || ''
  if (!apiKey) throw new Error('Missing OPENROUTER_API_KEY')

  const res = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'HTTP-Referer': process.env.OPENROUTER_SITE || 'http://localhost',
      'X-Title': process.env.OPENROUTER_TITLE || 'SasthoAi',
    },
    body: JSON.stringify({
      model: options.model || DEFAULT_MODEL,
      temperature: options.temperature ?? 0.2,
      messages,
      // force JSON when requested
      ...(options.response_format ? { response_format: options.response_format } : {}),
    }),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`OpenRouter error: ${res.status} ${text}`)
  }
  const data = await res.json()
  const content = (data?.choices?.[0]?.message?.content || '').toString()
  return content
}

// Legacy simple string response, kept for compatibility with existing routes
export async function getAIResponse(prompt) {
  const systemPrompt = 'You are SasthoAi, a helpful Bengali health assistant. Provide concise, safe, and balanced information in Bengali. Avoid diagnosis; suggest consulting a doctor for serious issues.'
  try {
    const content = await chatWithOpenRouter([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: String(prompt) },
    ])
    return content
  } catch (err) {
    // Optional fallback to Puter if configured
    const puterApiBase = process.env.PUTER_API_BASE || 'https://api.puter.com/v2'
    const puterApiKey = process.env.PUTER_API_KEY || ''
    if (puterApiKey) {
      const res = await fetch(`${puterApiBase}/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${puterApiKey}`,
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: String(prompt) },
          ],
        }),
      })
      if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new Error(`Puter API error: ${res.status} ${text}`)
      }
      const data = await res.json()
      return (data?.choices?.[0]?.message?.content || data?.content || '').toString()
    }
    if (process.env.NODE_ENV !== 'production') {
      return 'ডেভেলপমেন্ট মোড: OPENROUTER_API_KEY দিন অথবা PUTER_API_KEY সেট করুন।'
    }
    throw err
  }
}

export async function getSuggestionsFromAI(query) {
  const system = 'বাংলায় সংক্ষিপ্ত, নিরাপদ স্বাস্থ্য সাজেশন দাও। শুধু রোগ/অবস্থার নাম দিন।'
  const user = `ব্যবহারকারীর ইনপুট: "${query}"। এর সাথে সম্পর্কিত ৬টি সম্ভাব্য রোগ/অবস্থার নাম বাংলায় একটি JSON অ্যারে হিসেবে ফেরত দাও, যেমন: ["ডায়াবেটিস", "উচ্চ রক্তচাপ", ...]। শুধু অ্যারে দাও।`
  const content = await chatWithOpenRouter([
    { role: 'system', content: system },
    { role: 'user', content: user },
  ], { temperature: 0.2 })
  // Try to extract JSON array
  const match = content.match(/\[[\s\S]*?\]/)
  if (match) {
    try {
      const list = JSON.parse(match[0])
      if (Array.isArray(list)) return list.map(v => String(v)).slice(0, 6)
    } catch (_) {}
  }
  // Fallback: split by comma/newline
  const rough = content.replace(/^[^\[]*\[/, '').replace(/\][^\]]*$/, '')
  const list = rough.split(/[\n,]/).map(s => s.trim()).filter(Boolean).slice(0, 6)
  return list
}

export async function getDiseaseDetailsFromAI(name) {
  const system = 'You are SasthoAi, a helpful Bengali health assistant. Provide concise, safe, balanced information in Bengali. Avoid diagnosis; suggest consulting a doctor for serious issues.'
  const user = `রোগ: ${name}। নিম্নলিখিত বিভাগে সংক্ষিপ্ত বুলেট পয়েন্টে তথ্য দিন: লক্ষণ, কারণ, প্রতিকার, চিকিৎসা, স্বাস্থ্য নিয়ম, খাদ্য তালিকা, অন্যান্য তথ্য। শুধুমাত্র JSON অবজেক্ট রিটার্ন করুন: {"symptoms":[],"causes":[],"prevention":[],"treatment":[],"healthGuidelines":[],"diet":[],"otherInfo":[]}`
  const content = await chatWithOpenRouter([
    { role: 'system', content: system },
    { role: 'user', content: user },
  ], { temperature: 0.3 })
  // Try parse JSON object
  try {
    const obj = JSON.parse(content)
    return obj
  } catch (_) {
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      try { return JSON.parse(jsonMatch[0]) } catch (_) {}
    }
  }
  return null
}



