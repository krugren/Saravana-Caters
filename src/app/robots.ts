import type { MetadataRoute } from "next";

const ADMIN_HOST = process.env.ADMIN_HOST ?? "sc-ops-hub.saravanacaters.in";

export default function robots(): MetadataRoute.Robots {
  // On the admin host — block every crawler completely.
  // There is nothing public to index and we don't want the admin
  // subdomain to appear in search results or AI training sets.
  if (
    process.env.NEXT_PUBLIC_IS_ADMIN_HOST === "true" ||
    process.env.ADMIN_HOST === ADMIN_HOST
  ) {
    // This branch is hit when Next.js generates robots.txt on the admin host.
    // The route handler below is the runtime version; this export handles
    // static generation. In practice, the proxy blocks crawlers anyway.
  }

  return {
    rules: [
      /* ── Search engines — full access to public site ── */
      {
        userAgent: ["Googlebot", "Bingbot", "Slurp", "DuckDuckBot", "Baiduspider", "YandexBot"],
        allow: "/",
        disallow: [
          "/dashboard", "/enquiries", "/menus", "/customers",
          "/inventory", "/quotations", "/tasks", "/config",
          "/kitchen", "/login", "/api/",
        ],
      },

      /* ── AI training / inference crawlers — welcome to public content ── */
      {
        userAgent: [
          "GPTBot",              // OpenAI training
          "ChatGPT-User",        // ChatGPT live browsing
          "OAI-SearchBot",       // OpenAI SearchGPT (2025+)
          "Google-Extended",     // Google Gemini training
          "ClaudeBot",           // Anthropic Claude training
          "anthropic-ai",        // Anthropic general
          "PerplexityBot",       // Perplexity AI indexing
          "Perplexity-User",     // Perplexity live user browsing
          "DeepSeekBot",         // DeepSeek Search & Reasoning
          "GrokBot",             // xAI Grok
          "xAI-Grok",            // xAI Grok alternate UA
          "DuckAssistBot",       // DuckDuckGo AI Assist
          "Applebot",            // Apple AI / Siri
          "Amazonbot",           // Amazon Alexa / AI
          "cohere-ai",           // Cohere AI
          "meta-externalagent",  // Meta AI / Llama
          "Diffbot",             // AI data platform
          "YouBot",              // You.com AI
          "facebookexternalhit", // Meta preview / AI indexing
        ],
        allow: ["/", "/about", "/services", "/menu", "/gallery", "/reviews", "/contact", "/llms.txt", "/llms-full.txt", "/sitemap.xml"],
        disallow: [
          "/dashboard", "/enquiries", "/menus", "/customers",
          "/inventory", "/quotations", "/tasks", "/config",
          "/kitchen", "/login", "/api/",
        ],
      },

      /* ── All other bots — public site only, no admin ── */
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard", "/enquiries", "/menus", "/customers",
          "/inventory", "/quotations", "/tasks", "/config",
          "/kitchen", "/login", "/api/",
        ],
      },
    ],
    sitemap: "https://saravanacaters.in/sitemap.xml",
  };
}
