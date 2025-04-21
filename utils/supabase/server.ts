import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export function createClient() {
  const cookieStore = cookies()

  // Check if environment variables are available
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.warn("Supabase URL or key is missing. Using mock client.")
    // Return a mock client for preview environments
    return createMockClient()
  }

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      get(name) {
        return cookieStore.get(name)?.value
      },
      set(name, value, options) {
        cookieStore.set({ name, value, ...options })
      },
      remove(name, options) {
        cookieStore.set({ name, value: "", ...options })
      },
    },
  })
}

// Mock client for preview environments
function createMockClient() {
  return {
    auth: {
      getUser: async () => ({
        data: {
          user: {
            id: "preview-user-id",
            email: "preview@example.com",
            user_metadata: {
              full_name: "Preview User",
              avatar_url: null,
            },
          },
        },
        error: null,
      }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          order: () => ({
            data: [],
            error: null,
          }),
          single: () => ({
            data: null,
            error: null,
          }),
        }),
      }),
      insert: () => ({
        select: () => ({
          single: () => ({
            data: { id: "preview-order-id" },
            error: null,
          }),
        }),
      }),
    }),
    storage: {
      from: () => ({
        upload: async () => ({ data: {}, error: null }),
        getPublicUrl: () => ({ data: { publicUrl: "/placeholder.svg" } }),
      }),
    },
  }
}
