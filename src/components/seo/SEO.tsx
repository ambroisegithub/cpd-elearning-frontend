// src/components/seo/SEO.tsx
"use client"

import React from "react"
import Head from "next/head"
import { SITE, getSeoMetadata, SeoProps, buildOrganizationSchema, buildWebsiteSchema } from "@/lib/seo.config"

interface SEOProps extends SeoProps {
  children?: React.ReactNode
}

export default function SEO({ children, ...props }: SEOProps) {
  const { title, description, canonical, ogImage, ogType, noIndex, publishedTime, modifiedTime, author } =
    getSeoMetadata(props)

  const organizationSchema = buildOrganizationSchema()
  const websiteSchema = buildWebsiteSchema()

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="author" content={author || SITE.name} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={canonical} />

      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:locale" content="en_RW" />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={SITE.twitterHandle} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      <meta name="geo.region" content="RW-01" />
      <meta name="geo.placename" content="Kigali, Rwanda" />
      <meta name="geo.position" content="-1.9441;30.0619" />
      <meta name="ICBM" content="-1.9441, 30.0619" />

      <meta name="theme-color" content="#2D6A4F" />

      <script type="application/ld+json">{JSON.stringify(organizationSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(websiteSchema)}</script>

      {children}
    </Head>
  )
}