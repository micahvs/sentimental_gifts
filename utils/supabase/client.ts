import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.warn("Supabase URL or key is missing in client. Using mock client.")
    return createMockClient()
  }

  return createBrowserClient(supabaseUrl, supabaseKey)
}

// Mock client for preview environments
function createMockClient() {
  return {
    auth: {
      getUser: async () => {
        // Simulate the same error structure that the real client would return
        return {
          data: { user: null },
          error: { message: "Auth session missing!" },
        }
      },
      onAuthStateChange: () => {
        return {
          data: {
            subscription: {
              unsubscribe: () => {},
            },
          },
        }
      },
      signInWithOtp: async () => ({ error: null }),
      signInWithPassword: async () => ({ error: null }),
      signUp: async () => ({ error: null }),
      updateUser: async () => ({ error: null }),
      signOut: async () => ({ error: null }),
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
