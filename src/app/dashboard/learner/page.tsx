"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Cookies from "js-cookie"
import {
  BookOpen,
  CheckCircle2,
  Medal,
  Clock,
  Flame,
  AlertCircle,
  ArrowRight,
  Star,
  GraduationCap,
  Sparkles,
  CalendarClock,
  MessageSquare,
  TrendingUp,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/hooks/use-auth"

interface ResumeCourse {
  course_id: string
  title: string
  thumbnail_url: string | null
  progress_percentage: number
  last_lesson_title: string | null
  course_type: "PUBLIC" | "PRIVATE"
}

interface InProgressCourse {
  enrollment_id: string
  course_id: string
  title: string
  thumbnail_url: string | null
  progress_percentage: number
  last_accessed: string | null
  total_time_spent_minutes: number
  completed_lessons: number
  course_type: "PUBLIC" | "PRIVATE"
  instructor_name: string | null
}

interface UpcomingDeadline {
  enrollment_id: string
  course_id: string
  title: string
  enrollment_end_date: string
  days_remaining: number
  progress_percentage: number
}

interface CertificateItem {
  id: string
  course_id: string
  course_title: string
  certificate_number: string
  issue_date: string
  final_score: number
}

interface RecommendedCourse {
  id: string
  title: string
  thumbnail_url: string | null
  average_rating: number
  total_reviews: number
  level: string
  duration_minutes: number
  cpd_hours: number
  instructor_name: string | null
}

interface LearnerDashboard {
  enrolled_courses_count: number
  completed_courses_count: number
  active_courses_count: number
  certificates_earned: number
  total_learning_hours: number
  current_streak_days: number
  resume_course: ResumeCourse | null
  in_progress_courses: InProgressCourse[]
  upcoming_deadlines: UpcomingDeadline[]
  recent_certificates: CertificateItem[]
  recommended_courses: RecommendedCourse[]
}

export default function LearnerDashboardPage() {
  const { user, token } = useAuth()
  const [data, setData] = useState<LearnerDashboard | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const authToken = token || Cookies.get("cpd_token")
        if (!authToken) throw new Error("Not authenticated")
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/dashboard/learner`,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          },
        )
        const json = await res.json()
        if (!res.ok || !json.success) {
          throw new Error(json.message || "Failed to load dashboard")
        }
        setData(json.data)
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard")
      } finally {
        setLoading(false)
      }
    }
    if (user) fetchData()
  }, [user, token])

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto">
      {/* Welcome strip */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-lg px-4 py-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <p className="text-sm md:text-base">
            <span className="font-semibold text-gray-900">
              Hi {user?.first_name || "Learner"}
            </span>
            <span className="text-gray-600"> — {today}</span>
          </p>
          {data && data.current_streak_days > 0 && (
            <div className="flex items-center gap-1.5 text-sm text-amber-700">
              <Flame className="h-4 w-4 fill-amber-500 text-amber-500" />
              <span className="font-medium">
                {data.current_streak_days}-day streak
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Urgent alerts */}
      {!loading && data && (
        <UrgentAlerts data={data} />
      )}

      {/* Primary stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          loading={loading}
          label="Enrolled Courses"
          value={data?.enrolled_courses_count ?? 0}
          icon={<BookOpen className="h-5 w-5 text-blue-600" />}
          iconBg="bg-blue-50"
          href="/dashboard/learner/learning/courses"
        />
        <StatCard
          loading={loading}
          label="Completed Courses"
          value={data?.completed_courses_count ?? 0}
          icon={<CheckCircle2 className="h-5 w-5 text-green-600" />}
          iconBg="bg-green-50"
          href="/dashboard/learner/learning/courses?status=COMPLETED"
        />
        <StatCard
          loading={loading}
          label="Certificates Earned"
          value={data?.certificates_earned ?? 0}
          icon={<Medal className="h-5 w-5 text-amber-600" />}
          iconBg="bg-amber-50"
          href="/dashboard/learner/certificates"
        />
        <StatCard
          loading={loading}
          label="Learning Hours"
          value={data?.total_learning_hours ?? 0}
          icon={<Clock className="h-5 w-5 text-purple-600" />}
          iconBg="bg-purple-50"
          suffix="h"
        />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* LEFT (3/5) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Resume Learning Hero */}
          <ResumeCard
            loading={loading}
            resume={data?.resume_course ?? null}
          />

          {/* In-progress courses */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base">Continue Learning</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/learner/learning/courses">
                  View all
                  <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[0, 1, 2].map((i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : data && data.in_progress_courses.length > 0 ? (
                <div className="space-y-3">
                  {data.in_progress_courses.map((c) => (
                    <InProgressRow key={c.enrollment_id} course={c} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<BookOpen className="h-10 w-10" />}
                  message="No courses in progress"
                  ctaLabel="Browse Courses"
                  ctaHref="/courses"
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT (2/5) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Streak */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Flame className="h-4 w-4 text-amber-500" />
                Learning Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-20 w-full" />
              ) : (
                <StreakDisplay days={data?.current_streak_days || 0} />
              )}
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Medal className="h-4 w-4 text-amber-600" />
                Your Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : data && data.recent_certificates.length > 0 ? (
                <div className="space-y-2">
                  {data.recent_certificates.map((cert) => (
                    <Link
                      key={cert.id}
                      href={`/certificates/${cert.id}`}
                      className="flex items-center gap-3 p-3 rounded-md border border-amber-100 bg-amber-50/60 hover:bg-amber-50 transition"
                    >
                      <div className="p-2 bg-amber-100 rounded-md">
                        <Medal className="h-4 w-4 text-amber-700" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {cert.course_title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(cert.issue_date).toLocaleDateString()}
                          {cert.final_score && (
                            <>
                              {" "}• {Number(cert.final_score).toFixed(0)}%
                            </>
                          )}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  Complete a course to earn your first certificate
                </p>
              )}
            </CardContent>
          </Card>

          {/* Recommended */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-600" />
                Recommended for You
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  {[0, 1, 2].map((i) => (
                    <Skeleton key={i} className="h-14 w-full" />
                  ))}
                </div>
              ) : data && data.recommended_courses.length > 0 ? (
                <div className="space-y-2">
                  {data.recommended_courses.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-50 transition"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {c.title}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                          <span className="flex items-center gap-0.5">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            {c.average_rating.toFixed(1)}
                          </span>
                          <span>•</span>
                          <Badge variant="outline" className="text-[10px] py-0 px-1.5 h-4">
                            {c.level}
                          </Badge>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/courses/${c.id}`}>Enroll</Link>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  No new recommendations right now
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <QuickAction
          href="/courses"
          icon={<BookOpen className="h-4 w-4" />}
          label="Browse Courses"
        />
        <QuickAction
          href="/dashboard/learner/certificates"
          icon={<Medal className="h-4 w-4" />}
          label="My Certificates"
        />
        <QuickAction
          href="/dashboard/learner/learning/courses"
          icon={<TrendingUp className="h-4 w-4" />}
          label="My Progress"
        />
        <QuickAction
          href="/dashboard/learner/messages"
          icon={<MessageSquare className="h-4 w-4" />}
          label="Messages"
        />
      </div>

      {error && (
        <div className="p-3 rounded-md border border-red-200 bg-red-50 text-sm text-red-700 flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}
    </div>
  )
}

// ──────────────────────────────────────────────────────────
// Subcomponents
// ──────────────────────────────────────────────────────────

function StatCard({
  loading,
  label,
  value,
  icon,
  iconBg,
  href,
  suffix,
}: {
  loading: boolean
  label: string
  value: number
  icon: React.ReactNode
  iconBg: string
  href?: string
  suffix?: string
}) {
  const content = (
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium">{label}</p>
            {loading ? (
              <Skeleton className="h-7 w-16 mt-1" />
            ) : (
              <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">
                {value}
                {suffix && <span className="text-base ml-0.5">{suffix}</span>}
              </p>
            )}
          </div>
          <div className={`p-2 rounded-full ${iconBg}`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    )
  }
  return content
}

function UrgentAlerts({ data }: { data: LearnerDashboard }) {
  const alerts: { label: string; count: number; color: string; href: string }[] = []
  if (data.upcoming_deadlines.length > 0) {
    alerts.push({
      label: "courses expiring soon",
      count: data.upcoming_deadlines.length,
      color: "amber",
      href: "/dashboard/learner/learning/courses",
    })
  }
  if (data.current_streak_days === 0 && data.active_courses_count > 0) {
    alerts.push({
      label: "Resume your streak today",
      count: 1,
      color: "amber",
      href: "/dashboard/learner/learning/courses",
    })
  }
  if (alerts.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2">
      {alerts.map((a, i) => (
        <Link
          key={i}
          href={a.href}
          className={`inline-flex items-center gap-2 px-3 py-2 bg-white border-l-[3px] ${
            a.color === "red"
              ? "border-red-500"
              : "border-amber-500"
          } rounded-md shadow-sm hover:shadow transition text-sm font-medium`}
        >
          <AlertCircle
            className={`h-4 w-4 ${
              a.color === "red" ? "text-red-500" : "text-amber-500"
            }`}
          />
          <span className="text-gray-900">
            {a.count > 1 ? `${a.count} ${a.label}` : a.label}
          </span>
        </Link>
      ))}
    </div>
  )
}

function ResumeCard({
  loading,
  resume,
}: {
  loading: boolean
  resume: ResumeCourse | null
}) {
  if (loading) return <Skeleton className="h-40 w-full" />
  if (!resume) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <GraduationCap className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600 mb-4">
            You haven't started a course yet. Discover what's available.
          </p>
          <Button asChild>
            <Link href="/courses">Browse Courses</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }
  return (
    <Card className="overflow-hidden">
      <div className="md:flex">
        <div className="md:w-1/3 h-40 md:h-auto bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
          {resume.thumbnail_url ? (
            <img
              src={resume.thumbnail_url}
              alt={resume.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <BookOpen className="h-16 w-16 text-white/80" />
          )}
        </div>
        <div className="flex-1 p-5">
          <div className="text-xs text-gray-500 uppercase font-semibold tracking-wide mb-1">
            Resume Learning
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            {resume.title}
          </h3>
          {resume.last_lesson_title && (
            <p className="text-sm text-gray-600 mb-3">
              Last lesson: {resume.last_lesson_title}
            </p>
          )}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1 text-xs text-gray-600">
              <span>Progress</span>
              <span className="font-semibold">
                {resume.progress_percentage}%
              </span>
            </div>
            <Progress value={resume.progress_percentage} className="h-2" />
          </div>
          <Button asChild>
            <Link href={`/courses/${resume.course_id}/learn`}>
              Continue <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  )
}

function InProgressRow({ course }: { course: InProgressCourse }) {
  return (
    <div className="flex items-center gap-3 p-3 border rounded-md hover:bg-gray-50 transition">
      <div className="w-12 h-12 rounded bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center flex-shrink-0 overflow-hidden">
        {course.thumbnail_url ? (
          <img
            src={course.thumbnail_url}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <BookOpen className="h-5 w-5 text-white" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {course.title}
        </p>
        <p className="text-xs text-gray-500">
          {course.instructor_name || "No instructor"}
          {course.last_accessed && (
            <>
              {" "}•{" "}
              {new Date(course.last_accessed).toLocaleDateString()}
            </>
          )}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <Progress value={course.progress_percentage} className="h-1.5 flex-1" />
          <span className="text-xs font-medium text-gray-700 w-8 text-right">
            {course.progress_percentage}%
          </span>
        </div>
      </div>
      <Button size="sm" variant="outline" asChild>
        <Link href={`/courses/${course.course_id}/learn`}>Continue</Link>
      </Button>
    </div>
  )
}

function StreakDisplay({ days }: { days: number }) {
  const daySlots = Array.from({ length: 7 }, (_, i) => i < days)
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Flame
          className={`h-6 w-6 ${
            days > 0 ? "fill-amber-500 text-amber-500" : "text-gray-300"
          }`}
        />
        <span className="text-2xl font-bold text-gray-900">{days}</span>
        <span className="text-sm text-gray-500">
          day{days === 1 ? "" : "s"}
        </span>
      </div>
      <div className="flex gap-1.5">
        {daySlots.map((active, i) => (
          <div
            key={i}
            className={`flex-1 aspect-square rounded-full border-2 ${
              active
                ? "bg-amber-400 border-amber-500"
                : "bg-gray-50 border-gray-200"
            }`}
            aria-label={active ? "Active day" : "Missed day"}
          />
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Keep your streak by studying at least one lesson each day.
      </p>
    </div>
  )
}

function EmptyState({
  icon,
  message,
  ctaLabel,
  ctaHref,
}: {
  icon: React.ReactNode
  message: string
  ctaLabel?: string
  ctaHref?: string
}) {
  return (
    <div className="text-center py-8">
      <div className="text-gray-300 mx-auto mb-3 inline-flex">{icon}</div>
      <p className="text-sm text-gray-600 mb-3">{message}</p>
      {ctaLabel && ctaHref && (
        <Button asChild variant="outline" size="sm">
          <Link href={ctaHref}>{ctaLabel}</Link>
        </Button>
      )}
    </div>
  )
}

function QuickAction({
  href,
  icon,
  label,
}: {
  href: string
  icon: React.ReactNode
  label: string
}) {
  return (
    <Button
      variant="outline"
      className="h-auto py-4 flex flex-col gap-2 border-gray-200 hover:border-primary hover:bg-primary/5"
      asChild
    >
      <Link href={href}>
        <div className="text-primary">{icon}</div>
        <span className="text-sm font-medium">{label}</span>
      </Link>
    </Button>
  )
}
