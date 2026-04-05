"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Cookies from "js-cookie"
import {
  Users,
  Building2,
  BookOpen,
  UserPlus,
  AlertCircle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  FileCheck,
  TrendingUp,
  ShieldCheck,
  Activity,
} from "lucide-react"
import {
  LineChart,
  Line,
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useAuth } from "@/hooks/use-auth"

interface RolesMap {
  LEARNER: number
  INSTRUCTOR: number
  CONTENT_CREATOR: number
  INSTITUTION_ADMIN: number
  SYSTEM_ADMIN: number
}

interface TopInstitution {
  id: string
  name: string
  logo_url: string | null
  member_count: number
  course_count: number
}

interface PendingApplicant {
  id: string
  name: string
  email: string
  applied_at: string | null
  health_specialist: string | null
  account_type?: string | null
}

interface TrendPoint {
  week: string
  count: number
}

interface SystemAdminDashboard {
  pending_applications_count: number
  approved_applications_count: number
  rejected_applications_count: number
  moderation_queue_count: number
  pending_enrollments_count: number
  total_users: number
  total_institutions: number
  total_active_institutions: number
  total_courses: number
  total_published_courses: number
  users_by_role: RolesMap
  new_users_last_7_days: number
  new_enrollments_last_7_days: number
  user_registration_trend: TrendPoint[]
  enrollment_trend: TrendPoint[]
  top_institutions: TopInstitution[]
  latest_pending_applicant: PendingApplicant | null
  recent_pending_applications: PendingApplicant[]
}

