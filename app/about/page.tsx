import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Gift, Music, ImageIcon, BookText, BookOpen } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">About Us</h1>

        <div className="prose prose-lg max-w-none">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-center">
            How do you turn a memory into a masterpiece?
          </h2>

          <p className="mb-6">
            At <span className="font-semibold">AI Gift Maker</span>, we believe that the most meaningful gifts come from
            the heart — and now, from a little help with AI.
          </p>

          <p className="mb-8">
            We utilize cutting-edge AI tools to transforms your favorite stories, memories, and moments into
            one-of-a-kind keepsakes:
          </p>

          <ul className="space-y-4 mb-8">
            <li className="flex items-start">
              <Music className="h-6 w-6 text-primary mr-3 mt-1 shrink-0" />
              <span>A custom song written just for your loved one</span>
            </li>
            <li className="flex items-start">
              <BookText className="h-6 w-6 text-primary mr-3 mt-1 shrink-0" />
              <span>A poem inspired by their words</span>
            </li>
            <li className="flex items-start">
              <ImageIcon className="h-6 w-6 text-primary mr-3 mt-1 shrink-0" />
              <span>A whimsical cartoon portrait based on your photos</span>
            </li>
            <li className="flex items-start">
              <BookOpen className="h-6 w-6 text-primary mr-3 mt-1 shrink-0" />
              <span>Or even a fully illustrated children's book starring someone you love</span>
            </li>
          </ul>

          <p className="mb-6">
            Just tell us about the person — their quirks, their story, your favorite memories — and upload any photos or
            details you'd like us to include. Our human agents will handle the rest, leveraging AI tooling to create
            something that feels deeply personal, imaginative, and unforgettable.
          </p>

          <p className="mb-6">
            Every creation comes with a beautifully designed physical keepsake, delivered right to your door. Whether
            it's a framed print, a hardcover book, or a parchment-style letter, it's a gift they'll treasure forever.
          </p>

          <p className="mb-8">
            We make it easy to celebrate the people who matter most — through stories that surprise, songs that move,
            and gifts that truly feel like they were made just for them.
          </p>

          <div className="flex justify-center mt-12">
            <Button asChild size="lg" className="rounded-full px-8 py-6 text-lg">
              <Link href="/#services">
                <Gift className="mr-2 h-5 w-5" />
                Create Your Gift
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
