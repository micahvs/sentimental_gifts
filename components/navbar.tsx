"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Menu, X, LogIn, UserPlus, ShieldCheck } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { useToast } from "@/hooks/use-toast"
import type { User } from "@supabase/supabase-js"

// Your designated Admin User ID
const ADMIN_USER_ID = "1e4df5ef-eb53-4410-a678-f3d98cbfa1fb"

export default function Navbar() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    async function getUser() {
      try {
        setIsLoading(true)

        // Check if we're in preview mode (this check might not be necessary on client)
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
          console.log("Preview mode detected, using mock user state")
          setUser(null)
          return
        }

        const { data, error } = await supabase.auth.getUser()

        if (error) {
          if (error.message === "Auth session missing!") {
            console.log("No auth session found, user is not logged in")
            setUser(null)
          } else {
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
        const { data } = supabase.auth.onAuthStateChange((_event, session) => {
          setUser(session?.user ?? null)
        })
        authListener = { data }
      }
    } catch (error) {
      console.error("Error setting up auth listener:", error)
    }

    // Cleanup function
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

  // Check if the current user is the admin
  const isAdmin = user?.id === ADMIN_USER_ID

  // Define base navigation items
  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    // Conditionally add Admin link if user is admin
    ...(isAdmin ? [{ name: "Admin", path: "/admin", icon: ShieldCheck }] : []),
    // Conditionally add Dashboard link if user is logged in (but not admin, as admin link takes precedence?)
    // Or always show dashboard if logged in? Let's always show if logged in for now.
    ...(user ? [{ name: "Dashboard", path: "/dashboard" }] : []),
  ]

  return (
    <nav className="border-b bg-background sticky top-0 z-50">
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
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-1 hover:text-primary transition-colors ${
                  pathname === item.path ? "font-medium text-primary" : ""
                }`}
              >
                {item.icon && <item.icon className="h-4 w-4" />}
                {item.name}
              </Link>
            ))}
          </div>

          {/* Account Buttons */}
          {isLoading ? (
            <Button variant="outline" disabled className="rounded-full animate-pulse w-28">
            </Button>
          ) : user ? (
            <Button asChild className="rounded-full">
              <Link href="/dashboard/profile">My Account</Link>
            </Button>
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
          <div className="absolute top-full left-0 right-0 bg-background border-b z-40 md:hidden">
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-2 py-2 hover:text-primary transition-colors ${
                    pathname === item.path ? "font-medium text-primary" : ""
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  {item.name}
                </Link>
              ))}

              {/* Mobile Account Buttons */}
              {isLoading ? (
                <Button variant="outline" disabled className="rounded-full w-full mt-2 animate-pulse h-10">
                </Button>
              ) : user ? (
                <Button asChild className="rounded-full w-full mt-2">
                  <Link href="/dashboard/profile" onClick={() => setIsMenuOpen(false)}>
                    My Account
                  </Link>
                </Button>
              ) : (
                <>
                  <Button variant="outline" asChild className="w-full mt-2">
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
