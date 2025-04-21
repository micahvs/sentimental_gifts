"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { uploadFile } from "@/lib/actions"

interface FileUploaderProps {
  onUploadComplete: (url: string) => void
  value: string
}

export function FileUploader({ onUploadComplete, value }: FileUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(value || null)
  const { toast } = useToast()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file.",
        variant: "destructive",
      })
      return
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsUploading(true)

      // Create a preview
      const objectUrl = URL.createObjectURL(file)
      setPreview(objectUrl)

      // Check if we're in preview mode
      const isPreviewMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (isPreviewMode) {
        console.log("Preview mode detected in FileUploader, using local preview")
        // In preview mode, just use the local preview
        onUploadComplete(objectUrl)

        toast({
          title: "Preview mode",
          description: "File upload simulated in preview mode.",
        })

        return
      }

      // Upload to Supabase
      const url = await uploadFile(file)

      // Pass the URL back to the parent component
      onUploadComplete(url)

      toast({
        title: "File uploaded",
        description: "Your file has been uploaded successfully.",
      })
    } catch (error) {
      console.error("Upload error:", error)
      toast({
        title: "Upload failed",
        description: "There was an error uploading your file. Using local preview instead.",
        variant: "destructive",
      })

      // Even if the upload fails, we can still use the local preview in development
      if (preview) {
        onUploadComplete(preview)
      }
    } finally {
      setIsUploading(false)
    }
  }

  const clearFile = () => {
    if (preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview)
    }
    setPreview(null)
    onUploadComplete("")
  }

  return (
    <div className="space-y-4">
      {!preview ? (
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileChange}
            accept="image/*"
            disabled={isUploading}
          />
          <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center gap-2">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {isUploading ? "Uploading..." : "Click to upload or drag and drop"}
            </p>
            <Button variant="secondary" size="sm" disabled={isUploading}>
              Select File
            </Button>
          </label>
        </div>
      ) : (
        <div className="relative">
          <img src={preview || "/placeholder.svg"} alt="Preview" className="max-h-64 rounded-md mx-auto" />
          <Button variant="destructive" size="icon" className="absolute top-2 right-2" onClick={clearFile}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
