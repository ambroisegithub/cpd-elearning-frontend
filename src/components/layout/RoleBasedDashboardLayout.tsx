"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { logoutCPD, validateProtectionStatus, manualSyncCrossSystemData } from "@/lib/features/auth/auth-slice"
import {
  Building2,
  Users,
  BookOpen,
  GraduationCap,
  Settings,
  FileText,
  BarChart3,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Home,
  Shield,
  UserPlus,
  Download,
  Upload,
  Key,
  Layers,
  Target,
  Award,
  MessageSquare,
  Folder,
  FileQuestion,
  Calendar,
  TrendingUp,
  CreditCard,
  CheckCircle,
  AlertCircle,
  PlusCircle,
  Search,
  Edit,
  Trash2,
  Copy,
  Users2,
  Bookmark,
  Star,
  Clock,
  Zap,
  Globe,
  Lock,
  Unlock,
  Settings2,
  UserCog,
  UploadCloud,
  DownloadCloud,
  BookCheck,
  BookX,
  Activity,
  PieChart,
  LineChart,
  BarChart,
  HelpCircle,
  Cog,
  Boxes,
  Wallet,
  Sparkles,
  Server,
  BanknoteIcon,
  Cpu,
  Network,
  Database,
  ClipboardList,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import Cookies from "js-cookie"

// ==================== ENUMS ====================
export enum CPDRole {
  SYSTEM_ADMIN = "SYSTEM_ADMIN",
  INSTITUTION_ADMIN = "INSTITUTION_ADMIN",
  CONTENT_CREATOR = "CONTENT_CREATOR",
  INSTRUCTOR = "INSTRUCTOR",
  LEARNER = "LEARNER",
}

export enum SystemType {
  CPD_ELEARNING = "CPD_ELEARNING",
  ONGERA = "ONGERA",
}

// ==================== STORAGE HELPERS ====================
const safeGetLocalStorage = (key: string, defaultValue: string = ""): string => {
  if (typeof window === 'undefined') return defaultValue
  try {
    return localStorage.getItem(key) || defaultValue
  } catch {
    return defaultValue
  }
}

const safeGetLocalStorageJSON = <T,>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : defaultValue
  } catch {
    return defaultValue
  }
}

const safeSetLocalStorage = (key: string, value: string): void => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, value)
  } catch (error) {}
}

const safeSetLocalStorageJSON = (key: string, value: unknown): void => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {}
}

// ==================== USER VALIDATION ====================
const validateUserFromAllSources = () => {
  let cookieUser = null
  const userCookie = Cookies.get("cpd_user")
  if (userCookie) {
    try { cookieUser = JSON.parse(userCookie) } catch (e) {}
  }

  let localStorageUser = null
  const localUserStr = safeGetLocalStorage("cpd_user")
  if (localUserStr) {
    try { localStorageUser = JSON.parse(localUserStr) } catch (e) {}
  }

  const crossSystemContext = safeGetLocalStorageJSON("cross_system_context", null)

  return { cookieUser, localStorageUser, crossSystemContext }
}

interface UserLike {
  cpd_role?: string
}

interface CrossSystemContext {
  cpd_role?: string
  primary_institution_id?: string
  institution_ids?: string[]
  institution_role?: string
  system?: string
}

const determineActualRole = (reduxUser: unknown, cookieUser: unknown, localStorageUser: unknown): string => {
  if (reduxUser && typeof reduxUser === 'object' && 'cpd_role' in reduxUser) {
    const role = (reduxUser as UserLike).cpd_role
    if (role) return role
  }
  if (cookieUser && typeof cookieUser === 'object' && 'cpd_role' in cookieUser) {
    const role = (cookieUser as UserLike).cpd_role
    if (role) return role
  }
  if (localStorageUser && typeof localStorageUser === 'object' && 'cpd_role' in localStorageUser) {
    const role = (localStorageUser as UserLike).cpd_role
    if (role) return role
  }
  const crossSystemContext = safeGetLocalStorageJSON<CrossSystemContext | null>("cross_system_context", null)
  if (crossSystemContext?.cpd_role) return crossSystemContext.cpd_role
  return "LEARNER"
}

