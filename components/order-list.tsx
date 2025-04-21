"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Eye } from "lucide-react"
import Link from "next/link"

interface Order {
  id: string
  product_type?: string
  productType?: string
  status: string
  created_at?: string
  createdAt?: string
  output_url?: string
  outputUrl?: string
}

interface OrderListProps {
  orders: Order[]
}

export default function OrderList({ orders }: OrderListProps) {
  const [filter, setFilter] = useState<string | null>(null)

  const normalizedOrders = orders.map((order) => ({
    id: order.id,
    productType: order.productType || order.product_type || "song",
    status: order.status,
    createdAt: order.createdAt || order.created_at || new Date().toISOString(),
    outputUrl: order.outputUrl || order.output_url,
  }))

  const filteredOrders = filter ? normalizedOrders.filter((order) => order.status === filter) : normalizedOrders

  const productTypeMap = {
    song: "Custom Song",
    portrait: "Portrait",
    poetry: "Poem",
    book: "Children's Book",
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Button variant={filter === null ? "default" : "outline"} size="sm" onClick={() => setFilter(null)}>
          All
        </Button>
        <Button
          variant={filter === "processing" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("processing")}
        >
          In Progress
        </Button>
        <Button variant={filter === "complete" ? "default" : "outline"} size="sm" onClick={() => setFilter("complete")}>
          Completed
        </Button>
      </div>

      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium">
                        {productTypeMap[order.productType as keyof typeof productTypeMap]}
                      </h3>
                      <Badge variant={order.status === "complete" ? "default" : "outline"}>
                        {order.status === "processing" ? "In Progress" : "Completed"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Order ID: {order.id}</p>
                    <p className="text-sm text-muted-foreground">
                      Created: {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/dashboard/orders/${order.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Link>
                    </Button>

                    {order.status === "complete" && order.outputUrl && (
                      <Button asChild size="sm">
                        <a href={order.outputUrl} download>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center text-muted-foreground py-8">No orders found matching your filter.</p>
        )}
      </div>
    </div>
  )
}
