import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getUserOrders, getCurrentUser } from "@/lib/actions"
import OrderList from "@/components/order-list"
import { Gift, Clock, CheckCircle } from "lucide-react"

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    return null // Handled by layout
  }

  // Get orders or use empty array if in preview mode
  const orders = (await getUserOrders(user.id)) || []

  // For preview mode, add some sample orders if none exist
  const displayOrders =
    orders.length > 0
      ? orders
      : [
          {
            id: "preview-1",
            product_type: "song",
            status: "processing",
            created_at: new Date().toISOString(),
            user_id: user.id,
            input_data: { recipientName: "Sarah", funFacts: "Loves hiking and jazz music", occasion: "birthday" },
          },
          {
            id: "preview-2",
            product_type: "portrait",
            status: "complete",
            created_at: new Date(Date.now() - 86400000).toISOString(),
            user_id: user.id,
            input_data: { style: "watercolor" },
            output_url: "/placeholder.svg",
          },
        ]

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user.user_metadata?.full_name || "User"}</p>
        </div>
        <Button asChild className="mt-4 md:mt-0">
          <Link href="/#services">Create New Gift</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{displayOrders.length}</div>
            <p className="text-xs text-muted-foreground">Gifts created</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {displayOrders.filter((order) => order.status === "processing").length}
            </div>
            <p className="text-xs text-muted-foreground">Orders being processed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {displayOrders.filter((order) => order.status === "complete").length}
            </div>
            <p className="text-xs text-muted-foreground">Ready to download</p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
        {displayOrders.length > 0 ? (
          <OrderList orders={displayOrders.slice(0, 5)} />
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground mb-4">You haven't created any gifts yet.</p>
              <Button asChild>
                <Link href="/#services">Create Your First Gift</Link>
              </Button>
            </CardContent>
          </Card>
        )}
        {displayOrders.length > 5 && (
          <div className="mt-4 text-center">
            <Button variant="outline" asChild>
              <Link href="/dashboard/orders">View All Orders</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
