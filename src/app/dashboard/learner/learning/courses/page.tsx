"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Star,
  Clock,
  BookOpen,
  Trophy,
  Target,
  Crown,
  Award,
  CheckCircle,
  PlayCircle,
  PauseCircle,
  Calendar,
  BookmarkCheck,
  GraduationCap,
  User,
  AlertCircle,
  Loader2,
  Sparkles,
  Code,
  Palette,
  BarChart,
  Briefcase,
  Globe,
  ArrowRight,
  Lock,
  Users,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSelector, useDispatch } from "react-redux"
import type { RootState, AppDispatch } from "@/lib/store"
import Cookies from "js-cookie"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

interface EnrolledCourse {
  id: string
  course: {
    id: string
    title: string
    description: string
    thumbnail_url: string
    level: string
    price: number
    status: string
    is_certificate_available: boolean
    course_type: "PUBLIC" | "PRIVATE"
    institution_id?: string
    duration_minutes: number
    language: string
    average_rating: number | string
    total_reviews: number
    enrollment_count: number
    modules?: Array<{
      id: string
      title: string
      lessons: Array<{
        id: string
        title: string
        duration_minutes: number
        is_preview: boolean
        order_index: number
      }>
    }>
    instructor?: {
      id: string
      first_name: string
      last_name: string
      profile_picture_url?: string
    }
  }
  progress_percentage: number
  status: "ACTIVE" | "COMPLETED" | "DROPPED" | "EXPIRED" | "PENDING"
  total_time_spent_minutes: number
  completed_lessons: number
  enrolled_at: string
  last_accessed?: string
  certificate_issued: boolean
  final_score?: number
}