// ==================== SIDEBAR CONFIGURATION ====================
const getSidebarConfig = (role: string, institutionId?: string, user?: { primary_institution_id?: string }) => {
  const baseItems = {
    INSTITUTION_ADMIN: [
      { title: "Dashboard", href: "/dashboard/institution-admin", icon: Home, exact: true },
      {
        title: "Institution Management", icon: Building2,
        subItems: [
          { title: "Institution Profile", href: `/dashboard/institution-admin/institution/profile?institution=${user?.primary_institution_id || institutionId}`, icon: Building2 },
          { title: "Settings", href: `/dashboard/institution-admin/institution/settings?institution=${user?.primary_institution_id || institutionId}`, icon: Settings }
        ]
      },
      {
        title: "User Management", icon: Users,
        subItems: [
          { title: "All Members", href: "/dashboard/institution-admin/users/members", icon: Users },
          { title: "Instructors", href: "/dashboard/institution-admin/users/instructors", icon: UserCog, action: "invite_instructor" },
          { title: "Students", href: "/dashboard/institution-admin/users/students", icon: GraduationCap },
          { title: "Invite Users", href: "/dashboard/institution-admin/users/invite", icon: UserPlus, action: "invite_users" }
        ]
      },
      {
        title: "Course Management", icon: BookOpen,
        subItems: [
          { title: "Create Course", href: `/dashboard/institution-admin/${user?.primary_institution_id || institutionId}/courses/create`, icon: PlusCircle, action: "create_private_course" },
          { title: "All Courses", href: `/dashboard/institution-admin/${user?.primary_institution_id || institutionId}/courses`, icon: BookOpen },
          { title: "Course Categories", href: `/dashboard/institution-admin/${user?.primary_institution_id || institutionId}/courses/categories`, icon: Layers },
          { title: "Assign Instructors", href: `/dashboard/institution-admin/${user?.primary_institution_id || institutionId}/courses/assign-instructors`, icon: UserCog, action: "assign_instructors" },
          { title: "Course Analytics", href: `/dashboard/institution-admin/${user?.primary_institution_id || institutionId}/courses/analytics`, icon: BarChart3 },
        ]
      },
      {
        title: "Enrollment Management", icon: Users,
        subItems: [
          { title: "Enrollment Requests", href: "/dashboard/institution-admin/enrollment/requests", icon: Clock, badge: "pending" },
          { title: "Bulk Enrollment", href: "/dashboard/institution-admin/enrollment/bulk", icon: Upload, action: "bulk_enroll" },
          { title: "Enrollment Analytics", href: "/dashboard/institution-admin/enrollment/analytics", icon: TrendingUp },
          { title: "Export Enrollment", href: "/dashboard/institution-admin/enrollment/export", icon: Download },
        ]
      },
      { title: "Messages", icon: MessageSquare, href: "/dashboard/institution-admin/messages" },
      {
        title: "Student Management", icon: GraduationCap,
        subItems: [
          { title: "My Students", href: "/dashboard/institution-admin/students", icon: Users },
          { title: "Grading Assessment", href: "/dashboard/institution-admin/assessments", icon: CheckCircle, action: "grade_assignments" }
        ]
      },
      {
        title: "Reports & Analytics", icon: BarChart3,
        subItems: [
          { title: "Platform Usage", href: "/dashboard/institution-admin/reports/usage", icon: Activity },
          { title: "Course Performance", href: "/dashboard/institution-admin/reports/course-performance", icon: TrendingUp }
        ]
      }
    ],
    CONTENT_CREATOR: [
      { title: "Dashboard", href: "/dashboard/content-creator", icon: Home, exact: true },
      {
        title: "My Courses", icon: BookOpen,
        subItems: [
          { title: "All Courses", href: "/dashboard/content-creator/courses", icon: BookOpen },
          { title: "Create Course", href: "/dashboard/content-creator/courses/create", icon: PlusCircle, action: "create_private_course" },
          { title: "Drafts", href: "/dashboard/content-creator/courses/drafts", icon: FileText },
          { title: "Published", href: "/dashboard/content-creator/courses/published", icon: BookCheck },
          { title: "Archived", href: "/dashboard/content-creator/courses/archived", icon: BookX },
        ]
      },
      {
        title: "Course Builder", icon: Edit,
        subItems: [
          { title: "Modules & Lessons", href: "/dashboard/content-creator/builder/modules", icon: Layers },
          { title: "Content Library", href: "/dashboard/content-creator/builder/content", icon: Folder },
          { title: "Assessments", href: "/dashboard/content-creator/builder/assessments", icon: FileQuestion },
          { title: "Certificates", href: "/dashboard/content-creator/builder/certificates", icon: Award },
          { title: "Course Settings", href: "/dashboard/content-creator/builder/settings", icon: Settings },
        ]
      },
      {
        title: "Instructor Management", icon: Users,
        subItems: [
          { title: "Co-Instructors", href: "/dashboard/content-creator/instructors", icon: UserCog, action: "invite_co_instructor" },
          { title: "Teaching Assistants", href: "/dashboard/content-creator/instructors/tas", icon: Users2 },
          { title: "Permissions", href: "/dashboard/content-creator/instructors/permissions", icon: Shield },
        ]
      },
      {
        title: "Student Management", icon: GraduationCap,
        subItems: [
          { title: "Enrolled Students", href: "/dashboard/content-creator/students", icon: Users },
          { title: "Grading Assessments", href: "/dashboard/content-creator/students/grading", icon: CheckCircle },
          { title: "Feedback", href: "/dashboard/content-creator/students/feedback", icon: MessageSquare },
          { title: "Progress Tracking", href: "/dashboard/content-creator/students/progress", icon: TrendingUp },
          { title: "Certificate Issuance", href: "/dashboard/content-creator/students/certificates", icon: Award, action: "issue_certificates" },
        ]
      },
      {
        title: "Analytics", icon: BarChart3,
        subItems: [
          { title: "Course Analytics", href: "/dashboard/content-creator/analytics/course", icon: PieChart },
          { title: "Student Analytics", href: "/dashboard/content-creator/analytics/students", icon: LineChart },
          { title: "Engagement", href: "/dashboard/content-creator/analytics/engagement", icon: Activity },
          { title: "Completion Rates", href: "/dashboard/content-creator/analytics/completion", icon: BarChart },
        ]
      }
    ],
    INSTRUCTOR: [
      { title: "Dashboard", href: "/dashboard/instructor", icon: Home, exact: true },
      {
        title: "My Courses", icon: BookOpen,
        subItems: [
          { title: "Assigned Courses", href: "/dashboard/instructor/courses", icon: BookOpen },
          { title: "Create Course", href: "/dashboard/instructor/courses/create", icon: PlusCircle },
          { title: "Teaching Schedule", href: "/dashboard/instructor/courses/schedule", icon: Calendar },
          { title: "Course Materials", href: "/dashboard/instructor/courses/materials", icon: Folder },
        ]
      },
      {
        title: "Student Management", icon: GraduationCap,
        subItems: [
          { title: "My Students", href: "/dashboard/instructor/students", icon: Users },
          { title: "Grading Assessment", href: "/dashboard/instructor/assessments", icon: CheckCircle, action: "grade_assignments" }
        ]
      },
      { title: "Messages", href: "/dashboard/instructor/messages", icon: MessageSquare, action: "provide_feedback" },
      { title: "Analytics", icon: BarChart3, href: "/dashboard/instructor/analytics" },
    ],
    LEARNER: [
      { title: "Dashboard", href: "/dashboard/learner", icon: Home, exact: true },
      {
        title: "My Learning", icon: BookOpen,
        subItems: [
          { title: "My Courses", href: "/dashboard/learner/learning/courses", icon: BookOpen },
          { title: "All Courses", href: "/dashboard/learner/browse/all", icon: Globe },
          { title: "Progress", href: "/dashboard/learner/learning/progress", icon: TrendingUp },
          { title: "Completed", href: "/dashboard/learner/learning/completed", icon: CheckCircle },
          { title: "Saved Courses", href: "/dashboard/learner/learning/saved", icon: Bookmark }
        ]
      },
      {
        title: "Assignments", icon: FileText,
        subItems: [
          { title: "Pending", href: "/dashboard/learner/assignments/pending", icon: Clock, badge: "due" },
          { title: "Submitted", href: "/dashboard/learner/assignments/submitted", icon: UploadCloud },
          { title: "Graded", href: "/dashboard/learner/assignments/graded", icon: CheckCircle },
          { title: "Grades", href: "/dashboard/learner/assignments/grades", icon: Award },
        ]
      },
      { title: "Certificates", icon: Award, href: "/dashboard/learner/certificates" },
      { title: "Messages", icon: MessageSquare, href: "/dashboard/learner/messages" },
      { title: "Profile", icon: User, href: "/dashboard/learner/profile" }
    ]
  };

  if (role === "SYSTEM_ADMIN") {
    return [
      { title: "Dashboard", href: "/dashboard/system-admin", icon: Home, exact: true },
      {
        title: "Institution Management", icon: Building2,
        subItems: [
          { title: "All Institutions", href: "/dashboard/system-admin/institutions", icon: Building2 },
          { title: "Create Institution", href: "/dashboard/system-admin/institutions/create", icon: UserPlus },
          { title: "Institution Analytics", href: "/dashboard/system-admin/institutions/analytics", icon: TrendingUp }
        ]
      },
      {
        title: "User Management", icon: Users,
        subItems: [
          { title: "All Users", href: "/dashboard/system-admin/users", icon: Users },
          { title: "Applications", href: "/dashboard/system-admin/applications", icon: ClipboardList },
          { title: "Manage Roles", href: "/dashboard/system-admin/users/roles", icon: UserCog },
          { title: "Institution Admins", href: "/dashboard/system-admin/users/institution-admins", icon: Shield },
          { title: "User Analytics", href: "/dashboard/system-admin/users/analytics", icon: BarChart3 },
        ]
      },

      
{
  title: "Publications",
  icon: FileText,
  subItems: [
    { title: "Articles", href: "/dashboard/system-admin/publications/articles", icon: FileText },
    { title: "Protocols", href: "/dashboard/system-admin/publications/protocols", icon: ClipboardList },
    { title: "Guidelines", href: "/dashboard/system-admin/publications/guidelines", icon: BookOpen },
  ]
},
      {
        title: "Course Management", icon: BookOpen,
        subItems: [
          { title: "Create Course", href: "/dashboard/system-admin/courses/create", icon: PlusCircle, action: "create_private_course" },
          { title: "All Courses", href: "/dashboard/system-admin/courses", icon: BookOpen },
          { title: "Enrollment Requests", href: "/dashboard/system-admin/enrollment-requests", icon: Clock },
          { title: "Public Courses Overview", href: "/dashboard/system-admin/courses/public", icon: Globe },
          { title: "Private Courses Overview", href: "/dashboard/system-admin/courses/private", icon: Lock },
          { title: "Course Reports", href: "/dashboard/system-admin/courses/reports", icon: FileText },
          { title: "Content Moderation", href: "/dashboard/system-admin/courses/moderation", icon: Shield, badge: 12 },
        ]
      },

      {
        title: "Security & Monitoring", icon: Shield,
        subItems: [
          { title: "Audit Logs", href: "/dashboard/system-admin/security/audit", icon: FileText },
          { title: "Access Control", href: "/dashboard/system-admin/security/access", icon: Lock },
          { title: "System Health", href: "/dashboard/system-admin/security/health", icon: Activity }
        ]
      },
      

      
      { title: "Assign Course", icon: BookOpen, href: "/dashboard/system-admin/courses/assign-public" },
      {
        title: "Student Management", icon: GraduationCap,
        subItems: [
          { title: "My Students", href: "/dashboard/system-admin/students", icon: Users },
          { title: "Grading Assessment", href: "/dashboard/system-admin/assessments", icon: CheckCircle, action: "grade_assignments" }
        ]
      },
      { title: "Messages", icon: MessageSquare, href: "/dashboard/system-admin/messages" },

    ]
  }

  return baseItems[role as keyof typeof baseItems] || baseItems.LEARNER;
};

