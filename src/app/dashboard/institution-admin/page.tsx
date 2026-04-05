"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Cookies from "js-cookie"
import {
  Users,
  BookOpen,
  GraduationCap,
  AlertCircle,
  RefreshCw,
  TrendingUp,
  UserPlus,
  Plus,
  ClipboardCheck,
  BarChart3,
  FolderTree,
  Building2,
  Star,
} from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
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

interface InstitutionInfo {
  id: string
  name: string
  slug: string
  logo_url: string | null
  type: string
  is_active: boolean
}

interface MembersByRole {
  ADMIN: number
  INSTRUCTOR: number
  CONTENT_CREATOR: number
  MEMBER: number
}

interface TopCourseLite {
  id: string
  title: string
  thumbnail_url: string | null
  enrollment_count: number
  average_rating: number
  completion_rate: number
}

interface CoursePerformanceRow {
  id: string
  title: string
  thumbnail_url: string | null
  course_type: "PUBLIC" | "PRIVATE"
  enrollment_count: number
  completion_rate: number
  average_rating: number
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED"
}

interface Capacity {
  current: number
  max: number
  remaining: number
}

interface GrowthPoint {
  week: string
  count: number
}

interface InstitutionAdminDashboard {
  institution: InstitutionInfo
  total_members: number
  active_learners: number
  inactive_members: number
  new_members_this_week: number
  members_by_role: MembersByRole
  total_courses: number
  published_courses: number
  draft_courses: number
  archived_courses: number
  public_courses: number
  private_courses: number
  pending_enrollment_requests: number
  active_enrollments: number
  completed_enrollments: number
  new_enrollments_this_week: number
  average_learner_progress: number
  top_course: TopCourseLite | null
  course_performance: CoursePerformanceRow[]
  instructor_capacity: Capacity
  member_capacity: Capacity
  member_growth_trend: GrowthPoint[]
}

