import { Button } from "@/components/ui/button"
import Link from "next/link"
import ServiceCard from "@/components/service-card"
import { Music, ImageIcon, BookText, BookOpen } from "lucide-react"

export default function Home() {
  const services = [
    {
      id: "song",
      title: "Custom Songs",
      icon: Music,
      description: "Tell us their name and some fun facts, and we'll generate a personalized song",
      imageUrl: "/images/music-player.png",
    },
    {
      id: "portrait",
      title: "Portraits",
      icon: ImageIcon,
      description: "Upload a photo and choose a style, and we'll create a whimsical cartoon",
      imageUrl: "/images/anime-sunset-portrait.png",
    },
    {
      id: "poetry",
      title: "Poetry",
      icon: BookText,
      description: "Fill out a subject form, and we'll craft a beautiful, adorned poem",
      imageUrl: "/images/illuminated-poem.png",
    },
    {
      id: "book",
      title: "Children's Books",
      icon: BookOpen,
      description: "Upload photos and add a premise, and we'll create a unique story",
      imageUrl: "/images/buddys-garden-book.png",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="py-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Create a Sentimental Gift for Your Loved Ones</h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
          Leverage AI to bring you beautiful, custom works at an affordable price.
        </p>
        <Button asChild size="lg" className="rounded-full px-8 py-6 text-lg">
          <Link href="/about">Learn More</Link>
        </Button>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              id={service.id}
              title={service.title}
              description={service.description}
              icon={service.icon}
              imageUrl={service.imageUrl}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
