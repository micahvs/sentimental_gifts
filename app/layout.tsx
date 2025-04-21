import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import Navbar from "@/components/navbar"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "AI Gift Maker | Personalized AI-Generated Gifts",
  description: "Create custom AI-generated songs, portraits, poetry, and children's books for your loved ones.",
  openGraph: {
    title: "AI Gift Maker | Personalized AI-Generated Gifts",
    description: "Create custom AI-generated songs, portraits, poetry, and children's books for your loved ones.",
    images: [{ url: "/og-image.jpg" }],
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <Navbar />
          <main>{children}</main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
