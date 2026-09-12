import type { NextConfig } from "next";

/**
 * Content-Security-Policy. `'unsafe-inline'`/`'unsafe-eval'` are required because
 * Next.js App Router injects inline hydration scripts without a nonce; the value of
 * this policy is in the ancillary directives (frame-ancestors, object-src, base-uri,
 * form-action) plus scoping img/connect/font sources. A nonce-based strict-dynamic
 * policy is the future hardening step.
 */
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https://*.vercel.app https://*.supabase.co https://*.r2.dev https://kadekagga.app https://*.kadekagga.app",
  "connect-src 'self' https://portfolio-backend-api-five.vercel.app",
  "frame-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  // Required so 404s render app/global-not-found.tsx — this app uses multiple
  // root layouts ([locale] public vs admin), where per-segment not-found
  // boundaries don't fire for unmatched URLs.
  experimental: {
    globalNotFound: true,
  },
  images: {
    // Scoped to the hosts that actually serve this app's media. The previous
    // `hostname: "**"` (https AND http) turned the image optimizer into an open
    // proxy — any origin could be fetched through /_next/image (SSRF / bandwidth
    // abuse). Keep this list in sync with where uploaded media is served from.
    remotePatterns: [
      { protocol: "https", hostname: "**.vercel.app" },
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "**.r2.dev" },
      { protocol: "https", hostname: "kadekagga.app" },
      { protocol: "https", hostname: "**.kadekagga.app" },
      { protocol: "http", hostname: "localhost" },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
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
