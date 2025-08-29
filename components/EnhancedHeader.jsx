"use client"
import { motion } from "framer-motion"
import { Sparkles, LogIn, LogOut } from 'lucide-react'
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import { Button } from './ui/button'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import MobileMenu from './MobileMenu' // Import the new MobileMenu component
import { useRouter } from 'next/navigation' // Import useRouter
import useAuth from "@/hooks/use-auth"

export default function EnhancedHeader() {
  const { user, loading } = useAuth()
  const router = useRouter() // Initialize useRouter

  const handleLogin = async () => {
    try {
    } catch (error) {
      console.error("Login failed:", error)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      await fetch('/api/auth/logout', { method: 'POST' })
      window.location.reload() // Refresh to clear server-side context
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <motion.header
      className="px-4 pt-6 pb-4 bg-blue-600 sticky top-0 z-50 h-[80px]"
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <MobileMenu /> {/* Mobile menu for smaller screens */}
          <div
            className="w-10 h-10 rounded-xl shadow-soft flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, var(--primary), #3a9f4f)" }}
            aria-label="SasthoAi logo"
          >
            <span className="text-white font-bold text-lg">SasthoAi</span>
          </div>
          <h1 className="text-2xl font-bold text-main hidden sm:block">SasthoAi</h1>
        </div>

        <div className="hidden md:block"> {/* Hide desktop navigation on small screens */}
          {loading ? (
            <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage src={user.photoURL} />
                  <AvatarFallback>{user.displayName?.charAt(0)}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>{user.displayName}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/my-records')}>
                  My Records
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={handleLogin}>
              <LogIn className="mr-2 h-4 w-4" />
              Login
            </Button>
          )}
        </div>
      </div>
    </motion.header>
  )
}
