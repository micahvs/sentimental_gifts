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
  subject: z.string().min(2, {
    message: "Subject must be at least 2 characters.",
  }),
  details: z.string().min(10, {
    message: "Please provide at least 10 characters of details.",
  }),
  tone: z.string({
    required_error: "Please select a tone.",
  }),
  style: z.string({
    required_error: "Please select a style.",
  }),
})

export default function PoetryForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "",
      details: "",
      tone: "",
      style: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      const orderId = await createOrder({
        productType: "poetry",
        inputData: values,
      })

      toast({
        title: "Order submitted!",
        description: "Your custom poem is being created.",
      })

      router.push(`/preview/${orderId}`)
    } catch (error) {
      toast({
        title: "Something went wrong.",
        description: "Your order could not be submitted. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <FormControl>
                <Input placeholder="Enter the subject of your poem" {...field} />
              </FormControl>
              <FormDescription>This could be a person, place, feeling, or event.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="details"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Details</FormLabel>
              <FormControl>
                <Textarea placeholder="Share some details about the subject" className="min-h-32" {...field} />
              </FormControl>
              <FormDescription>These details will help create a more personalized poem.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tone</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a tone" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="romantic">Romantic</SelectItem>
                  <SelectItem value="funny">Funny</SelectItem>
                  <SelectItem value="inspirational">Inspirational</SelectItem>
                  <SelectItem value="nostalgic">Nostalgic</SelectItem>
                  <SelectItem value="reflective">Reflective</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>The emotional tone of your poem.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="style"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Poem Style</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a poem style" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="illuminated">Illuminated Manuscript</SelectItem>
                  <SelectItem value="sonnet">Sonnet</SelectItem>
                  <SelectItem value="haiku">Haiku</SelectItem>
                  <SelectItem value="freeverse">Free Verse</SelectItem>
                  <SelectItem value="limerick">Limerick</SelectItem>
                  <SelectItem value="ode">Ode</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>Choose the poetic form for your custom poem.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Create Custom Poem"}
        </Button>
      </form>
    </Form>
  )
}
