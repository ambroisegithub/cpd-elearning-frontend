import { MetadataRoute } from "next"
import { SITE } from "@/lib/seo.config"

const BASE = SITE.url
const NOW = new Date().toISOString()

const STATIC_PAGES: {
  path: string
  changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never"
  priority: number
}[] = [
  { path: "", changeFrequency: "daily", priority: 1.0 },
  { path: "/courses", changeFrequency: "daily", priority: 0.95 },
  { path: "/institutions", changeFrequency: "weekly", priority: 0.8 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
  { path: "/faq", changeFrequency: "weekly", priority: 0.6 },
  { path: "/login", changeFrequency: "monthly", priority: 0.5 },
  { path: "/register", changeFrequency: "monthly", priority: 0.5 },
]

async function fetchCourseUrls(): Promise<{ id: string; updatedAt?: string }[]> {
  try {
    const API = process.env.NEXT_PUBLIC_API_URL ?? ""
    const res = await fetch(`${API}/courses/all?fields=id,updatedAt`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.data?.courses ?? []
  } catch {
    return []
  }
}

async function fetchInstitutionUrls(): Promise<{ slug: string }[]> {
  try {
    const API = process.env.NEXT_PUBLIC_API_URL ?? ""
    const res = await fetch(`${API}/institutions/public`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.data ?? []
  } catch {
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_PAGES.map(({ path, changeFrequency, priority }) => ({
    url: `${BASE}${path}`,
    lastModified: NOW,
    changeFrequency,
    priority,
  }))

  const courses = await fetchCourseUrls()
  const courseEntries: MetadataRoute.Sitemap = courses.map((course) => ({
    url: `${BASE}/courses/${course.id}`,
    lastModified: course.updatedAt ? new Date(course.updatedAt).toISOString() : NOW,
    changeFrequency: "weekly",
    priority: 0.8,
  }))

  const institutions = await fetchInstitutionUrls()
  const institutionEntries: MetadataRoute.Sitemap = institutions.map((inst) => ({
    url: `${BASE}/institutions/${inst.slug}`,
    lastModified: NOW,
    changeFrequency: "weekly",
    priority: 0.75,
  }))

  return [...staticEntries, ...courseEntries, ...institutionEntries]
}