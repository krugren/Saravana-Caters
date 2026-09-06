import type { NextConfig } from "next";

/* ─── Content Security Policy ───────────────────────────────────────────────
   Allows:
   • Self (scripts, styles, fonts bundled with the app)
   • Google Fonts (display font loading)
   • Cloudflare Turnstile (challenges.cloudflare.com)
   • Unsplash (remote images via next/image)
   • WhatsApp / wa.me (connect-src for WhatsApp links)
   Blocks: object embeds, framing by third parties
   Dev only: unsafe-eval + wasm-unsafe-eval (required by React/Turbopack HMR)
   Production: eval is blocked — full hardened CSP
────────────────────────────────────────────────────────────────────────────── */
const isDev = process.env.NODE_ENV === "development";

// React and Turbopack's HMR require eval() in dev for callstack reconstruction
// and module hot-reloading. Never allow eval in production.
const scriptSrc = isDev
  ? `'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' https://challenges.cloudflare.com`
  : `'self' 'unsafe-inline' https://challenges.cloudflare.com`;

// Turbopack HMR uses a local WebSocket; allow ws:// only in dev
const connectSrc = isDev
  ? `'self' ws: wss: https://challenges.cloudflare.com https://*.neon.tech https://api.better-auth.com`
  : `'self' https://challenges.cloudflare.com https://*.neon.tech https://api.better-auth.com`;

const CSP = [
  `default-src 'self'`,
  `script-src ${scriptSrc}`,
  `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
  `font-src 'self' https://fonts.gstatic.com data:`,
  `img-src 'self' data: blob: https://images.unsplash.com https://plus.unsplash.com https://lh3.googleusercontent.com`,
  `connect-src ${connectSrc}`,
  `frame-src https://challenges.cloudflare.com`,
  `object-src 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
  `upgrade-insecure-requests`,
]
  .join("; ")
  .trim();

const securityHeaders = [
  /* Prevent clickjacking — page cannot be embedded in iframes on other sites */
  { key: "X-Frame-Options", value: "SAMEORIGIN" },

  /* Prevent MIME-type sniffing */
  { key: "X-Content-Type-Options", value: "nosniff" },

  /* HTTPS-only for 2 years, include subdomains, submit to preload list */
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },

  /* Only send origin (no path) as referrer to third parties */
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },

  /* Disable browser APIs that this site does not need */
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },

  /* Content Security Policy */
  { key: "Content-Security-Policy", value: CSP },
];

const nextConfig: NextConfig = {
  // When running as the admin instance, use a separate build directory
  // so both dev servers can run simultaneously without locking conflicts.
  distDir: process.env.NEXT_PUBLIC_IS_ADMIN_HOST === "true" ? ".next-admin" : ".next",

  experimental: {
    serverActions: {
      // Cap Server Action payloads to prevent oversized-body DoS on edge workers.
      // 128 KB is generous for any legitimate form submission on this platform.
      bodySizeLimit: "128kb",

      // When the app is accessed through a reverse proxy or tunnel (e.g. VS Code
      // Dev Tunnels, ngrok), x-forwarded-host differs from the origin header.
      // List every trusted host here so Next.js doesn't abort server actions.
      // Set TUNNEL_HOST in .env.local (comma-separated) to add tunnel domains
      // without hardcoding them — then rebuild.
      allowedOrigins: [
        "localhost:3000",
        "localhost:3001",
        ...(process.env.TUNNEL_HOST
          ? process.env.TUNNEL_HOST.split(",").map((h) => h.trim())
          : []),
      ],
    },
  },

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
    ],
  },

  async headers() {
    return [
      {
        /* Apply security headers to all routes */
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
