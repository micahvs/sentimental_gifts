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

const formSchema = z.object({
  style: z.string({
    required_error: "Please select a style.",
  }),
  photoUrl: z.string().min(1, {
    message: "Please upload a photo.",
  }),
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
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      const orderId = await createOrder({
        productType: "portrait",
        inputData: values,
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

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Create Custom Portrait"}
        </Button>
      </form>
    </Form>
  )
}
