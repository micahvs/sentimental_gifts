"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createOrder } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"
import { FileUploader } from "@/components/file-uploader"
import { Input } from "@/components/ui/input"

const addressSchema = z.object({
  street: z.string().min(1, "Street address is required."),
  city: z.string().min(1, "City is required."),
  state: z.string().min(1, "State/Province is required."),
  zip: z.string().min(1, "Zip/Postal code is required."),
  country: z.string().min(1, "Country is required."),
})

const formSchema = z.object({
  style: z.string({
    required_error: "Please select a style.",
  }),
  photoUrl: z.string().min(1, {
    message: "Please upload a photo.",
  }),
  shipping_address: addressSchema,
  phone_number: z.string().optional(),
})

export default function PortraitForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      style: "",
      photoUrl: "",
      shipping_address: {
        street: "",
        city: "",
        state: "",
        zip: "",
        country: "",
      },
      phone_number: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      const inputData = {
        style: values.style,
        photoUrl: values.photoUrl,
      }
      const shipping_address = values.shipping_address
      const phone_number = values.phone_number

      const orderId = await createOrder({
        productType: "portrait",
        inputData: inputData,
        shipping_address: shipping_address,
        phone_number: phone_number,
      })

      toast({
        title: "Order submitted!",
        description: "Your custom portrait is being created.",
      })

      router.push(`/preview/${orderId}`)
    } catch (error) {
      console.error("Form submission error:", error)
      toast({
        title: "Something went wrong.",
        description: "Your order could not be submitted. Please try again.",
        variant: "destructive",
      })

      // In preview mode, still redirect to a preview page
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        const mockOrderId = `preview-portrait-${Date.now()}`
        router.push(`/preview/${mockOrderId}`)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileUpload = (url: string) => {
    form.setValue("photoUrl", url)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="photoUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Upload Photo</FormLabel>
              <FormControl>
                <FileUploader onUploadComplete={handleFileUpload} value={field.value} />
              </FormControl>
              <FormDescription>Upload a clear photo of the person for the portrait.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="style"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Portrait Style</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a style" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="cartoon">Cartoon</SelectItem>
                  <SelectItem value="watercolor">Watercolor</SelectItem>
                  <SelectItem value="pencil">Pencil Sketch</SelectItem>
                  <SelectItem value="pop-art">Pop Art</SelectItem>
                  <SelectItem value="anime">Anime</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>Choose the artistic style for your portrait.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4 rounded-md border p-4">
          <h3 className="text-lg font-medium">Shipping Address</h3>
          <FormField
            control={form.control}
            name="shipping_address.street"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Street Address</FormLabel>
                <FormControl>
                  <Input placeholder="123 Main St" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="shipping_address.city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="Anytown" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shipping_address.state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State / Province</FormLabel>
                  <FormControl>
                    <Input placeholder="CA" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shipping_address.zip"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zip / Postal Code</FormLabel>
                  <FormControl>
                    <Input placeholder="12345" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="shipping_address.country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input placeholder="USA" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="phone_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number (Optional)</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="(555) 123-4567" {...field} />
              </FormControl>
              <FormDescription>
                In case we need to contact you about your order.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Create Custom Portrait"}
        </Button>
      </form>
    </Form>
  )
}