// ─── My Courses Page Skeleton ─────────────────────────────────────────────────
const MyCoursesPageSkeleton = () => (
  <div className="min-h-screen bg-background">
    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3">
      {/* Hero Header Skeleton */}
      <div className="text-center relative mb-4">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/5 to-primary/10 rounded-2xl -z-10"></div>
        <div className="py-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Skeleton className="w-10 h-10 rounded-full bg-gray-200/70" />
            <Skeleton className="h-7 w-48 bg-gray-200/70" />
          </div>
          <Skeleton className="h-4 w-96 mx-auto mb-4 bg-gray-200/70" />

          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 max-w-4xl mx-auto">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-card border border-gray-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Skeleton className="w-4 h-4 rounded bg-gray-200/70" />
                  <Skeleton className="h-6 w-8 bg-gray-200/70" />
                </div>
                <Skeleton className="h-3 w-20 bg-gray-200/70" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search and Filter Bar Skeleton */}
      <div className="mb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          <div className="relative flex-1 max-w-md">
            <Skeleton className="h-9 w-full rounded-md bg-gray-200/70" />
          </div>
          <Skeleton className="h-9 w-24 rounded-md bg-gray-200/70" />
        </div>

        {/* Tabs Skeleton */}
        <div className="w-full">
          <div className="grid w-full grid-cols-4 lg:w-fit h-9 gap-1">
            <Skeleton className="h-9 w-20 rounded bg-gray-200/70" />
            <Skeleton className="h-9 w-20 rounded bg-gray-200/70" />
            <Skeleton className="h-9 w-24 rounded bg-gray-200/70" />
            <Skeleton className="h-9 w-20 rounded bg-gray-200/70" />
          </div>

          {/* Course Cards Grid Skeleton */}
          <div className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div 
                  key={i} 
                  className="bg-white rounded-lg overflow-hidden border border-gray-200"
                >
                  {/* Thumbnail Skeleton */}
                  <div className="relative h-44 bg-gray-100">
                    <Skeleton className="w-full h-full bg-gray-200/70" />
                    {/* Status Badge */}
                    <div className="absolute top-3 left-3">
                      <Skeleton className="h-5 w-16 rounded bg-gray-300/70" />
                    </div>
                    {/* Level Badge */}
                    <div className="absolute top-3 right-3">
                      <Skeleton className="h-5 w-20 rounded bg-gray-300/70" />
                    </div>
                    {/* Progress bar */}
                    <div className="absolute bottom-0 left-0 right-0">
                      <Skeleton className="h-1.5 w-full bg-gray-300/70" />
                    </div>
                  </div>

                  {/* Content Skeleton */}
                  <div className="p-4 space-y-3">
                    {/* Rating and Date */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Skeleton key={s} className="w-3 h-3 rounded bg-gray-200/70" />
                        ))}
                        <Skeleton className="h-3 w-12 ml-1 bg-gray-200/70" />
                      </div>
                      <Skeleton className="h-3 w-16 bg-gray-200/70" />
                    </div>

                    {/* Title */}
                    <Skeleton className="h-5 w-full bg-gray-200/70" />
                    <Skeleton className="h-5 w-3/4 bg-gray-200/70" />

                    {/* Instructor */}
                    <div className="flex items-center gap-1.5">
                      <Skeleton className="w-5 h-5 rounded-full bg-gray-200/70" />
                      <Skeleton className="h-3 w-24 bg-gray-200/70" />
                    </div>

                    {/* Description */}
                    <Skeleton className="h-3 w-full bg-gray-200/70" />
                    <Skeleton className="h-3 w-5/6 bg-gray-200/70" />

                    {/* Stats Row */}
                    <div className="flex items-center gap-3 py-2.5 border-y border-gray-200">
                      <Skeleton className="h-3 w-16 bg-gray-200/70" />
                      <Skeleton className="h-3 w-16 bg-gray-200/70" />
                      <Skeleton className="h-3 w-20 ml-auto bg-gray-200/70" />
                    </div>

                    {/* Progress */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <Skeleton className="h-3 w-12 bg-gray-200/70" />
                        <Skeleton className="h-3 w-8 bg-gray-200/70" />
                      </div>
                      <Skeleton className="h-1.5 w-full bg-gray-200/70" />
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                      <Skeleton className="h-3 w-24 bg-gray-200/70" />
                      <Skeleton className="h-8 w-24 rounded bg-gray-200/70" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

// Helper functions
const formatRating = (rating: number | string | undefined | null): string => {
  if (rating === undefined || rating === null || rating === "") return "No ratings"
  try {
    const numRating = typeof rating === 'string' ? parseFloat(rating) : rating
    if (isNaN(numRating)) return "No ratings"
    return numRating.toFixed(1)
  } catch (error) {
    return "No ratings"
  }
}

const getNumericRating = (rating: number | string | undefined | null): number => {
  if (rating === undefined || rating === null || rating === "") return 0
  try {
    const numRating = typeof rating === 'string' ? parseFloat(rating) : rating
    return isNaN(numRating) ? 0 : numRating
  } catch (error) {
    return 0
  }
}

const stripHtml = (input: string | undefined | null): string => {
  if (!input) return ""
  if (typeof window !== "undefined" && window.DOMParser) {
    try {
      const doc = new DOMParser().parseFromString(input, "text/html")
      return doc.body.textContent || ""
    } catch (error) {
      return input.replace(/<[^>]*>/g, "")
    }
  }
  return input.replace(/<[^>]*>/g, "")
}

const truncate = (text: string, maxLength = 140) => {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength).trim()}...`
}

const formatDuration = (mins?: number): string => {
  if (!mins) return '—'
  const h = Math.floor(mins / 60)
  const m = mins % 60
  if (h > 0) return `${h}h${m > 0 ? ` ${m}m` : ''}`
  return `${m}m`
}

const getLevelColor = (level: string): string => {
  switch (level?.toUpperCase()) {
    case 'BEGINNER': return '#22c55e'
    case 'INTERMEDIATE': return '#3b82f6'
    case 'ADVANCED': return '#8b5cf6'
    case 'EXPERT': return '#ec4899'
    default: return '#64748b'
  }
}

const getLevelLabel = (level: string): string => {
  if (!level) return 'Course'
  return level.charAt(0).toUpperCase() + level.slice(1).toLowerCase()
}

const getStatusColor = (status: string): string => {
  switch (status) {
    case "COMPLETED": return "#22c55e"
    case "ACTIVE": return "#3b82f6"
    case "PENDING": return "#eab308"
    case "EXPIRED":
    case "DROPPED": return "#ef4444"
    default: return "#64748b"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "COMPLETED": return CheckCircle
    case "ACTIVE": return PlayCircle
    case "PENDING": return PauseCircle
    case "EXPIRED":
    case "DROPPED": return AlertCircle
    default: return BookOpen
  }
}

const DEFAULT_THUMBNAIL = 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=240&fit=crop'

// Default Thumbnail Component
const DefaultCourseThumbnail = ({ title, level, courseType }: { title: string; level: string; courseType: string }) => {
  const getIconByTitle = () => {
    const lowerTitle = title.toLowerCase()
    if (lowerTitle.includes('code') || lowerTitle.includes('programming') || lowerTitle.includes('develop')) return Code
    if (lowerTitle.includes('design') || lowerTitle.includes('art') || lowerTitle.includes('creative')) return Palette
    if (lowerTitle.includes('business') || lowerTitle.includes('management') || lowerTitle.includes('marketing')) return Briefcase
    if (lowerTitle.includes('data') || lowerTitle.includes('analytics') || lowerTitle.includes('statistics')) return BarChart
    if (lowerTitle.includes('language') || lowerTitle.includes('communication')) return Globe
    return GraduationCap
  }

  const getGradientByLevel = () => {
    switch (level) {
      case "BEGINNER": return "from-green-400 via-emerald-500 to-teal-600"
      case "INTERMEDIATE": return "from-blue-400 via-cyan-500 to-sky-600"
      case "ADVANCED":
      case "EXPERT": return "from-[#5b4e96] via-[#6d5ba8] to-[#7e6bb9]"
      default: return "from-gray-400 via-gray-500 to-gray-600"
    }
  }

  const IconComponent = getIconByTitle()
  const gradientColors = getGradientByLevel()

  return (
    <div className={`w-full h-full bg-gradient-to-br ${gradientColors} relative overflow-hidden flex items-center justify-center`}>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full translate-x-1/3 translate-y-1/3"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Sparkles className="w-24 h-24 text-white animate-pulse" />
        </div>
      </div>
      <div className="relative z-10 flex flex-col items-center gap-2">
        <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 border-2 border-white/30 shadow-lg">
          <IconComponent className="w-10 h-10 text-white" />
        </div>
        <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
          <p className="text-xs font-bold text-gray-800 uppercase tracking-wide">{courseType}</p>
        </div>
      </div>
    </div>
  )
}

// Clean Enrolled Course Card (CuratedPathCarousel style)
const CleanEnrolledCourseCard = ({ enrollment, isHovered, onHover }: { 
  enrollment: EnrolledCourse
  isHovered: boolean
  onHover: (id: string | null) => void
}) => {
  const course = enrollment.course
  const numericRating = getNumericRating(course.average_rating)
  const formattedRating = formatRating(course.average_rating)
  const cleanDescriptionText = truncate(stripHtml(course.description))
  const levelColor = getLevelColor(course.level)
  const statusColor = getStatusColor(enrollment.status)
  const StatusIcon = getStatusIcon(enrollment.status)

  return (
    <div
      className="relative bg-white flex flex-col h-full transition-all duration-300 cursor-pointer overflow-hidden"
      style={{
        border: `1px solid ${isHovered ? 'rgba(45,106,79,0.22)' : 'rgba(30,47,94,0.08)'}`,
        boxShadow: isHovered
          ? '0 20px 40px -8px rgba(45,106,79,0.18)'
          : '0 4px 16px -4px rgba(0,0,0,0.06)',
        transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
      }}
      onMouseEnter={() => onHover(enrollment.id)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Accent top bar */}
      <div
        className="absolute top-0 left-0 h-[3px] z-10 transition-all duration-500"
        style={{
          width: isHovered ? '100%' : '32px',
          background: `linear-gradient(90deg, ${statusColor}, #74C69D)`,
        }}
      />

      {/* Thumbnail */}
      <div className="relative h-44 overflow-hidden bg-[#F8F9FA] flex-shrink-0">
        {course.thumbnail_url ? (
          <img
            src={course.thumbnail_url}
            alt={course.title}
            className="w-full h-full object-cover transition-transform duration-500"
            style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
            onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_THUMBNAIL }}
          />
        ) : (
          <DefaultCourseThumbnail title={course.title} level={course.level} courseType={course.course_type} />
        )}

        {/* Play overlay */}
        <div
          className="absolute inset-0 flex items-center justify-center transition-all duration-300"
          style={{
            backgroundColor: isHovered ? 'rgba(0,0,0,0.28)' : 'rgba(0,0,0,0)',
          }}
        >
          <Link href={`/courses/${course.id}/learn`}>
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300"
              style={{
                backgroundColor: '#fff',
                boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                opacity: isHovered ? 1 : 0,
                transform: isHovered ? 'scale(1)' : 'scale(0.8)',
              }}
            >
              <PlayCircle className="w-4 h-4" style={{ color: '#2D6A4F' }} />
            </div>
          </Link>
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span
            className="px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-1"
            style={{ backgroundColor: statusColor }}
          >
            <StatusIcon className="w-2.5 h-2.5" />
            {enrollment.status.replace("_", " ")}
          </span>
        </div>

        {/* Level Badge */}
        <div className="absolute top-3 right-3">
          <span
            className="px-2 py-0.5 text-[10px] font-semibold text-white uppercase"
            style={{ backgroundColor: levelColor }}
          >
            {getLevelLabel(course.level)}
          </span>
        </div>

        {/* Certificate Badge */}
        {enrollment.certificate_issued && (
          <div className="absolute bottom-3 left-3">
            <span
              className="px-2 py-0.5 text-[10px] font-bold text-white flex items-center gap-1"
              style={{ backgroundColor: '#E9C46A' }}
            >
              <Award className="w-2.5 h-2.5" />
              Certified
            </span>
          </div>
        )}

        {/* Course Type Badge */}
        <div className="absolute bottom-3 right-3">
          <span
            className="px-2 py-0.5 text-[10px] font-semibold text-white flex items-center gap-1 uppercase"
            style={{ 
              backgroundColor: course.course_type === 'PRIVATE' ? '#8b5cf6' : '#2D6A4F' 
            }}
          >
            {course.course_type === 'PRIVATE' ? 
              <Lock className="w-2.5 h-2.5" /> : 
              <Globe className="w-2.5 h-2.5" />
            }
            {course.course_type}
          </span>
        </div>

        {/* Progress bar overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/30">
          <div
            className="h-full transition-all duration-500"
            style={{ 
              width: `${enrollment.progress_percentage}%`,
              background: `linear-gradient(90deg, ${statusColor}, #74C69D)`
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Rating + Enrolled Date */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.round(numericRating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="text-[10px] ml-1" style={{ color: '#717182' }}>
              {formattedRating} ({course.total_reviews || 0})
            </span>
          </div>
          <div className="flex items-center gap-1 text-[10px]" style={{ color: '#717182' }}>
            <Calendar className="w-2.5 h-2.5" />
            {new Date(enrollment.enrolled_at).toLocaleDateString()}
          </div>
        </div>

        {/* Title */}
        <h3
          className="text-[13px] font-bold leading-snug line-clamp-2 mb-1.5 transition-colors duration-200"
          style={{ color: isHovered ? '#2D6A4F' : '#1E2F5E' }}
        >
          {course.title}
        </h3>

        {/* Instructor */}
        {course.instructor && (
          <div className="flex items-center gap-1.5 mb-2">
            {course.instructor.profile_picture_url ? (
              <img
                src={course.instructor.profile_picture_url}
                alt={`${course.instructor.first_name} ${course.instructor.last_name}`}
                className="w-5 h-5 rounded-full object-cover"
              />
            ) : (
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                style={{ backgroundColor: '#2D6A4F' }}
              >
                {course.instructor.first_name?.[0]}{course.instructor.last_name?.[0]}
              </div>
            )}
            <span className="text-[11px]" style={{ color: '#717182' }}>
              {course.instructor.first_name} {course.instructor.last_name}
            </span>
          </div>
        )}

        {/* Description */}
        <p className="text-[11px] leading-relaxed line-clamp-2 mb-3 flex-1" style={{ color: '#717182' }}>
          {cleanDescriptionText || "No course description available"}
        </p>

        {/* Stats row */}
        <div
          className="flex items-center gap-3 py-2.5 mb-3"
          style={{ borderTop: '1px solid rgba(30,47,94,0.06)', borderBottom: '1px solid rgba(30,47,94,0.06)' }}
        >
          <div className="flex items-center gap-1 text-[10px]" style={{ color: '#717182' }}>
            <Clock className="w-3 h-3" style={{ color: '#74C69D' }} />
            {enrollment.total_time_spent_minutes || 0} min
          </div>
          <div className="flex items-center gap-1 text-[10px]" style={{ color: '#717182' }}>
            <Target className="w-3 h-3" style={{ color: '#74C69D' }} />
            {course.language || "English"}
          </div>
          <div className="flex items-center gap-1 text-[10px] ml-auto" style={{ color: '#717182' }}>
            <BookOpen className="w-3 h-3" style={{ color: '#74C69D' }} />
            {enrollment.completed_lessons || 0} lessons
          </div>
        </div>

        {/* Progress percentage */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-[10px] mb-1">
            <span style={{ color: '#717182' }}>Progress</span>
            <span className="font-bold" style={{ color: statusColor }}>{enrollment.progress_percentage}%</span>
          </div>
          <Progress value={enrollment.progress_percentage} className="h-1.5" />
        </div>

        {/* Last accessed + Action */}
        <div className="flex items-center justify-between pt-2 mt-auto" style={{ borderTop: '1px solid rgba(30,47,94,0.06)' }}>
          <span className="text-[10px]" style={{ color: '#717182' }}>
            {enrollment.last_accessed 
              ? `Last: ${new Date(enrollment.last_accessed).toLocaleDateString()}`
              : "Never accessed"
            }
          </span>

          <Link
            href={`/courses/${course.id}/learn`}
            className="flex items-center gap-1 text-[11px] font-semibold px-3 py-1.5 transition-all duration-200"
            style={{
              backgroundColor: isHovered ? statusColor : 'transparent',
              color: isHovered ? '#fff' : statusColor,
              border: `1.5px solid ${statusColor}`,
            }}
          >
            {enrollment.status === "COMPLETED" ? "Review" : "Continue"}
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function MyCoursesPage() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { user: reduxUser, isAuthenticated, token: reduxToken } = useSelector((state: RootState) => state.cpdAuth)
  
  const [enrollments, setEnrollments] = useState<EnrolledCourse[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState<"all" | "active" | "completed" | "pending">("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [retryCount, setRetryCount] = useState(0)
  const [authChecked, setAuthChecked] = useState(false)
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null)

  // Get user and token from multiple sources
  const getUser = () => {
    if (reduxUser && reduxUser.id) return reduxUser
    const userCookie = Cookies.get("cpd_user")
    if (userCookie) {
      try { return JSON.parse(userCookie) } catch (e) { return null }
    }
    try {
      const localUser = localStorage.getItem("cpd_user")
      if (localUser) return JSON.parse(localUser)
    } catch (e) { return null }
    return null
  }

  const getToken = () => {
    if (reduxToken) return reduxToken
    const tokenCookie = Cookies.get("cpd_token")
    if (tokenCookie) return tokenCookie
    try { return localStorage.getItem("cpd_token") } catch (e) { return null }
    return null
  }

  const user = getUser()
  const token = getToken()

  useEffect(() => {
    if (user && token) {
      setAuthChecked(true)
      fetchEnrolledCourses()
    } else if (!isAuthenticated && !user && !token) {
      const timer = setTimeout(() => {
        if (!getUser() && !getToken()) {
          setAuthChecked(true)
          setLoading(false)
        }
      }, 2000)
      return () => clearTimeout(timer)
    } else {
      setAuthChecked(true)
      setLoading(false)
    }
  }, [reduxUser, isAuthenticated, reduxToken, retryCount])

  const fetchEnrolledCourses = async () => {
    const currentUser = getUser()
    const currentToken = getToken()
    
    if (!currentUser || !currentToken) {
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const authToken = currentToken

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/enrollments/user-enrollments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          user_id: currentUser.id,
          include_course_details: true,
          page: 1,
          limit: 100
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        
        if (response.status === 401) {
          toast.error("Your session has expired. Please login again.")
          Cookies.remove("cpd_token")
          Cookies.remove("cpd_user")
          localStorage.removeItem("cpd_token")
          localStorage.removeItem("cpd_user")
          router.push("/login")
        } else if (response.status === 403) {
          toast.error("You don't have permission to view these enrollments")
        } else {
          throw new Error(
            errorData.message || 
            `Failed to fetch enrollments: ${response.status} ${response.statusText}`
          )
        }
        setEnrollments([])
        setLoading(false)
        return
      }

      const data = await response.json()
      
      if (data.success && data.data) {
        setEnrollments(data.data || [])
      } else {
        if (data.message) toast.error(data.message)
        setEnrollments([])
      }
    } catch (error: any) {
      toast.error(`Failed to load courses: ${error.message}`)
      setEnrollments([])
    } finally {
      setLoading(false)
    }
  }

  const handleRetry = () => setRetryCount(prev => prev + 1)

  const filteredEnrollments = enrollments.filter((enrollment) => {
    const matchesSearch =
      enrollment.course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollment.course.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesTab =
      selectedTab === "all" ||
      (selectedTab === "active" && enrollment.status === "ACTIVE") ||
      (selectedTab === "completed" && enrollment.status === "COMPLETED") ||
      (selectedTab === "pending" && enrollment.status === "PENDING")

    return matchesSearch && matchesTab
  })

  // Loading state with skeleton
  if (loading) {
    return <MyCoursesPageSkeleton />
  }

  // Not authenticated state
  if (!user || !token) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="bg-muted/50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-bold mb-2">Authentication Required</h3>
          <p className="text-sm text-muted-foreground mb-4">Please login to view your enrolled courses</p>
          <div className="flex gap-3 justify-center">
            <Button asChild size="sm">
              <Link href="/login">
                <User className="w-4 h-4 mr-2" />
                Login
              </Link>
            </Button>
            <Button variant="outline" size="sm" onClick={handleRetry}>
              <Loader2 className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // No enrollments state
  if (enrollments.length === 0 && !loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center relative mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/5 to-primary/10 rounded-2xl -z-10"></div>
            <div className="py-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="p-2 bg-primary/10 rounded-full">
                  <GraduationCap className="w-6 h-6 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-primary">My Learning Journey</h1>
              </div>
              <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
                Track your progress, continue learning, and unlock achievements
              </p>
            </div>
          </div>

          <div className="text-center py-8">
            <div className="bg-muted/50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold mb-2">No Enrollments Found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {searchTerm 
                ? "No courses match your search. Try different keywords."
                : "You haven't enrolled in any courses yet. Start your learning journey by exploring available courses."
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="sm">
                <Link href="/courses">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Browse Courses
                </Link>
              </Button>
              <Button variant="outline" size="sm" onClick={handleRetry}>
                <Loader2 className="w-4 h-4 mr-2" />
                Retry Loading
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3">
        <div className="text-center relative mb-4">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/5 to-primary/10 rounded-2xl -z-10"></div>
          <div className="py-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="p-2 bg-primary/10 rounded-full">
                <GraduationCap className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-primary">My Learning Journey</h1>
            </div>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto mb-4">
              Track your progress, continue learning, and unlock achievements
            </p>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 max-w-4xl mx-auto">
              <div className="bg-card border-2 border-primary/10 rounded-lg p-3 hover:border-primary/20 transition-colors">
                <div className="flex items-center gap-2 mb-1">
                  <BookOpen className="w-4 h-4 text-blue-500" />
                  <span className="text-xl font-bold text-primary">{enrollments.length}</span>
                </div>
                <p className="text-xs text-muted-foreground">Total Courses</p>
              </div>
              <div className="bg-card border-2 border-green-500/10 rounded-lg p-3 hover:border-green-500/20 transition-colors">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-xl font-bold text-green-600">
                    {enrollments.filter((c) => c.status === "COMPLETED").length}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
              <div className="bg-card border-2 border-blue-500/10 rounded-lg p-3 hover:border-blue-500/20 transition-colors">
                <div className="flex items-center gap-2 mb-1">
                  <PlayCircle className="w-4 h-4 text-blue-500" />
                  <span className="text-xl font-bold text-blue-600">
                    {enrollments.filter((c) => c.status === "ACTIVE").length}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">In Progress</p>
              </div>
              <div className="bg-card border-2 border-yellow-500/10 rounded-lg p-3 hover:border-yellow-500/20 transition-colors">
                <div className="flex items-center gap-2 mb-1">
                  <Award className="w-4 h-4 text-yellow-500" />
                  <span className="text-xl font-bold text-yellow-600">
                    {enrollments.filter((c) => c.certificate_issued).length}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">Certificates</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search your enrollments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-9 text-sm border-2 focus:border-primary/50 transition-colors"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleRetry}>
                <Loader2 className="w-3.5 h-3.5 mr-1.5" />
                Refresh
              </Button>
            </div>
          </div>

          <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as "all" | "active" | "completed" | "pending")} className="w-full">
            <TabsList className="grid w-full grid-cols-4 lg:w-fit h-9">
              <TabsTrigger value="all" className="flex items-center gap-1.5 text-xs">
                <BookOpen className="w-3.5 h-3.5" />
                All ({enrollments.length})
              </TabsTrigger>
              <TabsTrigger value="active" className="flex items-center gap-1.5 text-xs">
                <PlayCircle className="w-3.5 h-3.5" />
                Active ({enrollments.filter((c) => c.status === "ACTIVE").length})
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex items-center gap-1.5 text-xs">
                <CheckCircle className="w-3.5 h-3.5" />
                Completed ({enrollments.filter((c) => c.status === "COMPLETED").length})
              </TabsTrigger>
              <TabsTrigger value="pending" className="flex items-center gap-1.5 text-xs">
                <Target className="w-3.5 h-3.5" />
                Pending ({enrollments.filter((c) => c.status === "PENDING").length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredEnrollments.map((enrollment) => (
                  <CleanEnrolledCourseCard
                    key={enrollment.id}
                    enrollment={enrollment}
                    isHovered={hoveredCardId === enrollment.id}
                    onHover={setHoveredCardId}
                  />
                ))}
              </div>

              {filteredEnrollments.length === 0 && (
                <div className="text-center py-8">
                  <div className="bg-muted/50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <GraduationCap className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">
                    {selectedTab === "all" ? "No enrollments found" : `No ${selectedTab} enrollments`}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {selectedTab === "all"
                      ? searchTerm 
                        ? "No courses match your search. Try different keywords."
                        : "Start your learning journey by enrolling in some courses"
                      : `You don't have any ${selectedTab} courses yet`}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button asChild size="sm">
                      <Link href="/courses">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Browse Courses
                      </Link>
                    </Button>
                    {searchTerm && (
                      <Button variant="outline" size="sm" onClick={() => setSearchTerm("")}>
                        Clear Search
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}