export default function InstitutionAdminDashboardPage() {
  const { user, token } = useAuth()
  const [data, setData] = useState<InstitutionAdminDashboard | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const authToken = token || Cookies.get("cpd_token")
      if (!authToken) throw new Error("Not authenticated")
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/dashboard/institution-admin`,
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
      {/* Welcome strip + institution summary */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-lg px-4 py-3 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          {data?.institution?.logo_url ? (
            <img
              src={data.institution.logo_url}
              alt={data.institution.name}
              className="w-10 h-10 rounded-md object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-md bg-emerald-100 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-emerald-600" />
            </div>
          )}
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {data?.institution?.name || user?.first_name || "Institution"}
            </p>
            <p className="text-xs text-gray-600">{today}</p>
          </div>
        </div>
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
      {!loading && data && <InstitutionAlerts data={data} />}

      {/* Primary stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          loading={loading}
          label="Total Members"
          value={data?.total_members ?? 0}
          icon={<Users className="h-5 w-5 text-blue-600" />}
          iconBg="bg-blue-50"
          sublabel={
            data ? `+${data.new_members_this_week} this week` : undefined
          }
          href="/dashboard/institution-admin/members"
        />
        <StatCard
          loading={loading}
          label="Active Learners"
          value={data?.active_learners ?? 0}
          icon={<GraduationCap className="h-5 w-5 text-green-600" />}
          iconBg="bg-green-50"
          sublabel="Active in last 30 days"
        />
        <StatCard
          loading={loading}
          label="Pending Requests"
          value={data?.pending_enrollment_requests ?? 0}
          icon={<ClipboardCheck className="h-5 w-5 text-red-600" />}
          iconBg="bg-red-50"
          urgent={(data?.pending_enrollment_requests ?? 0) > 0}
          href="/dashboard/institution-admin/enrollment/pending"
        />
        <StatCard
          loading={loading}
          label="Published Courses"
          value={data?.published_courses ?? 0}
          icon={<BookOpen className="h-5 w-5 text-purple-600" />}
          iconBg="bg-purple-50"
          sublabel={
            data
              ? `${data.draft_courses} drafts • ${data.total_courses} total`
              : undefined
          }
          href="/dashboard/institution-admin/courses"
        />
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
                Member Growth
              </CardTitle>
              <p className="text-xs text-gray-500">
                New members added per week (last 6 weeks)
              </p>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-52 w-full" />
              ) : data && data.member_growth_trend.length > 0 ? (
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.member_growth_trend}>
                      <defs>
                        <linearGradient id="memberFill" x1="0" y1="0" x2="0" y2="1">
                          <stop
                            offset="5%"
                            stopColor="#74C69D"
                            stopOpacity={0.6}
                          />
                          <stop
                            offset="95%"
                            stopColor="#74C69D"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#f0f0f0"
                        vertical={false}
                      />
                      <XAxis dataKey="week" tick={{ fontSize: 11 }} tickLine={false} />
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
                      <Area
                        type="monotone"
                        dataKey="count"
                        stroke="#74C69D"
                        strokeWidth={2}
                        fill="url(#memberFill)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-8">
                  No growth data yet
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base">Course Performance</CardTitle>
                <p className="text-xs text-gray-500">Published courses</p>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/institution-admin/courses">
                  View all
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-4 space-y-2">
                  {[0, 1, 2].map((i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              ) : data && data.course_performance.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-center">Enrollments</TableHead>
                        <TableHead className="text-center">Completion</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.course_performance.map((c) => (
                        <TableRow key={c.id}>
                          <TableCell className="font-medium text-sm">
                            {c.title}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`text-[10px] py-0 px-1.5 h-5 ${
                                c.course_type === "PUBLIC"
                                  ? "border-blue-200 text-blue-700"
                                  : "border-purple-200 text-purple-700"
                              }`}
                            >
                              {c.course_type}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center text-sm">
                            {c.enrollment_count}
                          </TableCell>
                          <TableCell className="text-center text-sm">
                            {c.completion_rate}%
                          </TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" variant="ghost" asChild>
                              <Link
                                href={`/dashboard/institution-admin/courses/${c.id}`}
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
                <div className="py-8 text-center text-sm text-gray-500">
                  No published courses yet
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Capacity Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <>
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </>
              ) : data ? (
                <>
                  <CapacityBar
                    label="Instructors"
                    current={data.instructor_capacity.current}
                    max={data.instructor_capacity.max}
                  />
                  <CapacityBar
                    label="Members"
                    current={data.member_capacity.current}
                    max={data.member_capacity.max}
                  />
                </>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Members by Role</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {loading ? (
                [0, 1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-6 w-full" />
                ))
              ) : data ? (
                <MemberBreakdown roles={data.members_by_role} />
              ) : null}
            </CardContent>
          </Card>

          {data?.top_course && (
            <Card className="border-amber-200 bg-amber-50/40">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Star className="h-4 w-4 text-amber-600" />
                  Top Course
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {data.top_course.title}
                </p>
                <div className="flex items-center gap-3 text-xs text-gray-600 mt-1">
                  <span>{data.top_course.enrollment_count} enrollments</span>
                  <span>•</span>
                  <span className="flex items-center gap-0.5">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    {Number(data.top_course.average_rating).toFixed(1)}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Enrollment Snapshot</CardTitle>
            </CardHeader>
            <CardContent className="divide-y">
              <SnapshotRow
                loading={loading}
                label="Active"
                value={data?.active_enrollments ?? 0}
              />
              <SnapshotRow
                loading={loading}
                label="Completed"
                value={data?.completed_enrollments ?? 0}
              />
              <SnapshotRow
                loading={loading}
                label="New this week"
                value={data?.new_enrollments_this_week ?? 0}
              />
              <SnapshotRow
                loading={loading}
                label="Avg progress"
                value={`${data?.average_learner_progress ?? 0}%`}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <QuickAction
          href="/dashboard/institution-admin/members/invite"
          icon={<UserPlus className="h-4 w-4" />}
          label="Invite Members"
        />
        <QuickAction
          href="/dashboard/institution-admin/courses/create"
          icon={<Plus className="h-4 w-4" />}
          label="Create Private Course"
        />
        <QuickAction
          href="/dashboard/institution-admin/enrollment/pending"
          icon={<ClipboardCheck className="h-4 w-4" />}
          label="Enrollment Requests"
        />
        <QuickAction
          href="/dashboard/institution-admin/analytics"
          icon={<BarChart3 className="h-4 w-4" />}
          label="Member Analytics"
        />
        <QuickAction
          href="/dashboard/institution-admin/categories"
          icon={<FolderTree className="h-4 w-4" />}
          label="Course Categories"
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
  urgent,
}: {
  loading: boolean
  label: string
  value: number | string
  icon: React.ReactNode
  iconBg: string
  sublabel?: string
  href?: string
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
  if (href)
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    )
  return content
}

function InstitutionAlerts({ data }: { data: InstitutionAdminDashboard }) {
  const alerts: { label: string; count: number; color: string; href: string }[] = []
  if (data.pending_enrollment_requests > 0) {
    alerts.push({
      label: "enrollment requests",
      count: data.pending_enrollment_requests,
      color: "red",
      href: "/dashboard/institution-admin/enrollment/pending",
    })
  }
  if (
    data.instructor_capacity.max > 0 &&
    data.instructor_capacity.remaining <= 2
  ) {
    alerts.push({
      label: "Instructor slots almost full",
      count: data.instructor_capacity.remaining,
      color: "amber",
      href: "/dashboard/institution-admin/members?role=INSTRUCTOR",
    })
  }
  if (
    data.member_capacity.max > 0 &&
    data.member_capacity.remaining <= 10
  ) {
    alerts.push({
      label: "Member capacity nearly reached",
      count: data.member_capacity.remaining,
      color: "amber",
      href: "/dashboard/institution-admin/members",
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
            {a.count > 1 || a.color === "red"
              ? `${a.count} ${a.label}`
              : a.label}
          </span>
        </Link>
      ))}
    </div>
  )
}

function CapacityBar({
  label,
  current,
  max,
}: {
  label: string
  current: number
  max: number
}) {
  const pct = max > 0 ? Math.min(100, Math.round((current / max) * 100)) : 0
  const barColor =
    pct > 90 ? "bg-red-500" : pct >= 75 ? "bg-amber-500" : "bg-green-500"
  const textColor =
    pct > 90
      ? "text-red-600"
      : pct >= 75
      ? "text-amber-700"
      : "text-green-700"
  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-1">
        <span className="text-gray-700">{label}</span>
        <span className={`font-semibold ${textColor}`}>
          {current} / {max || "∞"}
        </span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} transition-all`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-[11px] text-gray-500 mt-1">
        {max > 0
          ? `${Math.max(0, max - current)} remaining`
          : "No limit set"}
      </p>
    </div>
  )
}

function MemberBreakdown({ roles }: { roles: MembersByRole }) {
  const entries = [
    { label: "Admins", value: roles.ADMIN, color: "bg-red-500" },
    { label: "Instructors", value: roles.INSTRUCTOR, color: "bg-green-500" },
    {
      label: "Content Creators",
      value: roles.CONTENT_CREATOR,
      color: "bg-purple-500",
    },
    { label: "Learners", value: roles.MEMBER, color: "bg-blue-500" },
  ]
  const max = Math.max(...entries.map((e) => e.value), 1)
  return (
    <div className="space-y-2">
      {entries.map((e) => (
        <div key={e.label}>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-gray-600">{e.label}</span>
            <span className="font-semibold text-gray-900">{e.value}</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full ${e.color}`}
              style={{ width: `${(e.value / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function SnapshotRow({
  loading,
  label,
  value,
}: {
  loading: boolean
  label: string
  value: number | string
}) {
  return (
    <div className="flex items-center justify-between py-2 text-sm">
      <span className="text-gray-600">{label}</span>
      {loading ? (
        <Skeleton className="h-5 w-12" />
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
        <span className="text-sm font-medium text-center">{label}</span>
      </Link>
    </Button>
  )
}
