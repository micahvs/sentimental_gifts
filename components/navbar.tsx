"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Menu, X, LogIn, UserPlus } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { useToast } from "@/hooks/use-toast"

export default function Navbar() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    async function getUser() {
      try {
        setIsLoading(true)

        // Check if we're in preview mode
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
          console.log("Preview mode detected, using mock user state")
          setUser(null)
          return
        }

        const { data, error } = await supabase.auth.getUser()

        if (error) {
          if (error.message === "Auth session missing!") {
            // This is an expected error when not logged in
            console.log("No auth session found, user is not logged in")
            setUser(null)
          } else {
            // Log other errors but don't throw
            console.error("Error fetching user:", error)
            setUser(null)
          }
          return
        }

        setUser(data.user)
      } catch (error) {
        console.error("Unexpected error in getUser:", error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    getUser()

    // Set up auth state change listener
    let authListener: { data: { subscription: { unsubscribe: () => void } } } | null = null

    try {
      // Only set up the listener if we're not in preview mode
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
          setUser(session?.user || null)
        })
        authListener = { data }
      }
    } catch (error) {
      console.error("Error setting up auth listener:", error)
    }

    return () => {
      if (authListener?.data?.subscription) {
        try {
          authListener.data.subscription.unsubscribe()
        } catch (error) {
          console.error("Error unsubscribing from auth listener:", error)
        }
      }
    }
  }, [supabase])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Dashboard", path: "/dashboard", requiresAuth: true },
  ]

  // Filter nav items based on auth status
  const filteredNavItems = navItems.filter((item) => !item.requiresAuth || (item.requiresAuth && user))

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="font-bold text-2xl">
          AI Gift Maker
        </Link>

        {/* Mobile menu button */}
        <button className="md:hidden" onClick={toggleMenu} aria-label="Toggle menu">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex gap-6">
            {filteredNavItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`hover:text-primary transition-colors ${
                  pathname === item.path ? "font-medium text-primary" : ""
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {user ? (
            <Button asChild className="rounded-full">
              <Link href="/dashboard">My Account</Link>
            </Button>
          ) : isLoading ? (
            <div className="flex gap-2">
              <Button variant="outline" disabled className="rounded-full">
                <span className="animate-pulse">Loading...</span>
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" asChild className="rounded-full">
                <Link href="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Log In
                </Link>
              </Button>
              <Button asChild className="rounded-full">
                <Link href="/signup">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Sign Up
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-background border-b z-50 md:hidden">
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              {filteredNavItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`py-2 hover:text-primary transition-colors ${
                    pathname === item.path ? "font-medium text-primary" : ""
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {user ? (
                <Button asChild className="rounded-full w-full mt-2">
                  <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                    My Account
                  </Link>
                </Button>
              ) : (
                <>
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                      <LogIn className="mr-2 h-4 w-4" />
                      Log In
                    </Link>
                  </Button>
                  <Button asChild className="w-full">
                    <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Sign Up
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
