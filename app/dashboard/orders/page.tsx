import { getUserOrders, getCurrentUser } from "@/lib/actions"
import OrderList from "@/components/order-list"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function OrdersPage() {
  const user = await getCurrentUser()

  if (!user) {
    return null // Handled by layout
  }

  const orders = await getUserOrders(user.id)

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Orders</h1>
        <Button asChild>
          <Link href="/#services">Create New Gift</Link>
        </Button>
      </div>

      {orders.length > 0 ? (
        <OrderList orders={orders} />
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
    </div>
  )
}
