import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        // Local/dev backends serve uploaded media (profile photo, project
        // screenshots) over plain http (e.g. http://localhost:8000/storage/...).
        // Without this, next/image rejects those URLs with a misleading
        // "hostname not configured" error even though the pattern above
        // already trusts any hostname for https.
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  async rewrites() {
    const apiUrl = process.env.API_BACKEND_URL || "http://localhost:8000";
    return [
      {
        source: "/api/v1/:path*",
        destination: `${apiUrl}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
