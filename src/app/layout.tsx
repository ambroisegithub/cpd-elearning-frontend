// @ts-nocheck
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { Providers } from "@/components/providers";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { SITE, DEFAULT_SEO, buildOrganizationSchema, buildWebsiteSchema } from "@/lib/seo.config";

// ── Viewport (separate export, required by Next.js 14+) ─────────────────────
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#2D6A4F" },
    { media: "(prefers-color-scheme: dark)", color: "#2D6A4F" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

// ── Root metadata with full SEO configuration ────────────────────────────────
export const metadata: Metadata = {
  // ── Identity
  metadataBase: new URL(SITE.url),
  title: {
    default: DEFAULT_SEO.title,
    template: `%s | ${SITE.name}`,
  },
  description: DEFAULT_SEO.description,
  keywords: DEFAULT_SEO.keywords,
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,

  // ── Canonical / alternates
  alternates: {
    canonical: "/",
    languages: { "en-RW": "/", en: "/", fr: "/fr", kin: "/kin" },
  },

  // ── Robots
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // ── Open Graph
  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: SITE.url,
    siteName: SITE.name,
    title: DEFAULT_SEO.title,
    description: DEFAULT_SEO.description,
    images: [
      {
        url: `${SITE.url}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: `${SITE.fullName} — CPD for Healthcare Professionals`,
        type: "image/jpeg",
      },
    ],
  },

  // ── Twitter / X Card
  twitter: {
    card: "summary_large_image",
    site: SITE.twitterHandle,
    creator: SITE.twitterHandle,
    title: DEFAULT_SEO.title,
    description: DEFAULT_SEO.description,
    images: [`${SITE.url}/og-image.jpg`],
  },

  // ── Icons
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },

  // ── PWA manifest
  manifest: "/manifest.webmanifest",

  // ── App-specific meta
  applicationName: SITE.name,
  category: "education",

  // ── Verification (Google Search Console)
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? "",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const orgSchema = buildOrganizationSchema();
  const websiteSchema = buildWebsiteSchema();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to key external origins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* DNS prefetch for API */}
        <link rel="dns-prefetch" href="https://api.healthcpds.com" />

        {/* Geo meta for Kigali, Rwanda */}
        <meta name="geo.region" content="RW-01" />
        <meta name="geo.placename" content="Kigali, Rwanda" />
        <meta name="geo.position" content="-1.9441;30.0619" />
        <meta name="ICBM" content="-1.9441, 30.0619" />

        {/* Mobile colour */}
        <meta name="msapplication-TileColor" content="#2D6A4F" />
        <meta name="msapplication-TileImage" content="/icon-192x192.png" />

        {/* Organization JSON-LD */}
        <Script
          id="schema-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
          strategy="beforeInteractive"
        />
        {/* Website + SearchAction JSON-LD */}
        <Script
          id="schema-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
          strategy="beforeInteractive"
        />
      </head>
      <body>
        {googleClientId ? (
          <GoogleOAuthProvider clientId={googleClientId}>
            <Providers>
              {children}
            </Providers>
          </GoogleOAuthProvider>
        ) : (
          <Providers>
            {children}
          </Providers>
        )}
      </body>
    </html>
  );
}