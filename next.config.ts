/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    FIRECRAWL_API_KEY: process.env.FIRECRAWL_API_KEY,
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["*"],
      bodySizeLimit: "64mb"
    }
  }
}

export default nextConfig;