// ==================== ROLE DISPLAY INFO ====================
const getRoleDisplayInfo = (role: string) => {
  switch (role) {
    case 'SYSTEM_ADMIN':
      return { label: 'System Administrator', shortLabel: 'SYSTEM ADMIN', color: 'from-[#2D6A4F] to-[#74C69D]', accentColor: '#2D6A4F', icon: Shield }
    case 'INSTITUTION_ADMIN':
      return { label: 'Institution Administrator', shortLabel: 'INSTITUTION ADMIN', color: 'from-[#2D6A4F] to-[#74C69D]', accentColor: '#2D6A4F', icon: Building2 }
    case 'INSTRUCTOR':
      return { label: 'Instructor', shortLabel: 'INSTRUCTOR', color: 'from-[#74C69D] to-[#2D6A4F]', accentColor: '#74C69D', icon: GraduationCap }
    case 'CONTENT_CREATOR':
      return { label: 'Content Creator', shortLabel: 'CONTENT CREATOR', color: 'from-[#74C69D] to-[#2D6A4F]', accentColor: '#74C69D', icon: Edit }
    case 'LEARNER':
      return { label: 'Learner', shortLabel: 'LEARNER', color: 'from-[#E76F51] to-[#2D6A4F]', accentColor: '#E76F51', icon: User }
    default:
      return { label: 'User', shortLabel: 'USER', color: 'from-[#2D6A4F] to-[#74C69D]', accentColor: '#2D6A4F', icon: User }
  }
}

// ==================== SECTION GROUPS FOR SIDEBAR ====================
const getSectionGroups = (role: string) => {
  if (role === 'SYSTEM_ADMIN') {
    return {
      "MANAGEMENT": ["Dashboard", "Institution Management", "User Management"],
      "CONTENT": ["Course Management", "Assign Course"],
      "SECURITY": ["Security & Monitoring"],
      "ACCOUNT": ["Student Management", "Messages"],
    }
  }
  if (role === 'INSTITUTION_ADMIN') {
    return {
      "OVERVIEW": ["Dashboard"],
      "MANAGEMENT": ["Institution Management", "User Management", "Course Management", "Enrollment Management"],
      "REPORTING": ["Reports & Analytics"],
      "ACCOUNT": ["Messages", "Student Management"],
    }
  }
  if (role === 'CONTENT_CREATOR') {
    return {
      "OVERVIEW": ["Dashboard"],
      "CONTENT": ["My Courses", "Course Builder"],
      "MANAGEMENT": ["Instructor Management", "Student Management"],
      "REPORTING": ["Analytics"],
    }
  }
  if (role === 'INSTRUCTOR') {
    return {
      "OVERVIEW": ["Dashboard"],
      "TEACHING": ["My Courses", "Student Management"],
      "ACCOUNT": ["Messages", "Analytics"],
    }
  }
  // LEARNER
  return {
    "OVERVIEW": ["Dashboard"],
    "LEARNING": ["My Learning", "Assignments"],
    "ACCOUNT": ["Certificates", "Messages", "Profile"],
  }
}

