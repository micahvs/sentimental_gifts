/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co", // Allow images from any Supabase project
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // Allow images from Google accounts (for profile pics)
      },
    ],
  },
  serverActions: {
    bodySizeLimit: '4mb', // Increase body size limit to 4MB
  },
}

export default nextConfig
