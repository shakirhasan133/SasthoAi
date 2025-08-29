"use client"

import { useState, useEffect } from 'react'
import ErrorBoundary from './ErrorBoundary'
import GlobalChat from './GlobalChat'

export default function SafeGlobalChat() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <ErrorBoundary>
      <GlobalChat />
    </ErrorBoundary>
  )
}
