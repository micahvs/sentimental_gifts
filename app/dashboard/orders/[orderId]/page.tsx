import { getOrderById, getCurrentUser } from "@/lib/actions"
import { notFound, redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Download, ArrowLeft } from "lucide-react"
import Image from "next/image"

export default async function OrderDetailPage({
  params,
}: {
  params: { orderId: string }
}) {
  const { orderId } = params
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const order = await getOrderById(orderId)

  if (!order) {
    return notFound()
  }

  // Check if the order belongs to the current user
  if (order.user_id !== user.id) {
    redirect("/dashboard/orders")
  }

  const productTypeMap = {
    song: "Custom Song",
    portrait: "Portrait",
    poetry: "Poem",
    book: "Children's Book",
  }

  const productTitle = productTypeMap[order.product_type as keyof typeof productTypeMap]
  const inputData = order.input_data || {}

  // Format the created date
  const createdDate = new Date(order.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div>
      <div className="mb-6">
        <Button variant="outline" size="sm" asChild className="mb-4">
          <Link href="/dashboard/orders">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Link>
        </Button>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold">{productTitle}</h1>
            <p className="text-muted-foreground">Order ID: {orderId}</p>
          </div>
          <Badge className="mt-2 md:mt-0" variant={order.status === "complete" ? "default" : "outline"}>
            {order.status === "processing" ? "In Progress" : "Completed"}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
              <CardDescription>Created on {createdDate}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.product_type === "song" && (
                <>
                  <div>
                    <h3 className="font-medium mb-1">Recipient's Name</h3>
                    <p>{inputData.recipientName}</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Fun Facts</h3>
                    <p>{inputData.funFacts}</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Occasion</h3>
                    <p className="capitalize">{inputData.occasion}</p>
                  </div>
                </>
              )}

              {order.product_type === "portrait" && (
                <>
                  <div>
                    <h3 className="font-medium mb-1">Style</h3>
                    <p className="capitalize">{inputData.style}</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Photo</h3>
                    {inputData.photoUrl && (
                      <div className="relative h-48 w-full max-w-xs rounded-md overflow-hidden">
                        <Image
                          src={inputData.photoUrl || "/placeholder.svg"}
                          alt="Uploaded photo"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>
                </>
              )}

              {order.product_type === "poetry" && (
                <>
                  <div>
                    <h3 className="font-medium mb-1">Subject</h3>
                    <p>{inputData.subject}</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Details</h3>
                    <p>{inputData.details}</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Tone</h3>
                    <p className="capitalize">{inputData.tone}</p>
                  </div>
                </>
              )}

              {order.product_type === "book" && (
                <>
                  <div>
                    <h3 className="font-medium mb-1">Title</h3>
                    <p>{inputData.title}</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Premise</h3>
                    <p>{inputData.premise}</p>
                  </div>
                  {inputData.photoUrls && inputData.photoUrls.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-1">Photos</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {inputData.photoUrls.map((url: string, index: number) => (
                          <div key={index} className="relative h-24 rounded-md overflow-hidden">
                            <Image
                              src={url || "/placeholder.svg"}
                              alt={`Uploaded photo ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="capitalize">
                    {order.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {order.status === "processing" ? "Your gift is being created" : "Your gift is ready"}
                  </span>
                </div>

                {order.status === "processing" && (
                  <p className="text-sm text-muted-foreground">
                    We'll notify you when your {productTitle.toLowerCase()} is ready.
                  </p>
                )}

                {order.status === "complete" && order.output_url && (
                  <Button asChild className="w-full mt-4">
                    <a href={order.output_url} download>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
