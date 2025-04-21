"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createOrder } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
  recipientName: z.string().min(2, {
    message: "Recipient name must be at least 2 characters.",
  }),
  funFacts: z.string().min(10, {
    message: "Please provide at least 10 characters of fun facts.",
  }),
  occasion: z.string({
    required_error: "Please select an occasion.",
  }),
  musicStyle: z.string({
    required_error: "Please select a music style.",
  }),
})

export default function SongForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recipientName: "",
      funFacts: "",
      occasion: "",
      musicStyle: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      // For preview mode, create a mock order ID
      let orderId

      // Check if we're in preview mode
      if (
        typeof window !== "undefined" &&
        (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
      ) {
        // We're in preview mode or missing environment variables
        console.log("Using preview mode for form submission")
        orderId = `preview-song-${Date.now()}`
      } else {
        // We have environment variables, try to create a real order
        orderId = await createOrder({
          productType: "song",
          inputData: values,
        })
      }

      // Show success message
      toast({
        title: "Order submitted!",
        description: "Your custom song is being created.",
      })

      // Navigate to the preview page
      router.push(`/preview/${orderId}`)
    } catch (error) {
      console.error("Form submission error:", error)

      // Show error message
      toast({
        title: "Something went wrong.",
        description: "Your order could not be submitted. Please try again.",
        variant: "destructive",
      })

      // In preview mode, we can still redirect to a mock preview
      if (
        typeof window !== "undefined" &&
        (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
      ) {
        const mockOrderId = `preview-song-${Date.now()}`
        router.push(`/preview/${mockOrderId}`)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="recipientName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recipient's Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter the recipient's name" {...field} />
              </FormControl>
              <FormDescription>This is the person the song will be about.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="funFacts"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fun Facts</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Share some fun facts, interests, or memories about the recipient"
                  className="min-h-32"
                  {...field}
                />
              </FormControl>
              <FormDescription>These details will be used to personalize the song.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="occasion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Occasion</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an occasion" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="birthday">Birthday</SelectItem>
                  <SelectItem value="anniversary">Anniversary</SelectItem>
                  <SelectItem value="graduation">Graduation</SelectItem>
                  <SelectItem value="wedding">Wedding</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>The occasion for this gift.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="musicStyle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Music Style</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a music style" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="synthwave">Synthwave/Retrowave</SelectItem>
                  <SelectItem value="pop">Pop</SelectItem>
                  <SelectItem value="folk">Folk/Acoustic</SelectItem>
                  <SelectItem value="rnb">R&B</SelectItem>
                  <SelectItem value="hiphop">Hip Hop</SelectItem>
                  <SelectItem value="rock">Rock</SelectItem>
                  <SelectItem value="classical">Classical</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>Choose the musical style for your custom song.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Create Custom Song"}
        </Button>
      </form>
    </Form>
  )
}
