"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Cookies from "js-cookie"
import {
  BookOpen,
  Users,
  AlertCircle,
  Star,
  TrendingUp,
  UserCheck,
  CheckCircle2,
  Plus,
  MessageSquare,
  BarChart3,
  ClipboardCheck,
  RefreshCw,
  ArrowRight,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useAuth } from "@/hooks/use-auth"

interface CourseSummary {
  id: string
  title: string
  thumbnail_url: string | null
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED"
  course_type: "PUBLIC" | "PRIVATE"
  enrollment_count: number
  completion_rate: number
  average_rating: number
  total_reviews: number
  total_lessons: number
  created_at: string
}

interface PendingApproval {
  enrollment_id: string
  course_id: string
  course_title: string
  learner_name: string | null
  learner_email: string | null
  requested_at: string
}

interface WeeklyActivity {
  week_label: string
  enrollments: number
  completions: number
}

interface AttentionItem {
  id: string
  title: string
  reason: "low_rating" | "stale_draft"
  average_rating: number
}

interface InstructorDashboard {
  total_courses: number
  published_courses: number
  draft_courses: number
  archived_courses: number
  total_students: number
  active_students: number
  pending_approval_count: number
  pending_approval_list: PendingApproval[]
  new_enrollments_this_week: number
  average_course_rating: number
  total_reviews: number
  overall_completion_rate: number
  average_active_progress: number
  courses_summary: CourseSummary[]
  weekly_activity: WeeklyActivity[]
  top_performing_course: CourseSummary | null
  attention_needed: AttentionItem[]
}

