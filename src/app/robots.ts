import { MetadataRoute } from "next"
import { SITE } from "@/lib/seo.config"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/courses",
          "/courses/",
          "/institutions",
          "/institutions/",
          "/about",
          "/contact",
          "/faq",
          "/login",
          "/register",
        ],
        disallow: [
          "/dashboard/",
          "/api/",
          "/admin/",
          "/_next/",
          "/_vercel/",
          "/profile/",
          "/settings/",
        ],
        crawlDelay: 1,
      },
      {
        userAgent: "GPTBot",
        disallow: ["/"],
      },
      {
        userAgent: "CCBot",
        disallow: ["/"],
      },
      {
        userAgent: "Google-Extended",
        disallow: ["/"],
      },
      {
        userAgent: "anthropic-ai",
        disallow: ["/"],
      },
      {
        userAgent: "ClaudeBot",
        disallow: ["/"],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  }
}