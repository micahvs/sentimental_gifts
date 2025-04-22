// File: app/admin/layout.tsx
import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server"; // Use server client for layout checks
import Link from "next/link";

// Your designated Admin User ID
const ADMIN_USER_ID = "1e4df5ef-eb53-4410-a678-f3d98cbfa1fb";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect non-admins or logged-out users
  if (!user || user.id !== ADMIN_USER_ID) {
    console.log(
      `Admin access denied. User: ${user?.id || "None"}, Required: ${ADMIN_USER_ID}`,
    );
    redirect("/"); // Redirect non-admins to homepage
    return null; // Explicitly return null after redirecting
  }

  // Admin user, allow access
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 pb-4 border-b flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <nav>
          <Link href="/admin" className="mr-4 hover:underline">
            All Orders
          </Link>
          {/* Add other admin navigation links here later */}
        </nav>
      </div>
      <main>{children}</main>
    </div>
  );
}