export default function InstructorDashboardPage() {
  const { user, token } = useAuth()
  const [data, setData] = useState<InstructorDashboard | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const authToken = token || Cookies.get("cpd_token")
      if (!authToken) throw new Error("Not authenticated")
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/dashboard/instructor`,
        { headers: { Authorization: `Bearer ${authToken}` } },
      )
      const json = await res.json()
      if (!res.ok || !json.success)
        throw new Error(json.message || "Failed to load")
      setData(json.data)
    } catch (err: any) {
      setError(err.message || "Failed to load dashboard")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto">
      {/* Welcome strip */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg px-4 py-3 flex items-center justify-between flex-wrap gap-2">
        <p className="text-sm md:text-base">
          <span className="font-semibold text-gray-900">
            Welcome, {user?.first_name || "Instructor"}
          </span>
          <span className="text-gray-600"> — {today}</span>
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchData}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {/* Urgent alerts */}
      {!loading && data && <InstructorAlerts data={data} />}

      {/* Primary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          loading={loading}
          label="My Courses"
          value={data?.total_courses ?? 0}
          icon={<BookOpen className="h-5 w-5 text-blue-600" />}
          iconBg="bg-blue-50"
          sublabel={
            data
              ? `${data.published_courses} published • ${data.draft_courses} drafts`
              : undefined
          }
          href="/dashboard/instructor/courses"
        />
        <StatCard
          loading={loading}
          label="Total Students"
          value={data?.total_students ?? 0}
          icon={<Users className="h-5 w-5 text-green-600" />}
          iconBg="bg-green-50"
          sublabel={
            data ? `${data.active_students} active this week` : undefined
          }
          href="/dashboard/instructor/students"
        />
        <StatCard
          loading={loading}
          label="Pending Approvals"
          value={data?.pending_approval_count ?? 0}
          icon={<UserCheck className="h-5 w-5 text-red-600" />}
          iconBg="bg-red-50"
          urgent={(data?.pending_approval_count ?? 0) > 0}
          href="/dashboard/instructor/enrollments/pending"
        />
        <StatCard
          loading={loading}
          label="Average Rating"
          value={
            data ? Number(data.average_course_rating).toFixed(1) : "0.0"
          }
          suffix="/5"
          icon={<Star className="h-5 w-5 text-amber-600" />}
          iconBg="bg-amber-50"
          sublabel={data ? `${data.total_reviews} reviews` : undefined}
        />
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* LEFT: performance table + chart */}
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base">Course Performance</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/instructor/courses">
                  View all <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-4 space-y-2">
                  {[0, 1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : data && data.courses_summary.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead className="text-center">Students</TableHead>
                        <TableHead className="text-center">Completion</TableHead>
                        <TableHead className="text-center">Rating</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.courses_summary.slice(0, 8).map((c) => (
                        <TableRow key={c.id}>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium text-sm line-clamp-1">
                                {c.title}
                              </span>
                              <div className="flex items-center gap-2 mt-0.5">
                                <Badge
                                  variant="outline"
                                  className={`text-[10px] py-0 px-1.5 h-4 ${
                                    c.status === "PUBLISHED"
                                      ? "border-green-200 text-green-700"
                                      : c.status === "DRAFT"
                                      ? "border-amber-200 text-amber-700"
                                      : "border-gray-200 text-gray-500"
                                  }`}
                                >
                                  {c.status}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className="text-[10px] py-0 px-1.5 h-4"
                                >
                                  {c.course_type}
                                </Badge>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center text-sm">
                            {c.enrollment_count}
                          </TableCell>
                          <TableCell className="text-center text-sm">
                            {c.completion_rate}%
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="inline-flex items-center gap-0.5 text-sm">
                              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                              {Number(c.average_rating).toFixed(1)}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" variant="ghost" asChild>
                              <Link
                                href={`/dashboard/instructor/courses/${c.id}`}
                              >
                                Manage
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500 text-sm">
                  You don't have any courses yet.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Weekly activity chart */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Weekly Activity</CardTitle>
              <p className="text-xs text-gray-500">
                Enrollments and lesson completions over the last 6 weeks
              </p>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-48 w-full" />
              ) : data && data.weekly_activity.length > 0 ? (
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.weekly_activity}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#f0f0f0"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="week_label"
                        tick={{ fontSize: 11 }}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 11 }}
                        tickLine={false}
                        axisLine={false}
                        allowDecimals={false}
                      />
                      <Tooltip
                        contentStyle={{
                          fontSize: 12,
                          borderRadius: 8,
                          border: "1px solid #eee",
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      <Bar
                        dataKey="enrollments"
                        fill="#4F46E5"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="completions"
                        fill="#10B981"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-8">
                  No activity yet
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT: pending + quick stats */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-red-600" />
                Pending Approvals
                {data && data.pending_approval_count > 0 && (
                  <Badge variant="destructive" className="ml-auto">
                    {data.pending_approval_count}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  {[0, 1, 2].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : data && data.pending_approval_list.length > 0 ? (
                <div className="space-y-2">
                  {data.pending_approval_list.map((p) => (
                    <div
                      key={p.enrollment_id}
                      className="p-3 border rounded-md"
                    >
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {p.learner_name || p.learner_email}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {p.course_title}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-1">
                        {new Date(p.requested_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    asChild
                  >
                    <Link href="/dashboard/instructor/enrollments/pending">
                      Review all requests
                    </Link>
                  </Button>
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  No pending requests
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <QuickStatRow
                loading={loading}
                label="New enrollments this week"
                value={data?.new_enrollments_this_week ?? 0}
              />
              <QuickStatRow
                loading={loading}
                label="Active students this week"
                value={data?.active_students ?? 0}
              />
              <QuickStatRow
                loading={loading}
                label="Published courses"
                value={data?.published_courses ?? 0}
              />
              <QuickStatRow
                loading={loading}
                label="Overall completion"
                value={`${data?.overall_completion_rate ?? 0}%`}
              />
            </CardContent>
          </Card>

          {data?.top_performing_course && (
            <Card className="border-amber-200 bg-amber-50/40">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-amber-700" />
                  Top Performing Course
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {data.top_performing_course.title}
                </p>
                <div className="flex items-center gap-3 text-xs text-gray-600 mt-1">
                  <span>
                    {data.top_performing_course.enrollment_count} students
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-0.5">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    {Number(
                      data.top_performing_course.average_rating,
                    ).toFixed(1)}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <QuickAction
          href="/dashboard/instructor/courses/create"
          icon={<Plus className="h-4 w-4" />}
          label="Create Course"
        />
        <QuickAction
          href="/dashboard/instructor/enrollments/pending"
          icon={<ClipboardCheck className="h-4 w-4" />}
          label="Manage Enrollments"
        />
        <QuickAction
          href="/dashboard/instructor/students"
          icon={<Users className="h-4 w-4" />}
          label="All Students"
        />
        <QuickAction
          href="/dashboard/instructor/analytics"
          icon={<BarChart3 className="h-4 w-4" />}
          label="Analytics"
        />
        <QuickAction
          href="/dashboard/instructor/messages"
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

// ─────────── Subcomponents ───────────

function StatCard({
  loading,
  label,
  value,
  icon,
  iconBg,
  sublabel,
  href,
  suffix,
  urgent,
}: {
  loading: boolean
  label: string
  value: number | string
  icon: React.ReactNode
  iconBg: string
  sublabel?: string
  href?: string
  suffix?: string
  urgent?: boolean
}) {
  const content = (
    <Card
      className={`h-full hover:shadow-md transition ${
        urgent ? "border-red-300 bg-red-50/30" : ""
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <p className="text-xs text-gray-500 font-medium">{label}</p>
            {loading ? (
              <Skeleton className="h-7 w-16 mt-1" />
            ) : (
              <p
                className={`text-2xl md:text-3xl font-bold mt-1 ${
                  urgent ? "text-red-600" : "text-gray-900"
                }`}
              >
                {value}
                {suffix && <span className="text-base ml-0.5">{suffix}</span>}
              </p>
            )}
            {!loading && sublabel && (
              <p className="text-[11px] text-gray-500 mt-1 truncate">
                {sublabel}
              </p>
            )}
          </div>
          <div className={`p-2 rounded-full ${iconBg} flex-shrink-0`}>
            {icon}
          </div>
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

function InstructorAlerts({ data }: { data: InstructorDashboard }) {
  const alerts: { label: string; count: number; color: string; href: string }[] = []

  if (data.pending_approval_count > 0) {
    alerts.push({
      label: "enrollment requests waiting",
      count: data.pending_approval_count,
      color: "red",
      href: "/dashboard/instructor/enrollments/pending",
    })
  }
  const draftReady = data.courses_summary.filter(
    (c) => c.status === "DRAFT" && c.total_lessons > 0,
  ).length
  if (draftReady > 0) {
    alerts.push({
      label: "courses ready to publish",
      count: draftReady,
      color: "amber",
      href: "/dashboard/instructor/courses?status=DRAFT",
    })
  }
  const lowRated = data.attention_needed.filter(
    (a) => a.reason === "low_rating",
  ).length
  if (lowRated > 0) {
    alerts.push({
      label: "courses need attention",
      count: lowRated,
      color: "amber",
      href: "/dashboard/instructor/courses",
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
            a.color === "red" ? "border-red-500" : "border-amber-500"
          } rounded-md shadow-sm hover:shadow transition text-sm font-medium`}
        >
          <AlertCircle
            className={`h-4 w-4 ${
              a.color === "red" ? "text-red-500" : "text-amber-500"
            }`}
          />
          <span className="text-gray-900">
            {a.count} {a.label}
          </span>
          <Badge
            variant={a.color === "red" ? "destructive" : "secondary"}
            className="ml-1"
          >
            {a.count}
          </Badge>
        </Link>
      ))}
    </div>
  )
}

function QuickStatRow({
  loading,
  label,
  value,
}: {
  loading: boolean
  label: string
  value: number | string
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-600">{label}</span>
      {loading ? (
        <Skeleton className="h-5 w-10" />
      ) : (
        <span className="font-semibold text-gray-900">{value}</span>
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
