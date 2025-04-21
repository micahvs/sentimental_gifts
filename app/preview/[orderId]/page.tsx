import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { getOrderById } from "@/lib/actions"
import { notFound } from "next/navigation"

export default async function PreviewPage({
  params,
}: {
  params: { orderId: string }
}) {
  const { orderId } = params

  // In a real app, you would fetch the order from your database
  const order = await getOrderById(orderId)

  // If no order is found and it's not a preview ID, return 404
  if (!order && !orderId.includes("preview")) {
    return notFound()
  }

  // Use mock data if order is null (for preview mode)
  const orderData = order || {
    id: orderId,
    productType: "song",
    status: "processing",
  }

  const productTypeMap = {
    song: "Custom Song",
    portrait: "Portrait",
    poetry: "Poem",
    book: "Children's Book",
  }

  // Handle both snake_case and camelCase properties
  const productType = orderData.product_type || orderData.productType || "song"
  const productTitle = productTypeMap[productType as keyof typeof productTypeMap]

  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Your Order is Being Processed</CardTitle>
          <CardDescription>We're creating your {productTitle} with AI magic!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted p-6 rounded-lg text-center">
            <p className="text-xl font-medium mb-2">Order ID: {orderId}</p>
            <p className="text-muted-foreground">Status: {orderData.status}</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">What happens next?</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5 shrink-0">
                  1
                </span>
                <span>Our agents are working with AI tooling to create your custom {productTitle.toLowerCase()}</span>
              </li>
              <li className="flex items-start">
                <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5 shrink-0">
                  2
                </span>
                <span>Your accompanying artwork will be printed, framed, & shipped</span>
              </li>
              <li className="flex items-start">
                <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5 shrink-0">
                  3
                </span>
                <span>You'll receive an email when your order is ready</span>
              </li>
              <li className="flex items-start">
                <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5 shrink-0">
                  4
                </span>
                <span>You can view your order anytime in your dashboard</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button asChild variant="outline" className="flex-1">
              <Link href="/dashboard">View Dashboard</Link>
            </Button>
            <Button asChild className="flex-1">
              <Link href="/">Create Another Gift</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
