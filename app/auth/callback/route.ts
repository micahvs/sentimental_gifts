import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get("code")
    const next = requestUrl.searchParams.get("next") || "/dashboard"

    if (code) {
      const supabase = createClient()
      const { error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error("Error exchanging code for session:", error)
        // Redirect to login with error
        return NextResponse.redirect(
          `${requestUrl.origin}/login?error=${encodeURIComponent("There was an error logging in. Please try again.")}`,
        )
      }
    }

    // URL to redirect to after sign in process completes
    return NextResponse.redirect(`${requestUrl.origin}${next}`)
  } catch (error) {
    console.error("Auth callback error:", error)
    return NextResponse.redirect(
      `${new URL(request.url).origin}/login?error=${encodeURIComponent(
        "There was an error logging in. Please try again.",
      )}`,
    )
  }
}
