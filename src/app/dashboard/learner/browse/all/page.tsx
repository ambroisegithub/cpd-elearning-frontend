// @ts-nocheck
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import {
  getAllCoursesWithFullInfo,
  getCourseCategories,
  Course,
} from "@/lib/features/courses/course-slice"
import {
  checkEnrollmentEligibility,
  requestEnrollmentApproval,
  selectEnrollmentEligibility,
  selectIsUserEnrolled,
  selectUserEnrollment,
} from "@/lib/features/enrollments/enrollmentSlice"
import { useAuth } from "@/hooks/use-auth"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import {
  Search,
  Star,
  Clock,
  Users,
  Award,
  Globe,
  Building2,
  BookOpen,
  User,
  Play,
  Loader2,
  ChevronRight,
  Sparkles,
  Target,
  Trophy,
  Crown,
  GraduationCap,
  Lock,
  ArrowRight,
  Filter,
  X,
  ChevronDown,
  Grid3x3,
  List,
} from "lucide-react"
import toast from "react-hot-toast"

// Helper function to safely parse numbers
const parseNumber = (value: any): number => {
  if (typeof value === "number") return value
  if (typeof value === "string") {
    const parsed = parseFloat(value)
    return isNaN(parsed) ? 0 : parsed
  }
  return 0
}

// Format duration
const formatDuration = (mins?: number): string => {
  if (!mins) return '—'
  const h = Math.floor(mins / 60)
  const m = mins % 60
  if (h > 0) return `${h}h${m > 0 ? ` ${m}m` : ''}`
  return `${m}m`
}

// Format price
const formatPrice = (price?: number): string => {
  if (price === undefined || price === null) return 'Free'
  if (price === 0) return 'Free'
  return `$${price.toFixed(2)}`
}

// Level color
const getLevelColor = (level: string): string => {
  switch (level?.toUpperCase()) {
    case 'BEGINNER': return '#22c55e'
    case 'INTERMEDIATE': return '#3b82f6'
    case 'ADVANCED': return '#8b5cf6'
    case 'EXPERT': return '#ec4899'
    default: return '#64748b'
  }
}

// Level label
const getLevelLabel = (level: string): string => {
  if (!level) return 'Course'
  return level.charAt(0).toUpperCase() + level.slice(1).toLowerCase()
}

// Level icon
const getLevelIcon = (level: string) => {
  switch (level?.toUpperCase()) {
    case 'BEGINNER': return Target
    case 'INTERMEDIATE': return Trophy
    case 'ADVANCED': return Crown
    case 'EXPERT': return GraduationCap
    default: return BookOpen
  }
}

// Default thumbnail
const DEFAULT_THUMBNAIL = 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=240&fit=crop'

