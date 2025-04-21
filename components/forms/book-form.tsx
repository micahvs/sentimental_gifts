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
import { createOrder } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"
import { FileUploader } from "@/components/file-uploader"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  premise: z.string().min(10, {
    message: "Please provide at least 10 characters for the premise.",
  }),
  photoUrls: z.array(z.string()).min(1, {
    message: "Please upload at least one photo.",
  }),
  style: z.string({
    required_error: "Please select an illustration style.",
  }),
})

export default function BookForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const [photos, setPhotos] = useState<string[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      premise: "",
      photoUrls: [],
      style: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      const orderId = await createOrder({
        productType: "book",
        inputData: values,
      })

      toast({
        title: "Order submitted!",
        description: "Your custom children's book is being created.",
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

  const handleFileUpload = (url: string) => {
    const newPhotos = [...photos, url]
    setPhotos(newPhotos)
    form.setValue("photoUrls", newPhotos)
  }

  const removePhoto = (index: number) => {
    const newPhotos = [...photos]
    newPhotos.splice(index, 1)
    setPhotos(newPhotos)
    form.setValue("photoUrls", newPhotos)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Book Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter a title for your book" {...field} />
              </FormControl>
              <FormDescription>This will be the title of your children's book.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="premise"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Story Premise</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the story you'd like for your book" className="min-h-32" {...field} />
              </FormControl>
              <FormDescription>Provide a brief description of the story theme, characters, or plot.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="style"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Illustration Style</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an illustration style" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="cute">Cute & Colorful (like Buddy's Garden)</SelectItem>
                  <SelectItem value="watercolor">Soft Watercolor</SelectItem>
                  <SelectItem value="cartoon">Modern Cartoon</SelectItem>
                  <SelectItem value="classic">Classic Storybook</SelectItem>
                  <SelectItem value="whimsical">Whimsical & Playful</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>Choose the artistic style for your book's illustrations.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="photoUrls"
          render={() => (
            <FormItem>
              <FormLabel>Upload Photos</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  <FileUploader onUploadComplete={handleFileUpload} value="" />

                  {photos.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                      {photos.map((photo, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={photo || "/placeholder.svg"}
                            alt={`Uploaded photo ${index + 1}`}
                            className="h-24 w-full object-cover rounded-md"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removePhoto(index)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </FormControl>
              <FormDescription>Upload photos to include in your children's book.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Create Custom Children's Book"}
        </Button>
      </form>
    </Form>
  )
}