// ==================== CONSISTENT DROPDOWN MENU COMPONENT ====================
interface ConsistentDropdownMenuProps {
  user: any
  roleInfo: any
  actualRole: string
  handleLogout: (logoutAllSystems: boolean) => void
  trigger: React.ReactNode
  align?: "start" | "center" | "end"
  side?: "top" | "bottom" | "left" | "right"
}

const ConsistentDropdownMenu = ({ user, roleInfo, actualRole, handleLogout, trigger, align = "end", side = "bottom" }: ConsistentDropdownMenuProps) => {
  const displayName = user?.username || user?.email?.split('@')[0] || 'User'

  const menuItemClass = cn(
    "cursor-pointer transition-colors duration-150",
    "flex items-center gap-3 px-3 py-2.5 text-sm",
    "hover:bg-gradient-to-r hover:from-primary/10 hover:to-transparent",
    "rounded-lg mx-1 my-0.5"
  )

  const menuItemIconClass = "h-4 w-4 text-muted-foreground transition-colors duration-150 group-hover:text-primary"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={cn(
          "w-64 rounded-xl border border-[#2D6A4F]/10 shadow-xl",
          "bg-white/95 backdrop-blur-sm",
          "animate-in fade-in-0 zoom-in-95"
        )}
        align={align}
        side={side}
        forceMount
      >
        {/* User Info Header */}
        <div className="px-3 pt-3 pb-2 border-b border-[#2D6A4F]/10">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 ring-2 ring-primary/20 shadow-md">
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-semibold text-sm">
                {displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold text-foreground text-sm line-clamp-1">
                {displayName}
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                {roleInfo.label}
              </span>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="py-2">
          <DropdownMenuItem asChild className={menuItemClass}>
            <Link href={`/dashboard/${actualRole.toLowerCase().replace('_', '-')}/profile`}>
              <User className={menuItemIconClass} />
              <span className="flex-1 font-medium">Profile</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild className={menuItemClass}>
            <Link href={`/dashboard/${actualRole.toLowerCase().replace('_', '-')}/settings`}>
              <Settings className={menuItemIconClass} />
              <span className="flex-1 font-medium">Settings</span>
            </Link>
          </DropdownMenuItem>

          {actualRole === 'INSTITUTION_ADMIN' && user?.primary_institution_id && (
            <>
              <DropdownMenuSeparator className="my-1 bg-[#2D6A4F]/10" />
              <DropdownMenuItem asChild className={menuItemClass}>
                <Link href={`/dashboard/institution-admin/institution/profile?institution=${user.primary_institution_id}`}>
                  <Building2 className={menuItemIconClass} />
                  <span className="flex-1 font-medium">Institution Profile</span>
                </Link>
              </DropdownMenuItem>
            </>
          )}
        </div>

        <DropdownMenuSeparator className="bg-[#2D6A4F]/10" />

        <div className="py-1 pb-2">
          <LogoutDialog
            roleInfo={roleInfo}
            handleLogout={handleLogout}
            trigger={
              <div className={cn(menuItemClass, "text-[#E76F51] hover:bg-[#E76F51]/10 hover:text-[#E76F51]")}>
                <LogOut className="h-4 w-4" />
                <span className="flex-1 font-medium">Log out</span>
              </div>
            }
          />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ==================== LOGOUT DIALOG (Reusable) ====================
interface LogoutDialogProps {
  roleInfo: { label: string; icon: React.ComponentType<{ className?: string }> }
  handleLogout: (logoutAllSystems: boolean) => void
  trigger: React.ReactNode
}

const LogoutDialog = ({ roleInfo, handleLogout, trigger }: LogoutDialogProps) => {
  const RoleIcon = roleInfo.icon
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent className="bg-white border border-[#2D6A4F]/10 shadow-2xl rounded-xl">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#E76F51] to-[#E76F51]/80 rounded-full flex items-center justify-center shadow-lg">
              <LogOut className="h-6 w-6 text-white" />
            </div>
            <div>
              <AlertDialogTitle className="text-xl font-bold text-foreground">Confirm Logout</AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground">
                You are about to sign out from CPD eLearning
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>
        <div className="mb-6 p-4 bg-gradient-to-r from-[#E76F51]/10 to-[#E76F51]/5 border border-[#E76F51]/20 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-[#E76F51]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <RoleIcon className="h-3 w-3 text-[#E76F51]" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#E76F51] mb-1">
                {roleInfo.label} Session
              </p>
              <p className="text-sm text-[#717182]">
                You are currently logged in as a <span className="font-semibold">{roleInfo.label}</span>.
                Make sure to save any unsaved work before logging out.
              </p>
            </div>
          </div>
        </div>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel className="w-full sm:w-auto border border-[#2D6A4F]/10 hover:bg-[#2D6A4F]/5 rounded-lg transition-colors duration-150">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => handleLogout(false)}
            className="w-full sm:w-auto bg-gradient-to-r from-[#E76F51] to-[#E76F51]/90 hover:from-[#E76F51]/90 hover:to-[#E76F51] text-white rounded-lg transition-colors duration-150 shadow-md hover:shadow-lg"
          >
            Logout
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// ==================== FIXED HEADER (Full-width, outside sidebar) ====================
interface HeaderProps {
  user: {
    username?: string
    email?: string
    institution?: { name?: string }
    primary_institution_name?: string
    primary_institution_id?: string
  } | null
  roleInfo: { label: string; shortLabel: string; color: string; accentColor: string; icon: React.ComponentType<{ className?: string }> }
  toggleSidebar: () => void
  isMobile: boolean
  handleLogout: (logoutAllSystems: boolean) => void
  actualRole: string
  sidebarWidth: string
  pathname: string
}

const Header = ({ user, roleInfo, toggleSidebar, isMobile, handleLogout, actualRole, sidebarWidth, pathname }: HeaderProps) => {
  const displayName = user?.username || user?.email?.split('@')[0] || 'User'
  const institutionName = user?.institution?.name || user?.primary_institution_name || 'Your Institution'

  // Derive section name from pathname
  const getSectionName = () => {
    const segments = pathname.split('/').filter(Boolean)
    if (segments.length <= 2) {
      return actualRole === 'INSTITUTION_ADMIN' ? `${institutionName} Admin` :
        actualRole === 'CONTENT_CREATOR' ? 'Content Creator' :
        actualRole === 'SYSTEM_ADMIN' ? 'System Admin' :
        actualRole === 'INSTRUCTOR' ? 'Instructor' :
        'Learning Dashboard'
    }
    // Format last meaningful segment
    const last = segments[segments.length - 1]
    return last.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  }

  const sectionName = getSectionName()

  return (
    <header
      className="fixed top-0 right-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300"
      style={{ left: sidebarWidth }}
    >
      <div className="px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Left: hamburger (mobile) + breadcrumb */}
          <div className="flex items-center gap-3 min-w-0">
            {isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className="h-9 w-9 rounded-lg flex-shrink-0 hover:bg-[#2D6A4F]/10 transition-colors duration-150"
              >
                <Menu className="h-5 w-5 text-foreground" />
              </Button>
            )}
            <div className="flex flex-col min-w-0">
              {/* Breadcrumb: platform / section */}
              <div className="flex items-center gap-1.5">
                <span className="hidden md:inline text-[11px] font-medium text-muted-foreground/70 select-none">
                  CPD eLearning
                </span>
                <span className="hidden md:inline text-muted-foreground/40 text-sm select-none">/</span>
                <span className="text-[15px] font-bold text-foreground truncate">{sectionName}</span>
              </div>
              {/* Signed in as — desktop only */}
              <div className="hidden md:flex items-center gap-1.5">
                <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">Signed in as</span>
                <span className="text-[12px] font-semibold text-muted-foreground truncate">{displayName}</span>
              </div>
            </div>
          </div>

          {/* Right: search + bell + user chip */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Search trigger */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 rounded-lg hover:bg-[#2D6A4F]/10 transition-colors duration-150"
              aria-label="Search"
            >
              <Search className="w-4 h-4 text-muted-foreground" />
            </Button>

            {/* Notification bell */}
            <Button
              variant="ghost"
              size="sm"
              className="relative h-8 w-8 rounded-lg hover:bg-[#2D6A4F]/10 transition-colors duration-150"
            >
              <Bell className="w-4 h-4 text-muted-foreground" />
              {/* Number badge inside icon bounding box */}
              <span
                className="absolute top-0.5 right-0.5 h-[14px] min-w-[14px] px-[3px] bg-[#E76F51] rounded-full flex items-center justify-center text-[9px] font-bold tabular-nums text-white leading-none"
              >
                3
              </span>
            </Button>

            {/* Desktop user identity — no pill, no chevron */}
            <div className="hidden md:flex items-center gap-2 ml-1">
              <ConsistentDropdownMenu
                user={user}
                roleInfo={roleInfo}
                actualRole={actualRole}
                handleLogout={handleLogout}
                align="end"
                trigger={
                  <button className="flex items-center gap-2.5 cursor-pointer group outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg px-1 py-1">
                    {/* Avatar only — no container */}
                    <div className="h-8 w-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                      <span className="text-primary-foreground text-sm font-semibold">
                        {displayName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    {/* Name + role as plain text */}
                    <div className="flex flex-col text-left">
                      <span className="text-sm font-medium text-foreground leading-tight">{displayName}</span>
                      <span className="text-[11px] text-muted-foreground leading-tight">{roleInfo.label}</span>
                    </div>
                  </button>
                }
              />
            </div>

            {/* Mobile user menu — avatar only */}
            <div className="md:hidden ml-1">
              <ConsistentDropdownMenu
                user={user}
                roleInfo={roleInfo}
                actualRole={actualRole}
                handleLogout={handleLogout}
                align="end"
                trigger={
                  <button className="h-8 w-8 rounded-full flex items-center justify-center cursor-pointer outline-none">
                    <div className="h-8 w-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-primary-foreground text-sm font-semibold">
                        {displayName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </button>
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Role-color accent line — full width of content area, 2px, role-specific color */}
      <div
        className="h-[2px] w-full"
        style={{ backgroundColor: roleInfo.accentColor, opacity: 1 }}
      />
    </header>
  )
}

// ==================== MENU ITEM COMPONENT ====================
interface MenuItemProps {
  item: {
    title: string
    href?: string
    icon: React.ComponentType<{ className?: string }>
    exact?: boolean
    subItems?: Array<{
      title: string
      href?: string
      icon: React.ComponentType<{ className?: string }>
      badge?: string | number
    }>
    badge?: string | number
  }
  expandedItems: string[]
  toggleExpanded: (title: string) => void
  closeSidebar: () => void
  pathname: string
  isCollapsed: boolean
}

const MenuItem = ({ item, expandedItems, toggleExpanded, closeSidebar, pathname, isCollapsed }: MenuItemProps) => {
  const isExpanded = expandedItems.includes(item.title)
  const hasChildren = item.subItems && item.subItems.length > 0
  const Icon = item.icon

  const isItemActive = () => {
    if (!item.href) return false
    if (!hasChildren) {
      if (item.exact) return pathname === item.href
      return pathname.startsWith(item.href)
    }
    return false
  }

  const hasActiveChild = () => {
    if (!hasChildren) return false
    return item.subItems?.some((subItem) => {
      if (!subItem.href) return false
      return pathname === subItem.href || pathname.startsWith(subItem.href)
    })
  }

  const isActive = isItemActive()
  const childIsActive = hasActiveChild()

  // Simple item (no children)
  if (item.href && !hasChildren) {
    const inner = (
      <Link
        href={item.href}
        onClick={closeSidebar}
        className={cn(
          "flex items-center gap-3 text-sm font-medium transition-colors duration-150 w-full group relative rounded-lg",
          // floating inset pill: 8px horizontal margin
          "mx-2",
          isCollapsed ? "justify-center px-3 py-3" : "px-3 py-2.5",
          !isActive && [
            "text-[#717182]",
            "hover:text-primary hover:border-l hover:border-primary/40"
          ],
          isActive && [
            "bg-primary text-primary-foreground shadow-sm"
          ]
        )}
        style={{ width: isCollapsed ? undefined : 'calc(100% - 16px)' }}
      >
        <Icon className={cn(
          "h-4 w-4 flex-shrink-0 transition-colors duration-150",
          isActive ? "text-primary-foreground" : "text-[#717182] group-hover:text-primary"
        )} />
        {!isCollapsed && (
          <>
            <span className="font-medium flex-1">{item.title}</span>
            {item.badge && (
              <span className={cn(
                "text-[10px] px-1.5 py-0.5 rounded-full min-w-[18px] text-center tabular-nums",
                isActive ? "bg-primary-foreground/20 text-primary-foreground" : "bg-destructive text-destructive-foreground"
              )}>
                {typeof item.badge === 'string' ? '!' : item.badge}
              </span>
            )}
          </>
        )}
      </Link>
    )

    if (isCollapsed) {
      return (
        <li className="relative max-w-full flex justify-center">
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>{inner}</TooltipTrigger>
              <TooltipContent side="right" className="text-xs font-medium">
                {item.title}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </li>
      )
    }

    return <li className="relative max-w-full">{inner}</li>
  }

  // Parent item (has children)
  const parentBtn = (
    <button
      onClick={() => {
        if (isCollapsed) {
          // Clicking collapsed parent expands sidebar first
          // (handled by parent via setIsCollapsed(false) — here we just toggleExpanded)
          toggleExpanded(item.title)
        } else {
          toggleExpanded(item.title)
        }
      }}
      className={cn(
        "flex items-center gap-3 text-sm font-medium transition-colors duration-150 w-full group relative rounded-lg",
        "mx-2",
        isCollapsed ? "justify-center px-3 py-3" : "px-3 py-2.5",
        !childIsActive && [
          "text-[#717182]",
          "hover:text-primary hover:border-l hover:border-primary/40"
        ],
        childIsActive && "text-primary"
      )}
      style={{ width: isCollapsed ? undefined : 'calc(100% - 16px)' }}
    >
      {/* Active child: 2px × 14px accent mark on left edge */}
      {childIsActive && !isCollapsed && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-[14px] bg-primary rounded-full" />
      )}
      <Icon className={cn(
        "h-4 w-4 flex-shrink-0 transition-colors duration-150",
        childIsActive ? "text-primary" : "text-[#717182] group-hover:text-primary"
      )} />
      {!isCollapsed && (
        <>
          <span className="flex-1 text-left font-medium">{item.title}</span>
          <ChevronDown className={cn(
            "h-3.5 w-3.5 transition-transform duration-200",
            // 90° rotation = "opening a drawer"
            isExpanded ? "rotate-90" : "",
            childIsActive ? "text-primary" : "text-[#717182]"
          )} />
        </>
      )}
    </button>
  )

  return (
    <li className="relative max-w-full">
      <div>
        {isCollapsed ? (
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild className="flex justify-center">{parentBtn}</TooltipTrigger>
              <TooltipContent side="right" className="text-xs font-medium">
                {item.title}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : parentBtn}

        {/* Sub-items: recessed panel, smooth max-height accordion */}
        {!isCollapsed && (
          <div
            className={cn(
              "overflow-hidden transition-[max-height] duration-200 ease-out",
              isExpanded ? "max-h-96" : "max-h-0"
            )}
          >
            {/* Recessed sub-surface */}
            <div className="mx-2 mt-0.5 mb-1 rounded-lg bg-[#2D6A4F]/5 overflow-hidden">
              {item.subItems?.map((subItem) => {
                const isSubItemActive = subItem.href && (
                  pathname === subItem.href ||
                  (pathname.startsWith(subItem.href) && subItem.href !== "/dashboard/learner")
                )
                return (
                  <Link
                    key={subItem.href || subItem.title}
                    href={subItem.href || "#"}
                    onClick={closeSidebar}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 text-[11px] transition-colors duration-150 group relative rounded-[10px] mx-1 my-0.5",
                      !isSubItemActive && "text-[#717182] hover:text-primary hover:border-l hover:border-primary/40",
                      isSubItemActive && "bg-primary text-primary-foreground"
                    )}
                  >
                    <subItem.icon className={cn(
                      "h-3.5 w-3.5 flex-shrink-0 transition-colors duration-150",
                      isSubItemActive ? "text-primary-foreground" : "text-[#717182] group-hover:text-primary"
                    )} />
                    <span className={cn("font-medium flex-1", isSubItemActive && "text-primary-foreground")}>
                      {subItem.title}
                    </span>
                    {subItem.badge && (
                      <span className={cn(
                        "text-[10px] px-1.5 py-0.5 rounded-full tabular-nums",
                        isSubItemActive ? "bg-primary-foreground/20 text-primary-foreground" : "bg-destructive text-destructive-foreground"
                      )}>
                        {typeof subItem.badge === 'string' ? '!' : subItem.badge}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </li>
  )
}

// ==================== SIDEBAR NAV WITH SECTION LABELS ====================
interface SidebarNavProps {
  sidebarItems: ReturnType<typeof getSidebarConfig>
  expandedItems: string[]
  toggleExpanded: (title: string) => void
  closeSidebar: () => void
  pathname: string
  isCollapsed: boolean
  actualRole: string
}

const SidebarNav = ({ sidebarItems, expandedItems, toggleExpanded, closeSidebar, pathname, isCollapsed, actualRole }: SidebarNavProps) => {
  const groups = getSectionGroups(actualRole)

  // Build ordered list of [sectionLabel, items[]]
  const ordered: Array<{ label: string; items: typeof sidebarItems }> = []
  const assignedTitles = new Set<string>()

  for (const [label, titles] of Object.entries(groups)) {
    const groupItems = sidebarItems.filter(it => titles.includes(it.title))
    if (groupItems.length > 0) {
      ordered.push({ label, items: groupItems })
      groupItems.forEach(it => assignedTitles.add(it.title))
    }
  }

  // Any leftover items not in groups
  const leftover = sidebarItems.filter(it => !assignedTitles.has(it.title))
  if (leftover.length > 0) ordered.push({ label: 'OTHER', items: leftover })

  return (
    <nav className="flex-1 py-3 overflow-y-auto overflow-hidden">
      {ordered.map(({ label, items }, gi) => (
        <div key={label} className={cn("mb-2", gi > 0 && "mt-1")}>
          {/* Section divider */}
          {isCollapsed ? (
            // Collapsed: single 1px horizontal rule
            gi > 0 && (
              <div className="mx-3 my-2 h-px bg-[#2D6A4F]/10" />
            )
          ) : (
            // Expanded: ultra-bold 9px label
            <div className="px-4 mb-1 mt-2">
              <span className="text-[9px] font-black uppercase tracking-[0.12em] text-[#2D6A4F]/50 select-none">
                {label}
              </span>
            </div>
          )}
          <ul className="space-y-0.5">
            {items.map((item) => (
              <MenuItem
                key={item.title}
                item={item}
                expandedItems={expandedItems}
                toggleExpanded={toggleExpanded}
                closeSidebar={closeSidebar}
                pathname={pathname}
                isCollapsed={isCollapsed}
              />
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}

// ==================== MAIN LAYOUT COMPONENT ====================
export default function RoleBasedDashboardLayout({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false)
  const { user: reduxUser, isAuthenticated } = useAppSelector((state) => state.cpdAuth)
  const dispatch = useAppDispatch()
  const router = useRouter()
  const pathname = usePathname()

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [actualUser, setActualUser] = useState<{
    cpd_role?: string
    primary_institution_id?: string
    institution_ids?: string[]
    institution_role?: string
    IsForWhichSystem?: string
    email?: string
    first_name?: string
    last_name?: string
    id?: string
    username?: string
    institution?: { name?: string }
    primary_institution_name?: string
  } | null>(null)
  const [actualRole, setActualRole] = useState<string>("LEARNER")
  const [validationDone, setValidationDone] = useState(false)

  useEffect(() => {
    if (!hydrated) return
    const { cookieUser, localStorageUser, crossSystemContext } = validateUserFromAllSources()
    const determinedRole = determineActualRole(reduxUser, cookieUser, localStorageUser)
    let determinedUser = reduxUser
    if (!determinedUser && cookieUser) determinedUser = cookieUser
    if (!determinedUser && localStorageUser) determinedUser = localStorageUser
    if (!determinedUser && crossSystemContext) {
      const ctx = crossSystemContext as CrossSystemContext
      determinedUser = {
        cpd_role: ctx.cpd_role,
        primary_institution_id: ctx.primary_institution_id,
        institution_ids: ctx.institution_ids,
        institution_role: ctx.institution_role,
        IsForWhichSystem: ctx.system,
        email: "user@example.com",
        first_name: "User",
        last_name: "",
        id: "recovered",
        username: "user"
      } as any
    }
    setActualUser(determinedUser)
    setActualRole(determinedRole)
    if (isAuthenticated) {
      dispatch(validateProtectionStatus())
        .then((result: unknown) => {
          const payload = result as { payload?: { needsRecovery?: boolean } }
          if (payload.payload?.needsRecovery) {
            toast.info("Your session has been recovered successfully", { description: "Cross-system data has been preserved" })
          }
        })
        .catch(() => {})
    }
    setValidationDone(true)
  }, [reduxUser, hydrated, isAuthenticated, dispatch])

  useEffect(() => { setHydrated(true) }, [])

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      setIsCollapsed(mobile)
      if (!mobile) setIsSidebarOpen(false)
    }
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  useEffect(() => {
    if (hydrated && validationDone && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, hydrated, router, validationDone])

  const handleLogout = async (logoutAllSystems: boolean = false) => {
    try {
      if (actualUser) {
        safeSetLocalStorageJSON("cross_system_context", {
          system: SystemType.CPD_ELEARNING,
          cpd_role: actualUser.cpd_role,
          institution_ids: actualUser.institution_ids,
          primary_institution_id: actualUser.primary_institution_id,
          institution_role: actualUser.institution_role,
          last_sync: new Date().toISOString()
        })
      }
      await dispatch(logoutCPD(logoutAllSystems)).unwrap()
      toast.success(logoutAllSystems ? "Successfully logged out from all systems" : "Successfully logged out")
      router.push("/login")
    } catch (error: any) {
      toast.error(error || "Failed to logout")
      router.push("/login")
    }
  }

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)
  const toggleExpanded = (title: string) => setExpandedItems(prev =>
    prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
  )
  const closeSidebar = () => { if (isMobile) setIsSidebarOpen(false) }

  const sidebarItems = getSidebarConfig(actualRole, actualUser?.primary_institution_id, actualUser ?? undefined)
  const roleInfo = getRoleDisplayInfo(actualRole)

  const SIDEBAR_EXPANDED = "288px"
  const SIDEBAR_COLLAPSED = "80px"
  const SIDEBAR_HIDDEN = "0px"

  const sidebarWidth = isMobile
    ? SIDEBAR_HIDDEN
    : isCollapsed
      ? SIDEBAR_COLLAPSED
      : SIDEBAR_EXPANDED

  // Header height: py-3 + breadcrumb (~56px) + 2px accent = ~58px
  const HEADER_HEIGHT = "60px"

  const displayName = actualUser?.username || actualUser?.email?.split('@')[0] || 'U'

  if (!hydrated || !validationDone) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          <p className="text-sm text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) return null

  return (
    <div className="flex min-h-screen bg-background text-foreground">

      {/* ── Mobile overlay ── */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-[#2D6A4F]/30 z-30 animate-in fade-in-0"
          onClick={closeSidebar}
        />
      )}

      {/* ══════════════════════════════════════════
          SIDEBAR — command rail
      ══════════════════════════════════════════ */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full flex flex-col z-40 overflow-hidden",
          // Clean white sidebar with subtle right border
          "bg-white border-r border-[#2D6A4F]/10",
          // Width transition
          "transition-all duration-300",
          isCollapsed ? "w-20" : "w-72",
          isMobile && !isSidebarOpen ? "-translate-x-full" : "translate-x-0",
          isMobile && isSidebarOpen ? "shadow-2xl" : "",
          // Mobile: bottom sheet on very small, left drawer on larger mobile
        )}
      >
        {/* ── Brand / role-identity header ── */}
        <div
          className="flex items-center flex-shrink-0 relative"
          style={{ minHeight: HEADER_HEIGHT }}
        >
          {/* Expanded state */}
          {!isCollapsed && (
            <div className="flex items-center gap-3 px-4 flex-1 min-w-0">
              {/* Role icon — no gradient bg, just icon in primary color */}
              <roleInfo.icon className="h-7 w-7 flex-shrink-0" style={{ color: roleInfo.accentColor }} />
              <div className="flex flex-col min-w-0">
                {/* Role first */}
                <span
                  className="text-[9px] font-black uppercase tracking-[0.14em] leading-tight"
                  style={{ color: roleInfo.accentColor }}
                >
                  {roleInfo.shortLabel}
                </span>
                {/* Platform second */}
                <span className="text-[13px] font-semibold text-[#2D6A4F] leading-tight truncate">
                  CPD eLearning
                </span>
              </div>
            </div>
          )}

          {/* Collapsed state: icon centered */}
          {isCollapsed && (
            <div className="flex justify-center items-center w-full">
              <roleInfo.icon className="h-5 w-5" style={{ color: roleInfo.accentColor }} />
            </div>
          )}

          {/* Collapse toggle: thin 2px vertical strip running full height of brand area, right-aligned */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={cn(
              "absolute right-0 top-0 h-full w-5 flex items-center justify-center",
              "hover:bg-primary/10 transition-colors duration-150 group",
              isCollapsed && "w-full" // In collapsed mode full width is clickable but icon centered
            )}
            style={!isCollapsed ? { width: '20px' } : undefined}
          >
            {/* The 2px strip indicator — visible on hover */}
            {!isCollapsed && (
              <div className="w-[2px] h-6 rounded-full bg-[#2D6A4F]/20 group-hover:bg-primary/60 transition-colors duration-150" />
            )}
            {isCollapsed && (
              <ChevronRight className="h-3.5 w-3.5 text-[#2D6A4F]/40 group-hover:text-primary transition-colors duration-150 ml-auto mr-1.5" />
            )}
          </button>
        </div>

        {/* Divider below brand */}
        <div className="h-px mx-3 bg-[#2D6A4F]/10" />

        {/* Navigation with section labels */}
        <SidebarNav
          sidebarItems={sidebarItems}
          expandedItems={expandedItems}
          toggleExpanded={(title) => {
            // Collapsed parent click: expand sidebar first, then toggle
            if (isCollapsed) {
              setIsCollapsed(false)
              setExpandedItems(prev =>
                prev.includes(title) ? prev : [...prev, title]
              )
            } else {
              toggleExpanded(title)
            }
          }}
          closeSidebar={closeSidebar}
          pathname={pathname}
          isCollapsed={isCollapsed}
          actualRole={actualRole}
        />

        {/* ── Sidebar footer — compact identity strip ── */}
        <div className="flex-shrink-0">
          <div className="h-px mx-3 bg-[#2D6A4F]/10" />
          <div className={cn(
            "flex items-center py-3",
            isCollapsed ? "justify-center px-3" : "px-4 gap-2.5"
          )}>
            {/* 24px avatar */}
            <div
              className="h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-white"
              style={{ backgroundColor: roleInfo.accentColor }}
            >
              {displayName.charAt(0).toUpperCase()}
            </div>

            {/* Expanded: name + logout icon */}
            {!isCollapsed && (
              <>
                <span className="text-[12px] font-semibold text-[#2D6A4F] truncate flex-1 min-w-0">
                  {displayName}
                </span>
                {/* Direct logout button — triggers AlertDialog */}
                <LogoutDialog
                  roleInfo={roleInfo}
                  handleLogout={handleLogout}
                  trigger={
                    <button
                      className="h-7 w-7 flex items-center justify-center rounded-md text-[#717182] hover:text-[#E76F51] hover:bg-[#E76F51]/10 transition-colors duration-150 flex-shrink-0"
                      aria-label="Log out"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                    </button>
                  }
                />
              </>
            )}

            {/* Collapsed: avatar is the click target — popover/tooltip with name */}
            {isCollapsed && (
              <TooltipProvider delayDuration={150}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className="h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-white cursor-default"
                      style={{ backgroundColor: roleInfo.accentColor }}
                    >
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="text-xs font-medium">
                    {displayName}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
      </aside>

      {/* ══════════════════════════════════════════
          FIXED HEADER
      ══════════════════════════════════════════ */}
      <Header
        user={actualUser}
        roleInfo={roleInfo}
        toggleSidebar={toggleSidebar}
        isMobile={isMobile}
        handleLogout={handleLogout}
        actualRole={actualRole}
        sidebarWidth={sidebarWidth}
        pathname={pathname}
      />

      {/* ══════════════════════════════════════════
          MAIN CONTENT
      ══════════════════════════════════════════ */}
      <div
        className="flex-1 flex flex-col min-w-0 transition-all duration-300"
        style={{
          marginLeft: isMobile ? "0px" : sidebarWidth,
          paddingTop: HEADER_HEIGHT,
        }}
      >
        <main className="flex-1 overflow-y-auto overflow-x-auto bg-muted/30">
          <div className="p-4 md:p-6 animate-fade-in-scale">
            {children}
          </div>
        </main>
      </div>

      <style jsx>{`
        @keyframes fade-in-scale {
          from { opacity: 0; transform: scale(0.99); }
          to   { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in-scale {
          animation: fade-in-scale 0.25s ease-out;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .animate-in {
          animation: fade-in 0.2s ease-out;
        }
        .fade-in-0 {
          animation: fade-in 0.2s ease-out;
        }
        .zoom-in-95 {
          animation: zoom-in 0.2s ease-out;
        }
        @keyframes zoom-in {
          from { transform: scale(0.95); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }

        /* Mobile: bottom sheet on <480px, left drawer on 480px-1023px */
        @media (max-width: 479px) {
          aside[data-mobile-sheet="true"] {
            top: auto !important;
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            width: 100% !important;
            height: 85vh !important;
            border-radius: 1rem 1rem 0 0;
            transform: translateY(0) !important;
          }
        }
      `}</style>
    </div>
  )
}