// ─── All Courses Page Skeleton ─────────────────────────────────────────────────
const AllCoursesPageSkeleton = () => (
  <div className="min-h-screen bg-background">
    {/* Hero Section Skeleton */}
    <div className="relative bg-gradient-to-br from-primary/10 via-secondary/5 to-primary/5 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Skeleton className="w-10 h-10 rounded-full bg-gray-200/70" />
            <Skeleton className="h-8 w-64 bg-gray-200/70" />
          </div>
          <Skeleton className="h-5 w-96 mx-auto mb-6 bg-gray-200/70" />
          <div className="max-w-2xl mx-auto">
            <Skeleton className="h-12 w-full rounded-full bg-gray-200/70" />
          </div>
        </div>
      </div>
    </div>

    {/* Tabs and Filter Bar Skeleton */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-1 mb-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-10 w-full rounded bg-gray-200/70" />
          ))}
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-48 bg-gray-200/70" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-24 rounded-full bg-gray-200/70" />
            <Skeleton className="h-6 w-16 rounded-full bg-gray-200/70" />
          </div>
        </div>
      </div>

      {/* Course Cards Grid Skeleton */}
      {[1, 2].map((section) => (
        <div key={section} className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-7 w-40 bg-gray-200/70" />
            <Skeleton className="h-8 w-20 bg-gray-200/70" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden border border-gray-200">
                {/* Thumbnail */}
                <Skeleton className="h-44 w-full bg-gray-200/70 rounded-none" />
                <div className="p-4 space-y-3">
                  {/* Category & Rating */}
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-20 bg-gray-200/70" />
                    <Skeleton className="h-4 w-16 bg-gray-200/70" />
                  </div>
                  {/* Title */}
                  <Skeleton className="h-5 w-full bg-gray-200/70" />
                  <Skeleton className="h-5 w-3/4 bg-gray-200/70" />
                  {/* Instructor */}
                  <div className="flex items-center gap-1.5">
                    <Skeleton className="w-5 h-5 rounded-full bg-gray-200/70" />
                    <Skeleton className="h-4 w-28 bg-gray-200/70" />
                  </div>
                  {/* Description */}
                  <Skeleton className="h-4 w-full bg-gray-200/70" />
                  <Skeleton className="h-4 w-5/6 bg-gray-200/70" />
                  {/* Stats */}
                  <div className="flex items-center gap-3 py-2.5 border-y border-gray-200">
                    <Skeleton className="h-4 w-16 bg-gray-200/70" />
                    <Skeleton className="h-4 w-16 bg-gray-200/70" />
                    <Skeleton className="h-4 w-20 ml-auto bg-gray-200/70" />
                  </div>
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    <Skeleton className="h-5 w-12 rounded bg-gray-200/70" />
                    <Skeleton className="h-5 w-16 rounded bg-gray-200/70" />
                  </div>
                  {/* Price & Action */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                    <Skeleton className="h-6 w-16 bg-gray-200/70" />
                    <Skeleton className="h-8 w-28 rounded bg-gray-200/70" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
)

// ─── Clean Course Card Component ──────────────────────────────────────────────
const CleanCourseCard = ({ 
  course, 
  isHovered, 
  onHover 
}: { 
  course: Course
  isHovered: boolean
  onHover: (id: string | null) => void 
}) => {
  const enrollmentButton = getEnrollmentButtonInfo(course)
  const levelColor = getLevelColor(course.level)
  const LevelIcon = getLevelIcon(course.level)
  const numRating = parseNumber(course.average_rating)

  return (
    <div
      className="relative bg-white flex flex-col h-full transition-all duration-300 cursor-pointer overflow-hidden rounded-xl group"
      style={{
        border: `1px solid ${isHovered ? 'rgba(45,106,79,0.22)' : 'rgba(30,47,94,0.08)'}`,
        boxShadow: isHovered
          ? '0 20px 40px -8px rgba(45,106,79,0.18)'
          : '0 4px 16px -4px rgba(0,0,0,0.06)',
        transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
      }}
      onMouseEnter={() => onHover(course.id)}
      onMouseLeave={() => onHover(null)}
      onClick={() => enrollmentButton.onClick()}
    >
      {/* Accent top bar */}
      <div
        className="absolute top-0 left-0 h-[3px] z-10 transition-all duration-500"
        style={{
          width: isHovered ? '100%' : '32px',
          background: `linear-gradient(90deg, ${levelColor}, #74C69D)`,
        }}
      />

      {/* Thumbnail */}
      <div className="relative h-44 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex-shrink-0">
        <img
          src={course.thumbnail_url || DEFAULT_THUMBNAIL}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-500"
          style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
          onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_THUMBNAIL }}
        />

        {/* Play overlay */}
        <div
          className="absolute inset-0 flex items-center justify-center transition-all duration-300"
          style={{
            backgroundColor: isHovered ? 'rgba(0,0,0,0.28)' : 'rgba(0,0,0,0)',
          }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg"
            style={{
              backgroundColor: '#fff',
              opacity: isHovered ? 1 : 0,
              transform: isHovered ? 'scale(1)' : 'scale(0.8)',
            }}
          >
            <Play className="w-5 h-5 ml-0.5" style={{ color: levelColor }} fill={levelColor} />
          </div>
        </div>

        {/* Level Badge */}
        <div className="absolute top-3 left-3">
          <span
            className="px-2.5 py-1 text-[10px] font-bold text-white uppercase tracking-wider rounded-md flex items-center gap-1 shadow-sm"
            style={{ backgroundColor: levelColor }}
          >
            <LevelIcon className="w-3 h-3" />
            {getLevelLabel(course.level)}
          </span>
        </div>

        {/* Course Type Badge */}
        <div className="absolute top-3 right-3">
          <span
            className="px-2.5 py-1 text-[10px] font-semibold text-white flex items-center gap-1 uppercase rounded-md shadow-sm"
            style={{ 
              backgroundColor: course.course_type === 'PRIVATE' ? '#8b5cf6' : '#2D6A4F' 
            }}
          >
            {course.course_type === 'PRIVATE' ? 
              <Lock className="w-3 h-3" /> : 
              <Globe className="w-3 h-3" />
            }
            {course.course_type}
          </span>
        </div>

        {/* Certificate Badge */}
        {course.is_certificate_available && (
          <div className="absolute bottom-3 left-3">
            <span
              className="px-2.5 py-1 text-[10px] font-bold text-white flex items-center gap-1 rounded-md shadow-sm"
              style={{ backgroundColor: '#E9C46A' }}
            >
              <Award className="w-3 h-3" />
              Certificate
            </span>
          </div>
        )}

        {/* Price Badge */}
        <div className="absolute bottom-3 right-3">
          <span
            className="px-2.5 py-1 text-[10px] font-bold text-white rounded-md shadow-sm"
            style={{ 
              backgroundColor: parseNumber(course.price) === 0 ? '#22c55e' : '#1E2F5E' 
            }}
          >
            {formatPrice(parseNumber(course.price))}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Category + Rating */}
        <div className="flex items-center justify-between mb-2">
          {course.category?.name && (
            <span
              className="text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-md"
              style={{ backgroundColor: 'rgba(45,106,79,0.08)', color: '#2D6A4F' }}
            >
              {course.category.name}
            </span>
          )}
          {numRating > 0 ? (
            <div className="flex items-center gap-1 ml-auto">
              <Star className="w-3.5 h-3.5 fill-current" style={{ color: '#E9C46A' }} />
              <span className="text-xs font-bold" style={{ color: '#1E2F5E' }}>
                {numRating.toFixed(1)}
              </span>
              {parseNumber(course.total_reviews) > 0 && (
                <span className="text-[10px]" style={{ color: '#717182' }}>
                  ({parseNumber(course.total_reviews).toLocaleString()})
                </span>
              )}
            </div>
          ) : (
            <span className="text-[10px] ml-auto" style={{ color: '#aaa' }}>No ratings</span>
          )}
        </div>

        {/* Title */}
        <h3
          className="text-sm font-bold leading-snug line-clamp-2 mb-1.5 transition-colors duration-200"
          style={{ color: isHovered ? levelColor : '#1E2F5E' }}
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
                className="w-5 h-5 rounded-full object-cover border border-gray-200"
              />
            ) : (
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                style={{ backgroundColor: levelColor }}
              >
                {course.instructor.first_name?.[0]}{course.instructor.last_name?.[0]}
              </div>
            )}
            <span className="text-[11px] truncate" style={{ color: '#717182' }}>
              {course.instructor.first_name} {course.instructor.last_name}
            </span>
          </div>
        )}

        {/* Description */}
        <p className="text-[11px] leading-relaxed line-clamp-2 mb-3 flex-1" style={{ color: '#717182' }}>
          {course.short_description || course.description || "No description available"}
        </p>

        {/* Stats row */}
        <div
          className="flex items-center gap-3 py-2.5 mb-3"
          style={{ borderTop: '1px solid rgba(30,47,94,0.06)', borderBottom: '1px solid rgba(30,47,94,0.06)' }}
        >
          <div className="flex items-center gap-1 text-[10px]" style={{ color: '#717182' }}>
            <Users className="w-3 h-3" style={{ color: '#74C69D' }} />
            {parseNumber(course.enrollment_count).toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-[10px]" style={{ color: '#717182' }}>
            <Clock className="w-3 h-3" style={{ color: '#74C69D' }} />
            {formatDuration(parseNumber(course.duration_minutes))}
          </div>
          <div className="flex items-center gap-1 text-[10px] ml-auto" style={{ color: '#717182' }}>
            <BookOpen className="w-3 h-3" style={{ color: '#74C69D' }} />
            {course.total_lessons || 0} lessons
          </div>
        </div>

        {/* Tags */}
        {course.tags && course.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {course.tags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="text-[10px] px-2 py-0.5 font-medium rounded-full"
                style={{
                  backgroundColor: 'rgba(45,106,79,0.06)',
                  color: '#2D6A4F',
                }}
              >
                #{tag}
              </span>
            ))}
            {course.tags.length > 3 && (
              <span className="text-[10px] px-2 py-0.5 font-medium rounded-full" style={{ backgroundColor: 'rgba(0,0,0,0.04)', color: '#717182' }}>
                +{course.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2 mt-auto" style={{ borderTop: '1px solid rgba(30,47,94,0.06)' }}>
          <button
            onClick={(e) => {
              e.stopPropagation()
              enrollmentButton.onClick()
            }}
            disabled={enrollmentButton.disabled}
            className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold px-4 py-2 transition-all duration-200 rounded-lg disabled:opacity-50"
            style={{
              backgroundColor: isHovered ? levelColor : 'transparent',
              color: isHovered ? '#fff' : levelColor,
              border: `1.5px solid ${levelColor}`,
            }}
          >
            {enrollmentButton.icon && (
              <enrollmentButton.icon className={`w-3.5 h-3.5 ${enrollingCourseId === course.id ? "animate-spin" : ""}`} />
            )}
            {enrollmentButton.text}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}

// Need to declare these outside the component for the card to access
let enrollingCourseId: string | null = null
let setEnrollingCourseIdGlobal: (id: string | null) => void = () => {}
let handleEnrollGlobal: (course: Course) => Promise<void> = async () => {}
let getEnrollmentButtonInfo: (course: Course) => any = () => ({})

export default function AllCoursesPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { user, token } = useAuth()

  const { courses, categories, isLoading } = useAppSelector((state) => state.courses)
  const { isLoading: isEnrollmentLoading } = useAppSelector((state) => state.enrollments)

  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [enrollingId, setEnrollingId] = useState<string | null>(null)
  const [accessCodeModal, setAccessCodeModal] = useState<{ open: boolean; courseId: string }>({
    open: false,
    courseId: "",
  })
  const [accessCode, setAccessCode] = useState("")
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedLevel, setSelectedLevel] = useState<string>("all")

  // Set global variables for card access
  enrollingCourseId = enrollingId
  setEnrollingCourseIdGlobal = setEnrollingId

  useEffect(() => {
    dispatch(getAllCoursesWithFullInfo({ limit: 50 }))
    dispatch(getCourseCategories({ active_only: true }))
  }, [dispatch])

  const filteredCourses = courses.filter((course) => {
    const isPublished = course.status === "PUBLISHED"
    
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (course.description || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "mooc" && course.course_type === "PUBLIC") ||
      (activeTab === "spoc" && course.course_type === "PRIVATE") ||
      (activeTab === "free" && parseNumber(course.price) === 0) ||
      (activeTab === "certificate" && course.is_certificate_available)

    const matchesLevel = selectedLevel === "all" || course.level === selectedLevel

    return isPublished && matchesSearch && matchesTab && matchesLevel
  })

  const coursesByCategory = categories.reduce((acc, category) => {
    const categoryCourses = filteredCourses.filter(
      (course) => course.category_id === category.id
    )
    if (categoryCourses.length > 0) {
      acc[category.name] = categoryCourses
    }
    return acc
  }, {} as Record<string, Course[]>)

  const uncategorizedCourses = filteredCourses.filter(
    (course) => !course.category_id || !categories.find(c => c.id === course.category_id)
  )

  const handleEnroll = async (course: Course) => {
    if (!user || !token) {
      toast.error("Please login to enroll in courses")
      router.push("/login")
      return
    }

    setEnrollingId(course.id)

    try {
      const eligibilityResult = await dispatch(
        checkEnrollmentEligibility({ course_id: course.id })
      ).unwrap()

      const eligibility = eligibilityResult.eligibility

      if (!eligibility.eligible) {
        if (eligibility.requires_access_code) {
          setAccessCodeModal({ open: true, courseId: course.id })
          return
        }
        toast.error(`Not eligible: ${eligibility.reason}`)
        return
      }

      await dispatch(
        requestEnrollmentApproval({
          course_id: course.id,
          user_id: user.id,
          access_code: eligibility.requires_access_code ? undefined : undefined,
        })
      ).unwrap()

      toast.success(
        eligibility.requires_approval
          ? "Enrollment request submitted! Awaiting instructor approval."
          : "Successfully enrolled in course!"
      )

      if (!eligibility.requires_approval) {
        router.push(`/courses/${course.id}/learn`)
      }
    } catch (error: any) {
      toast.error(error || "Failed to enroll in course")
    } finally {
      setEnrollingId(null)
    }
  }

  const handleAccessCodeSubmit = async () => {
    if (!accessCode.trim()) {
      toast.error("Please enter an access code")
      return
    }

    try {
      await dispatch(
        requestEnrollmentApproval({
          course_id: accessCodeModal.courseId,
          user_id: user?.id,
          access_code: accessCode,
        })
      ).unwrap()

      toast.success("Access code accepted! Enrollment request submitted.")
      setAccessCodeModal({ open: false, courseId: "" })
      setAccessCode("")
    } catch (error: any) {
      toast.error(error || "Invalid access code")
    }
  }

  // Define enrollment button info function
  getEnrollmentButtonInfo = (course: Course) => {
    const isEnrolled = useAppSelector(selectIsUserEnrolled(course.id))
    const userEnrollment = useAppSelector(selectUserEnrollment(course.id))

    if (isEnrolled && userEnrollment) {
      return {
        variant: "default" as const,
        text: userEnrollment.status === "PENDING" ? "Pending" : "Continue",
        icon: userEnrollment.status === "PENDING" ? Clock : Play,
        disabled: false,
        onClick: () => {
          if (userEnrollment.status === "PENDING") {
            toast.success("Your enrollment is pending instructor approval")
          } else {
            router.push(`/courses/${course.id}/learn`)
          }
        },
      }
    }

    if (enrollingId === course.id) {
      return {
        variant: "secondary" as const,
        text: "Enrolling...",
        icon: Loader2,
        disabled: true,
        onClick: () => {},
      }
    }

    return {
      variant: "default" as const,
      text: "Enroll Now",
      icon: BookOpen,
      disabled: false,
      onClick: () => handleEnroll(course),
    }
  }

  const totalEnrollments = courses
    .filter(c => c.status === "PUBLISHED")
    .reduce((sum, c) => sum + parseNumber(c.enrollment_count), 0)

  const certificateCount = courses.filter(c => c.status === "PUBLISHED" && c.is_certificate_available).length

  if (isLoading) {
    return <AllCoursesPageSkeleton />
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary/10 via-secondary/5 to-primary/5 py-8 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="p-2.5 bg-primary/10 rounded-xl">
                <Sparkles className="w-7 h-7 text-primary" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-primary">Explore Our Courses</h1>
            </div>
            <p className="text-base text-muted-foreground max-w-3xl mx-auto mb-6">
              Discover interactive courses designed to help you learn, grow, and achieve your goals
            </p>

            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search courses, topics, or instructors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-24 py-3.5 text-sm bg-white border-2 border-gray-200 rounded-xl shadow-lg focus:outline-none focus:border-primary/50 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-20 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-100"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                )}
                <Button size="sm" className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-lg h-9 px-5">
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tabs and Filters */}
        <div className="mb-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-1 h-auto p-1 bg-muted/50">
                <TabsTrigger value="all" className="flex items-center gap-2 text-xs md:text-sm py-2">
                  <BookOpen className="w-4 h-4" />
                  <span className="hidden sm:inline">All</span> ({filteredCourses.length})
                </TabsTrigger>
                <TabsTrigger value="mooc" className="flex items-center gap-2 text-xs md:text-sm py-2">
                  <Globe className="w-4 h-4" />
                  <span className="hidden sm:inline">Public</span>
                </TabsTrigger>
                <TabsTrigger value="spoc" className="flex items-center gap-2 text-xs md:text-sm py-2">
                  <Building2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Private</span>
                </TabsTrigger>
                <TabsTrigger value="free" className="flex items-center gap-2 text-xs md:text-sm py-2">
                  <Sparkles className="w-4 h-4" />
                  <span className="hidden sm:inline">Free</span>
                </TabsTrigger>
                <TabsTrigger value="certificate" className="flex items-center gap-2 text-xs md:text-sm py-2">
                  <Award className="w-4 h-4" />
                  <span className="hidden sm:inline">Certificate</span>
                </TabsTrigger>
              </TabsList>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filters
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Expandable Filters */}
            {showFilters && (
              <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 shadow-sm">
                <div className="flex flex-wrap items-center gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Level</label>
                    <select
                      value={selectedLevel}
                      onChange={(e) => setSelectedLevel(e.target.value)}
                      className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-primary/50"
                    >
                      <option value="all">All Levels</option>
                      <option value="BEGINNER">Beginner</option>
                      <option value="INTERMEDIATE">Intermediate</option>
                      <option value="ADVANCED">Advanced</option>
                      <option value="EXPERT">Expert</option>
                    </select>
                  </div>
                  {(selectedLevel !== "all" || searchQuery) && (
                    <button
                      onClick={() => {
                        setSelectedLevel("all")
                        setSearchQuery("")
                      }}
                      className="text-xs text-primary hover:underline mt-5"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
              </div>
            )}
          </Tabs>

          {/* Stats Bar */}
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-semibold text-primary">{filteredCourses.length}</span> of{" "}
              <span className="font-semibold">{courses.filter(c => c.status === "PUBLISHED").length}</span> courses
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Users className="w-3.5 h-3.5" />
                <span className="font-medium">{totalEnrollments.toLocaleString()}</span> enrollments
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Award className="w-3.5 h-3.5" />
                <span className="font-medium">{certificateCount}</span> with certificate
              </div>
            </div>
          </div>
        </div>

        {/* Courses by Category */}
        {Object.entries(coursesByCategory).length > 0 ? (
          Object.entries(coursesByCategory).map(([categoryName, categoryCourses]) => (
            <div key={categoryName} className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">{categoryName}</h2>
                <Badge variant="outline" className="text-xs">
                  {categoryCourses.length} {categoryCourses.length === 1 ? 'course' : 'courses'}
                </Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {categoryCourses.map((course) => (
                  <CleanCourseCard
                    key={course.id}
                    course={course}
                    isHovered={hoveredCardId === course.id}
                    onHover={setHoveredCardId}
                  />
                ))}
              </div>
            </div>
          ))
        ) : filteredCourses.length > 0 ? (
          <div className="mb-10">
            <h2 className="text-xl font-bold mb-4 text-gray-900">All Available Courses</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCourses.map((course) => (
                <CleanCourseCard
                  key={course.id}
                  course={course}
                  isHovered={hoveredCardId === course.id}
                  onHover={setHoveredCardId}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-muted/50 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <Search className="w-12 h-12 text-muted-foreground/50" />
            </div>
            <h3 className="text-xl font-bold mb-2">No courses found</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              Try adjusting your search or filters to find what you're looking for
            </p>
            <Button
              onClick={() => {
                setSearchQuery("")
                setActiveTab("all")
                setSelectedLevel("all")
              }}
              className="px-6"
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>

      {/* Access Code Modal */}
      {accessCodeModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold mb-2">Enter Access Code</h3>
            <p className="text-muted-foreground mb-4 text-sm">
              This course requires an access code to enroll. Please enter the code provided by your institution.
            </p>
            <input
              type="text"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              placeholder="Enter access code..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              onKeyDown={(e) => e.key === "Enter" && handleAccessCodeSubmit()}
            />
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setAccessCodeModal({ open: false, courseId: "" })
                  setAccessCode("")
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button onClick={handleAccessCodeSubmit} className="flex-1">
                Submit
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}