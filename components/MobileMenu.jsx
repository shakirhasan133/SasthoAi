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
      <SheetTrigger asChild className="w-10 h-10">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-10 w-10 text-white" /> {/* Increased icon size */}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="bg-background text-foreground"> {/* Updated styling */}
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col space-y-4 py-4">
          <Button variant="ghost" onClick={() => handleLinkClick('/')} className="flex items-center justify-start text-foreground">
            <Home className="mr-2 h-5 w-5" /> {/* Increased icon size */}
            Home
          </Button>
          <Button variant="ghost" onClick={() => handleLinkClick('/my-records')} className="flex items-center justify-start text-foreground">
            <FileText className="mr-2 h-5 w-5" /> {/* Increased icon size */}
            My Records
          </Button>
          {user && (
            <Button variant="ghost" onClick={() => handleLinkClick('/my-records')} className="flex items-center justify-start text-foreground">
              <PlusCircle className="mr-2 h-5 w-5" /> {/* Increased icon size */}
              Add Record
            </Button>
          )}
          {user && (
            <Button variant="ghost" onClick={() => handleLinkClick('/ai-health')} className="flex items-center justify-start text-foreground">
              <Brain className="mr-2 h-5 w-5" /> {/* Increased icon size */}
              AI Health
            </Button>
          )}
          {user && (
            <Button variant="ghost" onClick={() => handleLinkClick('/chat')} className="flex items-center justify-start text-foreground">
              <MessageSquare className="mr-2 h-5 w-5" /> {/* Increased icon size */}
              Chat
            </Button>
          )}
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          {user ? (
            <Button onClick={handleLogout} className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Logout
            </Button>
          ) : (
            <Button onClick={handleLogin} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              Login
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
