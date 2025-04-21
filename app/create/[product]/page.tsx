import { notFound } from "next/navigation"
import SongForm from "@/components/forms/song-form"
import PortraitForm from "@/components/forms/portrait-form"
import PoetryForm from "@/components/forms/poetry-form"
import BookForm from "@/components/forms/book-form"

export default function CreateProductPage({
  params,
}: {
  params: { product: string }
}) {
  const { product } = params

  const products = {
    song: {
      title: "Custom Song",
      component: SongForm,
    },
    portrait: {
      title: "Portrait",
      component: PortraitForm,
    },
    poetry: {
      title: "Poetry",
      component: PoetryForm,
    },
    book: {
      title: "Children's Book",
      component: BookForm,
    },
  }

  // Check if the product exists
  if (!Object.keys(products).includes(product)) {
    return notFound()
  }

  const ProductForm = products[product as keyof typeof products].component
  const title = products[product as keyof typeof products].title

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Create Your {title}</h1>
      <div className="max-w-2xl mx-auto">
        <ProductForm />
      </div>
    </div>
  )
}
