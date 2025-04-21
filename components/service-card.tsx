import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import type { LucideIcon } from "lucide-react"

interface ServiceCardProps {
  id: string
  title: string
  description: string
  icon: LucideIcon
  imageUrl: string
}

export default function ServiceCard({ id, title, description, icon: Icon, imageUrl }: ServiceCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Icon className="h-6 w-6 text-primary" />
          <CardTitle className="text-2xl">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="relative h-48 w-full mb-4 bg-muted rounded-md overflow-hidden">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/create/${id}`}>Create {title}</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