export default function SystemAdminDashboardPage() {
  const { user, token } = useAuth()
  const [data, setData] = useState<SystemAdminDashboard | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const authToken = token || Cookies.get("cpd_token")
      if (!authToken) throw new Error("Not authenticated")
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/dashboard/system-admin`,
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
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-lg px-4 py-3 flex items-center justify-between flex-wrap gap-2">
        <p className="text-sm md:text-base">
          <span className="font-semibold text-gray-900">
            Welcome, {user?.first_name || "Admin"}
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
      {!loading && data && <SystemAlerts data={data} />}

      {/* Primary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          loading={loading}
          label="Pending Applications"
          value={data?.pending_applications_count ?? 0}
          icon={<UserPlus className="h-5 w-5 text-red-600" />}
          iconBg="bg-red-50"
          urgent={(data?.pending_applications_count ?? 0) > 0}
          href="/dashboard/system-admin/applications"
        />
        <StatCard
          loading={loading}
          label="Total Users"
          value={data?.total_users ?? 0}
          icon={<Users className="h-5 w-5 text-blue-600" />}
          iconBg="bg-blue-50"
          sublabel={
            data
              ? `+${data.new_users_last_7_days} new in 7d`
              : undefined
          }
          href="/dashboard/system-admin/users"
        />
        <StatCard
          loading={loading}
          label="Active Institutions"
          value={data?.total_active_institutions ?? 0}
          icon={<Building2 className="h-5 w-5 text-green-600" />}
          iconBg="bg-green-50"
          sublabel={
            data ? `${data.total_institutions} total` : undefined
          }
          href="/dashboard/system-admin/institutions"
        />
        <StatCard
          loading={loading}
          label="Moderation Queue"
          value={data?.moderation_queue_count ?? 0}
          icon={<FileCheck className="h-5 w-5 text-amber-600" />}
          iconBg="bg-amber-50"
          urgent={(data?.moderation_queue_count ?? 0) > 0}
          urgentColor="amber"
          href="/dashboard/system-admin/courses?status=DRAFT"
        />
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* LEFT: trend tabs + applications table */}
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Platform Trends</CardTitle>
              <p className="text-xs text-gray-500">Last 8 weeks</p>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-56 w-full" />
              ) : data ? (
                <Tabs defaultValue="users">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="users">User Growth</TabsTrigger>
                    <TabsTrigger value="enrollments">
                      Enrollment Trend
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="users">
                    <TrendChart
                      data={data.user_registration_trend}
                      color="#4F46E5"
                    />
                  </TabsContent>
                  <TabsContent value="enrollments">
                    <TrendChart
                      data={data.enrollment_trend}
                      color="#10B981"
                    />
                  </TabsContent>
                </Tabs>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base">
                  Recent Applications
                </CardTitle>
                <p className="text-xs text-gray-500">
                  Users awaiting approval
                </p>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/system-admin/applications">
                  Review all
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
              ) : data && data.recent_pending_applications.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Specialist</TableHead>
                        <TableHead>Applied</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.recent_pending_applications.map((a) => (
                        <TableRow key={a.id}>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium text-sm">
                                {a.name}
                              </span>
                              <span className="text-xs text-gray-500">
                                {a.email}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {a.health_specialist || "—"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs text-gray-500">
                            {a.applied_at
                              ? new Date(a.applied_at).toLocaleDateString()
                              : "—"}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" variant="outline" asChild>
                              <Link
                                href={`/dashboard/system-admin/applications?user=${a.id}`}
                              >
                                Review
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
                  No pending applications
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Platform Snapshot</CardTitle>
            </CardHeader>
            <CardContent className="space-y-0 divide-y">
              <SnapshotRow
                loading={loading}
                label="Total Courses"
                value={data?.total_courses ?? 0}
              />
              <SnapshotRow
                loading={loading}
                label="Published Courses"
                value={data?.total_published_courses ?? 0}
              />
              <SnapshotRow
                loading={loading}
                label="Total Institutions"
                value={data?.total_institutions ?? 0}
              />
              <SnapshotRow
                loading={loading}
                label="Pending Enrollments"
                value={data?.pending_enrollments_count ?? 0}
              />
              <SnapshotRow
                loading={loading}
                label="New enrollments (7d)"
                value={data?.new_enrollments_last_7_days ?? 0}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Users by Role</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {loading ? (
                [0, 1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-6 w-full" />
                ))
              ) : data ? (
                <RoleBreakdown roles={data.users_by_role} />
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Top Institutions</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  {[0, 1, 2].map((i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              ) : data && data.top_institutions.length > 0 ? (
                <div className="space-y-2">
                  {data.top_institutions.map((inst, idx) => (
                    <Link
                      key={inst.id}
                      href={`/dashboard/system-admin/institutions/${inst.id}`}
                      className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 transition"
                    >
                      <span className="w-5 text-center text-xs font-semibold text-gray-400">
                        {idx + 1}
                      </span>
                      <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {inst.logo_url ? (
                          <img
                            src={inst.logo_url}
                            alt={inst.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Building2 className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {inst.name}
                        </p>
                        <p className="text-[11px] text-gray-500">
                          {inst.member_count} members • {inst.course_count}{" "}
                          courses
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  No institutions yet
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <QuickAction
          href="/dashboard/system-admin/applications"
          icon={<UserPlus className="h-4 w-4" />}
          label="Review Applications"
        />
        <QuickAction
          href="/dashboard/system-admin/institutions"
          icon={<Building2 className="h-4 w-4" />}
          label="Manage Institutions"
        />
        <QuickAction
          href="/dashboard/system-admin/courses?status=DRAFT"
          icon={<FileCheck className="h-4 w-4" />}
          label="Course Moderation"
        />
        <QuickAction
          href="/dashboard/system-admin/users"
          icon={<Users className="h-4 w-4" />}
          label="All Users"
        />
        <QuickAction
          href="/dashboard/system-admin/institutions/create"
          icon={<ShieldCheck className="h-4 w-4" />}
          label="Create Institution"
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
  urgentColor = "red",
}: {
  loading: boolean
  label: string
  value: number | string
  icon: React.ReactNode
  iconBg: string
  sublabel?: string
  href?: string
  urgent?: boolean
  urgentColor?: "red" | "amber"
}) {
  const urgentClass = urgent
    ? urgentColor === "red"
      ? "border-red-300 bg-red-50/30"
      : "border-amber-300 bg-amber-50/30"
    : ""
  const valueClass = urgent
    ? urgentColor === "red"
      ? "text-red-600"
      : "text-amber-700"
    : "text-gray-900"

  const content = (
    <Card className={`h-full hover:shadow-md transition ${urgentClass}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <p className="text-xs text-gray-500 font-medium">{label}</p>
            {loading ? (
              <Skeleton className="h-7 w-16 mt-1" />
            ) : (
              <p className={`text-2xl md:text-3xl font-bold mt-1 ${valueClass}`}>
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

function SystemAlerts({ data }: { data: SystemAdminDashboard }) {
  const alerts: { label: string; count: number; color: string; href: string }[] = []
  if (data.pending_applications_count > 0) {
    alerts.push({
      label: "applications awaiting review",
      count: data.pending_applications_count,
      color: "red",
      href: "/dashboard/system-admin/applications",
    })
  }
  if (data.moderation_queue_count > 0) {
    alerts.push({
      label: "courses awaiting moderation",
      count: data.moderation_queue_count,
      color: "amber",
      href: "/dashboard/system-admin/courses?status=DRAFT",
    })
  }
  if (data.pending_enrollments_count > 0) {
    alerts.push({
      label: "enrollment requests",
      count: data.pending_enrollments_count,
      color: "amber",
      href: "/dashboard/system-admin/enrollment-requests",
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

function TrendChart({
  data,
  color,
}: {
  data: TrendPoint[]
  color: string
}) {
  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
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
          <Line
            type="monotone"
            dataKey="count"
            stroke={color}
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
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

function RoleBreakdown({ roles }: { roles: RolesMap }) {
  const entries = [
    { label: "Learners", value: roles.LEARNER, color: "bg-blue-500" },
    { label: "Instructors", value: roles.INSTRUCTOR, color: "bg-green-500" },
    {
      label: "Content Creators",
      value: roles.CONTENT_CREATOR,
      color: "bg-purple-500",
    },
    {
      label: "Institution Admins",
      value: roles.INSTITUTION_ADMIN,
      color: "bg-amber-500",
    },
    {
      label: "System Admins",
      value: roles.SYSTEM_ADMIN,
      color: "bg-red-500",
    },
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
