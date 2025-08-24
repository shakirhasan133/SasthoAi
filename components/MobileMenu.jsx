"use client"

import { useState } from "react"
import { Menu, PlusCircle, Brain, MessageSquare, Home, FileText } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet"
import Link from "next/link"
import { Button } from "./ui/button"
import useAuth from "../hooks/use-auth"
import { useRouter } from "next/navigation"

export default function MobileMenu() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const handleLogin = () => {
    router.push('/login')
    setOpen(false)
  }

  const handleLogout = () => {
    logout()
    setOpen(false)
  }

  const handleLinkClick = (href) => {
    router.push(href)
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="bg-white text-main">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col space-y-4 py-4">
          <Button variant="ghost" onClick={() => handleLinkClick('/')} className="flex items-center justify-start">
            <Home className="mr-2 h-4 w-4" />
            Home
          </Button>
          <Button variant="ghost" onClick={() => handleLinkClick('/my-records')} className="flex items-center justify-start">
            <FileText className="mr-2 h-4 w-4" />
            My Records
          </Button>
          {user && (
            <Button variant="ghost" onClick={() => handleLinkClick('/my-records')} className="flex items-center justify-start">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Record
            </Button>
          )}
          {user && (
            <Button variant="ghost" onClick={() => handleLinkClick('/ai-health')} className="flex items-center justify-start">
              <Brain className="mr-2 h-4 w-4" />
              AI Health
            </Button>
          )}
          {user && (
            <Button variant="ghost" onClick={() => handleLinkClick('/chat')} className="flex items-center justify-start">
              <MessageSquare className="mr-2 h-4 w-4" />
              Chat
            </Button>
          )}
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          {user ? (
            <Button onClick={handleLogout} className="w-full">
              Logout
            </Button>
          ) : (
            <Button onClick={handleLogin} className="w-full">
              Login
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
