
// @ts-nocheck

"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Menu, X, BookOpen, Users, TrendingUp, Award, ChevronRight,
  Star, ArrowRight, Clock, Loader2, Shield, GraduationCap,
  Building2, FileText, LogOut, Search, Settings,
  LayoutDashboard, ChevronDown, ChevronLeft, ChevronUp,
  Globe, Crown, Target,
} from "lucide-react"
import Link from "next/link"
import { useEffect as useEffect2, useState as useState2 } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { fetchPublicInstitutionsForHomepage } from "@/lib/features/institutions/institutionSlice"
import { useRouter } from "next/navigation"
import { logoutCPD, loginWithGoogle } from "@/lib/features/auth/auth-slice"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/lib/store"
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import Cookies from "js-cookie"
import { LoginModal } from "@/components/auth/LoginModal"

import { HeroSection } from "./components/home/HeroSection"
import { CuratedPathCarousel } from "./components/home/CuratedPathCarousel"
import { CategoriesSection } from "./components/home/CategoriesSection"
import { TestimonialsSection } from "./components/home/TestimonialsSection"
import { Footer } from "./components/home/Footer"
import { Navbar } from "./components/home/NavigationBar"
/* ── safe storage helpers ──────────────────────────────────────────── */
const safeGet = (key: string, def = "") => {
  if (typeof window === "undefined") return def
  try { return localStorage.getItem(key) || def } catch { return def }
}
const safeGetJSON = <T,>(key: string, def: T): T => {
  if (typeof window === "undefined") return def
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def } catch { return def }
}

/* ── role helpers ──────────────────────────────────────────────────── */
const getStoredUser = () => {
  let cookieUser = null
  try { const c = Cookies.get("cpd_user"); if (c) cookieUser = JSON.parse(c) } catch { }
  let lsUser = null
  try { const l = safeGet("cpd_user"); if (l) lsUser = JSON.parse(l) } catch { }
  const crossCtx = safeGetJSON("cross_system_context", null)
  return { cookieUser, lsUser, crossCtx }
}

const resolveRole = (redux: any): string => {
  if (redux?.cpd_role) return redux.cpd_role
  const { cookieUser, lsUser, crossCtx } = getStoredUser()
  return cookieUser?.cpd_role || lsUser?.cpd_role || crossCtx?.cpd_role || "LEARNER"
}

const dashboardPath = (role?: string) => {
  const map: Record<string, string> = {
    SYSTEM_ADMIN: "/dashboard/system-admin",
    INSTITUTION_ADMIN: "/dashboard/institution-admin",
    CONTENT_CREATOR: "/dashboard/content-creator",
    INSTRUCTOR: "/dashboard/instructor",
    LEARNER: "/dashboard/learner/learning/courses",
  }
  return map[role || "LEARNER"] || "/dashboard/learner/learning/courses"
}

const roleLabel = (role?: string) => ({
  SYSTEM_ADMIN: "System Admin", INSTITUTION_ADMIN: "Institution Admin",
  CONTENT_CREATOR: "Content Creator", INSTRUCTOR: "Instructor", LEARNER: "Learner",
}[role || "LEARNER"] || "Learner")

const roleIcon = (role?: string) => ({
  SYSTEM_ADMIN: Shield, INSTITUTION_ADMIN: Building2,
  CONTENT_CREATOR: FileText, INSTRUCTOR: GraduationCap, LEARNER: BookOpen,
}[role || "LEARNER"] || BookOpen)

/* ── Google login button (inline) ─────────────────────────────────── */
function HomeGoogleLoginButton() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const [busy, setBusy] = useState(false)

  const onSuccess = async (cred: any) => {
    if (!cred.credential) { toast.error("Google login failed"); return }
    setBusy(true)
    try {
      const res = await dispatch(loginWithGoogle(cred.credential)).unwrap()
      toast.success(`Welcome ${res.user.first_name}!`)
      setTimeout(() => { window.location.href = dashboardPath(res.user.cpd_role) }, 500)
    } catch (e: any) {
      toast.error(e || "Google login failed")
    } finally { setBusy(false) }
  }

  return (
    <div className="relative w-full">
      {busy && (
        <div className="absolute inset-0 bg-white/90 flex items-center justify-center z-10">
          <Loader2 className="w-5 h-5 animate-spin" style={{ color: "#2D6A4F" }} />
        </div>
      )}
      <GoogleLogin onSuccess={onSuccess} onError={() => toast.error("Google login failed")}
        type="standard" theme="outline" size="large" text="continue_with"
        shape="rectangular" logo_alignment="left" />
    </div>
  )
}




const InstitutionsSectionSkeleton = () => (
  <section id="institutions" className="py-16 px-4 md:px-6" style={{ backgroundColor: '#ffffff' }}>
    <div className="max-w-7xl mx-auto">
      {/* Section header */}
      <div className="mb-8">
        <Skeleton className="h-3 w-24 mb-2 bg-gray-200/70" />
        <Skeleton className="h-8 w-64 bg-gray-200/70" />
        <Skeleton className="h-4 w-80 mt-2 bg-gray-200/70" />
      </div>

      {/* Two-panel layout skeleton */}
      <div
        className="flex flex-col lg:grid overflow-hidden rounded-xl"
        style={{
          gridTemplateColumns: '272px 1fr',
          border: '1px solid rgba(45,106,79,0.12)',
          minHeight: '480px',
          height: '520px',
        }}
      >
        {/* LEFT SIDEBAR SKELETON */}
        <div
          className="flex flex-col"
          style={{
            background: '#F8F9FA',
            borderRight: '1px solid rgba(45,106,79,0.1)',
            height: '100%',
            overflow: 'hidden',
          }}
        >
          {/* Search skeleton */}
          <div className="flex-shrink-0 p-2.5" style={{ borderBottom: '1px solid rgba(45,106,79,0.08)' }}>
            <Skeleton className="h-8 w-full rounded-lg bg-gray-200/70" />
          </div>

          {/* Count label skeleton */}
          <div className="flex-shrink-0 px-3 py-1.5">
            <Skeleton className="h-3 w-32 bg-gray-200/70" />
          </div>

          {/* Institution list skeleton */}
          <div className="flex-1 overflow-y-auto">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 px-3 py-2.5"
                style={{ borderBottom: '1px solid rgba(45,106,79,0.06)' }}
              >
                <Skeleton className="w-8 h-8 rounded-lg flex-shrink-0 bg-gray-200/70" />
                <div className="flex-1 min-w-0 space-y-1">
                  <Skeleton className="h-4 w-full bg-gray-200/70" />
                  <Skeleton className="h-3 w-24 bg-gray-200/70" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL SKELETON */}
        <div className="bg-white flex flex-col overflow-hidden">
          {/* Panel header skeleton */}
          <div
            className="flex items-center gap-3 flex-shrink-0 px-5 py-3.5"
            style={{ borderBottom: '1px solid rgba(45,106,79,0.08)' }}
          >
            <Skeleton className="w-10 h-10 rounded-xl flex-shrink-0 bg-gray-200/70" />
            <div className="flex-1 min-w-0 space-y-1">
              <Skeleton className="h-5 w-40 bg-gray-200/70" />
              <Skeleton className="h-3 w-56 bg-gray-200/70" />
            </div>
          </div>

          {/* Category grid skeleton */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid gap-2.5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))' }}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton
                  key={i}
                  className="h-20 w-full rounded-xl bg-gray-200/70"
                  style={{ minHeight: '82px' }}
                />
              ))}
            </div>
          </div>

          {/* Footer skeleton */}
          <div
            className="flex-shrink-0 flex items-center justify-between px-5 py-3"
            style={{ borderTop: '1px solid rgba(45,106,79,0.08)' }}
          >
            <Skeleton className="h-6 w-24 rounded-md bg-gray-200/70" />
            <Skeleton className="h-5 w-32 bg-gray-200/70" />
          </div>
        </div>
      </div>
    </div>
  </section>
)

// ── Enhanced Category Card with better proportions ──────────────────
function CategoryCard({
  cat,
  onClick,
}: {
  cat: { id: string; name: string; course_count?: number }
  onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="text-left flex flex-col gap-2.5 rounded-xl transition-all duration-200 group"
      style={{
        padding: '16px 18px',
        minHeight: '100px',
        background: hovered ? '#2D6A4F' : '#ffffff',
        border: `1.5px solid ${hovered ? '#2D6A4F' : 'rgba(45,106,79,0.12)'}`,
        boxShadow: hovered
          ? '0 8px 20px -6px rgba(45,106,79,0.25)'
          : '0 2px 6px rgba(0,0,0,0.02)',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
      }}
    >
      <span
        className="text-sm font-bold leading-snug flex-1"
        style={{ color: hovered ? '#ffffff' : '#1E2F5E' }}
      >
        {cat.name}
      </span>
      <div className="flex items-center justify-between">
        {cat.course_count !== undefined && (
          <span
            className="text-xs px-2.5 py-1 rounded-full font-semibold"
            style={{
              background: hovered ? 'rgba(255,255,255,0.2)' : 'rgba(45,106,79,0.1)',
              color: hovered ? '#ffffff' : '#2D6A4F',
            }}
          >
            {cat.course_count} {cat.course_count === 1 ? 'course' : 'courses'}
          </span>
        )}
        <ArrowRight
          className="w-4 h-4 transition-all duration-200"
          style={{
            color: hovered ? '#ffffff' : '#2D6A4F',
            opacity: hovered ? 1 : 0,
            transform: hovered ? 'translateX(4px)' : 'translateX(-4px)',
          }}
        />
      </div>
    </button>
  )
}

/* ── Enhanced Main section ───────────────────────────────────────────────────── */
function InstitutionsSection() {
  const { isLoadingPublic, publicInstitutions } = useAppSelector((s) => s.institutions)
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [selected, setSelected] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (publicInstitutions.length === 0) dispatch(fetchPublicInstitutionsForHomepage())
  }, [dispatch, publicInstitutions.length])

  // Auto-select first institution
  useEffect(() => {
    if (publicInstitutions.length > 0 && !selected) {
      setSelected(publicInstitutions[0].id)
    }
  }, [publicInstitutions, selected])

  const handleCategory = (slug: string, cat: string) => {
    router.push(`/institutions/${slug}/courses?category=${encodeURIComponent(cat)}`)
  }

  const filteredInstitutions = publicInstitutions.filter((inst) =>
    inst.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  )

  const selectedInst = publicInstitutions.find((i) => i.id === selected)
  const totalCourses = selectedInst?.categories?.reduce(
    (sum: number, c: any) => sum + (c.course_count ?? 0), 0
  ) ?? 0

  // Show skeleton while loading
  if (isLoadingPublic) {
    return <InstitutionsSectionSkeleton />
  }

  return (
    <section id="institutions" className="py-20 px-4 md:px-6 lg:px-8" style={{ backgroundColor: '#ffffff' }}>
      <div className="max-w-7xl mx-auto">

        {/* Enhanced Section header */}
        <div className="mb-10">
          <div className="cpd-eyebrow mb-3 text-sm font-semibold tracking-wider">Trusted Partners</div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
            Browse by{' '}
            <span className="relative inline-block">
              <span style={{ color: '#2D6A4F' }}>Institution</span>
              <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 300 8"
                style={{ transform: 'translateY(6px)' }}>
                <path d="M0,4 Q75,1 150,4 T300,4" stroke="#E76F51" strokeWidth="5"
                  fill="none" strokeLinecap="round" />
              </svg>
            </span>
          </h2>
          <p className="text-sm md:text-base mt-3 max-w-2xl" style={{ color: '#717182' }}>
            Select an institution to explore their CPD course categories and find your perfect learning path
          </p>
        </div>

        {/* Empty state */}
        {publicInstitutions.length === 0 ? (
          <div className="flex flex-col items-center py-20 gap-4">
            <div className="w-16 h-16 flex items-center justify-center rounded-2xl"
              style={{ background: 'rgba(30,47,94,0.05)' }}>
              <Building2 className="w-8 h-8" style={{ color: 'rgba(30,47,94,0.25)' }} />
            </div>
            <p className="text-sm font-medium" style={{ color: '#717182' }}>No institutions available yet</p>
          </div>

          /* Enhanced Two-panel layout */
        ) : (
          <div
            className="flex flex-col lg:grid overflow-hidden rounded-2xl"
            style={{
              gridTemplateColumns: '300px 1fr',
              border: '1.5px solid rgba(45,106,79,0.12)',
              minHeight: '540px',
              height: '580px',
              boxShadow: '0 12px 32px -12px rgba(0,0,0,0.08)',
            }}
          >
            {/* ── ENHANCED LEFT SIDEBAR ── */}
            <div
              className="flex flex-col"
              style={{
                background: 'linear-gradient(180deg, #F8F9FA 0%, #F2F4F6 100%)',
                borderRight: '1.5px solid rgba(45,106,79,0.1)',
                height: '100%',
                overflow: 'hidden',
              }}
            >
              {/* Enhanced Search */}
              <div className="flex-shrink-0 p-3.5"
                style={{ borderBottom: '1.5px solid rgba(45,106,79,0.08)' }}>
                <div
                  className="flex items-center gap-2.5 rounded-xl px-3.5 transition-all duration-200 focus-within:ring-2 focus-within:ring-[#2D6A4F]/20"
                  style={{
                    background: '#ffffff',
                    height: '42px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  }}
                >
                  <Search className="w-4 h-4 flex-shrink-0" style={{ color: '#999' }} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search institutions…"
                    className="flex-1 text-sm bg-transparent outline-none border-0 focus:ring-0 placeholder:text-gray-400"
                    style={{ color: '#1E2F5E', boxShadow: 'none' }}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="flex-shrink-0 p-0.5 rounded-full hover:bg-gray-100 transition-colors"
                      style={{ color: '#999' }}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
              <div
                className="flex-shrink-0 px-4 py-2 text-xs font-semibold uppercase tracking-wider"
                style={{ color: '#888' }}
              >
                {searchQuery
                  ? `${filteredInstitutions.length} of ${publicInstitutions.length} institutions`
                  : `${publicInstitutions.length} institutions`}
              </div>

              {/* Enhanced Scrollable institution list */}
              <div
                className="flex-1 overflow-y-auto"
                style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(45,106,79,0.25) transparent' }}
              >
                {filteredInstitutions.length === 0 ? (
                  <div className="flex flex-col items-center py-12 gap-3">
                    <Search className="w-6 h-6" style={{ color: 'rgba(30,47,94,0.15)' }} />
                    <p className="text-sm" style={{ color: '#999' }}>No institutions match</p>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-xs font-semibold px-4 py-1.5 rounded-full transition-colors"
                      style={{
                        background: 'rgba(45,106,79,0.1)',
                        color: '#2D6A4F'
                      }}
                    >
                      Clear search
                    </button>
                  </div>
                ) : (
                  filteredInstitutions.map((inst) => {
                    const isActive = selected === inst.id
                    const instTotal = inst.categories?.reduce(
                      (s: number, c: any) => s + (c.course_count ?? 0), 0
                    ) ?? 0
                    return (
                      <button
                        key={inst.id}
                        onClick={() => setSelected(inst.id)}
                        className="w-full flex items-center gap-3 text-left transition-all duration-200"
                        style={{
                          padding: '14px 16px',
                          background: isActive ? '#2D6A4F' : 'transparent',
                          borderBottom: '1px solid rgba(45,106,79,0.06)',
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) e.currentTarget.style.background = 'rgba(45,106,79,0.06)'
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) e.currentTarget.style.background = 'transparent'
                        }}
                      >
                        {/* Enhanced Logo */}
                        <div
                          className="w-10 h-10 flex items-center justify-center rounded-xl flex-shrink-0 text-xs font-bold transition-all duration-200"
                          style={{
                            background: isActive ? 'rgba(255,255,255,0.18)' : 'rgba(45,106,79,0.12)',
                            color: isActive ? '#ffffff' : '#2D6A4F',
                            boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.1)' : 'none',
                          }}
                        >
                          {inst.logo_url ? (
                            <img
                              src={inst.logo_url}
                              alt={inst.name}
                              className="w-6 h-6 object-contain"
                              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                            />
                          ) : (
                            inst.name.slice(0, 2).toUpperCase()
                          )}
                        </div>

                        {/* Enhanced Info */}
                        <div className="flex-1 min-w-0">
                          <div
                            className="text-sm font-bold truncate leading-tight"
                            style={{ color: isActive ? '#ffffff' : '#1E2F5E' }}
                          >
                            {inst.name}
                          </div>
                          <div
                            className="text-xs mt-1 font-medium"
                            style={{ color: isActive ? 'rgba(255,255,255,0.65)' : '#888' }}
                          >
                            {inst.categories?.length ?? 0} {inst.categories?.length === 1 ? 'category' : 'categories'}
                            {instTotal > 0 && ` · ${instTotal} ${instTotal === 1 ? 'course' : 'courses'}`}
                          </div>
                        </div>

                        {/* Enhanced Active chevron */}
                        <ChevronRight
                          className="w-4 h-4 flex-shrink-0 transition-all duration-200"
                          style={{
                            color: isActive ? 'rgba(255,255,255,0.7)' : 'transparent',
                            opacity: isActive ? 1 : 0,
                            transform: isActive ? 'translateX(0)' : 'translateX(-6px)',
                          }}
                        />
                      </button>
                    )
                  })
                )}
              </div>
            </div>

            {/* ── ENHANCED RIGHT: CATEGORY PANEL ── */}
            <div className="bg-white flex flex-col overflow-hidden">
              <AnimatePresence mode="wait">
                {selectedInst && (
                  <motion.div
                    key={selectedInst.id}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="flex flex-col h-full"
                  >
                    {/* Enhanced Panel header */}
                    <div
                      className="flex items-center gap-4 flex-shrink-0 px-6 py-4"
                      style={{ borderBottom: '1.5px solid rgba(45,106,79,0.08)' }}
                    >
                      <div
                        className="w-12 h-12 flex items-center justify-center rounded-xl flex-shrink-0 text-sm font-bold shadow-sm"
                        style={{ background: 'rgba(45,106,79,0.1)', color: '#2D6A4F' }}
                      >
                        {selectedInst.logo_url ? (
                          <img
                            src={selectedInst.logo_url}
                            alt={selectedInst.name}
                            className="w-7 h-7 object-contain"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                          />
                        ) : (
                          selectedInst.name.slice(0, 2).toUpperCase()
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-base md:text-lg font-bold truncate" style={{ color: '#1E2F5E' }}>
                          {selectedInst.name}
                        </h4>
                        <p className="text-sm mt-1 font-medium" style={{ color: '#717182' }}>
                          {selectedInst.categories?.length ?? 0} {selectedInst.categories?.length === 1 ? 'category' : 'categories'}
                          {totalCourses > 0 && ` · ${totalCourses} ${totalCourses === 1 ? 'course' : 'courses'} total`}
                        </p>
                      </div>
                    </div>

                    {/* Enhanced Category grid — scrollable */}
                    <div
                      className="flex-1 overflow-y-auto p-5"
                      style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(45,106,79,0.2) transparent' }}
                    >
                      {selectedInst.categories?.length > 0 ? (
                        <div
                          className="grid gap-3.5"
                          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))' }}
                        >
                          {selectedInst.categories.map((cat: any) => (
                            <CategoryCard
                              key={cat.id}
                              cat={cat}
                              onClick={() => handleCategory(selectedInst.slug, cat.name)}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center py-16 gap-3">
                          <div className="w-14 h-14 flex items-center justify-center rounded-2xl"
                            style={{ background: 'rgba(30,47,94,0.05)' }}>
                            <BookOpen className="w-7 h-7" style={{ color: 'rgba(30,47,94,0.2)' }} />
                          </div>
                          <p className="text-sm font-medium" style={{ color: '#999' }}>
                            No course categories available yet
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Enhanced Footer — fixed "Explore all courses" */}
                    <div
                      className="flex-shrink-0 flex items-center justify-between px-6 py-4"
                      style={{ borderTop: '1.5px solid rgba(45,106,79,0.08)', background: '#FAFBFC' }}
                    >
                      <span className="text-xs px-3 py-1.5 rounded-lg font-mono font-medium"
                        style={{ background: 'rgba(45,106,79,0.06)', color: '#2D6A4F' }}
                      >
                        {selectedInst.slug}
                      </span>
                      <Link
                        href={`/institutions/${selectedInst.slug}/courses`}
                        className="inline-flex items-center gap-2 text-sm font-bold group transition-all duration-200 px-4 py-2 rounded-lg"
                        style={{
                          color: '#2D6A4F',
                          background: 'rgba(45,106,79,0.06)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#2D6A4F'
                          e.currentTarget.style.color = '#ffffff'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(45,106,79,0.06)'
                          e.currentTarget.style.color = '#2D6A4F'
                        }}
                      >
                        Explore all courses
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}


function StatsBanner() {
  const stats = [
    { icon: BookOpen, label: "Active Courses", value: "200+" },
    { icon: Users, label: "Professionals", value: "12K+" },
    { icon: Award, label: "Certificates", value: "32K+" },
    { icon: TrendingUp, label: "CPD Hours", value: "50K+" },
  ]

  return (
    <section className="py-12 px-4 md:px-6" style={{ backgroundColor: '#ffffff' }}>
      <div className="max-w-7xl mx-auto">
        <div
          className="relative overflow-hidden rounded-xl"
          style={{
            background: 'linear-gradient(135deg, #2D6A4F 0%, #1f4d37 100%)',
            boxShadow: '0 8px 24px -6px rgba(45,106,79,0.25)',
          }}
        >
          {/* Subtle pattern overlay */}
          <div
            className="absolute inset-0 opacity-5 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1.5px, transparent 1.5px)`,
              backgroundSize: '24px 24px',
            }}
          />

          <div className="relative z-10 px-6 py-8 md:px-8 md:py-6">
            {/* Header - more compact */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div className="max-w-xl">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-0.5 rounded-full" style={{ backgroundColor: '#E9C46A' }} />
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider"
                    style={{ color: 'rgba(255,255,255,0.7)' }}
                  >
                    Platform Stats
                  </span>
                </div>
                <h2
                  className="text-white font-bold leading-tight"
                  style={{ fontSize: 'clamp(1.25rem, 2vw, 1.5rem)', letterSpacing: '-0.01em' }}
                >
                  Trusted by Healthcare Professionals
                </h2>
                <p
                  className="text-[11px] mt-1.5 max-w-md"
                  style={{ color: 'rgba(255,255,255,0.65)', lineHeight: '1.5' }}
                >
                  Join thousands earning verifiable CPD points with expert-designed content.
                </p>
              </div>
              <div
                className="hidden md:flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white transition-all cursor-pointer group rounded-lg flex-shrink-0"
                style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.2)' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.12)' }}
                onClick={() => window.location.href = '/register'}
              >
                Join the platform
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>

            {/* Stats grid - more compact */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {stats.map(({ icon: Icon, label, value }, index) => (
                <div
                  key={label}
                  className="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 hover:scale-[1.02]"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  <div
                    className="w-9 h-9 flex items-center justify-center rounded-lg flex-shrink-0"
                    style={{ background: 'rgba(255,255,255,0.12)' }}
                  >
                    <Icon className="w-4 h-4" style={{ color: '#E9C46A' }} />
                  </div>
                  <div>
                    <div
                      className="font-black text-white leading-none"
                      style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.5rem)', letterSpacing: '-0.02em' }}
                    >
                      {value}
                    </div>
                    <div className="text-[9px] font-medium uppercase tracking-wide mt-0.5" style={{ color: 'rgba(255,255,255,0.55)' }}>
                      {label}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Optional: Trust badge row - adds credibility */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-5 pt-4 border-t border-white/10">
              {['CPD Accredited', 'Expert Instructors', 'Lifetime Access', 'Verified Certificates'].map((badge) => (
                <div key={badge} className="flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full" style={{ backgroundColor: '#74C69D' }} />
                  <span className="text-[9px] font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    {badge}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── CTA section ───────────────────────────────────────────────────── */
function CTASection() {
  return (
    <section style={{ padding: "5rem 1.5rem", backgroundColor: "#ffffff" }}>
      <div className="max-w-7xl mx-auto">
        <div
          className="relative overflow-hidden text-center"
          style={{
            padding: "4rem 2rem",
            background: "linear-gradient(135deg, rgba(45,106,79,0.04) 0%, rgba(116,198,157,0.06) 50%, rgba(231,111,81,0.03) 100%)",
            border: "1px solid rgba(45,106,79,0.1)",
          }}
        >
          {/* Corner accents */}
          <div
            className="absolute top-0 left-0 w-16 h-16 pointer-events-none"
            style={{ borderTop: "3px solid #2D6A4F", borderLeft: "3px solid #2D6A4F" }}
          />
          <div
            className="absolute bottom-0 right-0 w-16 h-16 pointer-events-none"
            style={{ borderBottom: "3px solid #E76F51", borderRight: "3px solid #E76F51" }}
          />

          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="cpd-eyebrow justify-center mb-4">Ready to grow?</div>
            <h2 className="cpd-heading mb-4">
              Advance your{" "}
              <span className="cpd-heading-accent">clinical career</span>
            </h2>
            <p className="cpd-subtext mx-auto text-center mb-8">
              Access world-class CPD training from expert clinical instructors. Flexible learning,
              verified certificates, professional growth — all in one platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
              <Link href="/register" className="cpd-btn-primary" style={{ padding: "0.75rem 2rem" }}>
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/courses" className="cpd-btn-outline" style={{ padding: "0.75rem 2rem" }}>
                Browse Courses
              </Link>
            </div>
            <div className="flex items-center justify-center gap-2 flex-wrap text-[11px]" style={{ color: "#717182" }}>
              {["No credit card required", "Instant access", "Cancel anytime"].map((t, i) => (
                <span key={t} className="flex items-center gap-2">
                  {i > 0 && <span className="w-1 h-1 rounded-full bg-current opacity-40" />}
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════
   MAIN HOME PAGE
   ══════════════════════════════════════════════════════════════════ */
export default function CPDHomePage() {
  const { isAuthenticated } = useSelector((s: RootState) => s.cpdAuth)
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#fff" }}>
      <Navbar />

      {/* Hero */}
      <HeroSection />

      {/* Institutions with horizontal categories */}
      <InstitutionsSection />

      <section id="how-it-works" className="py-16 px-4 md:px-6" style={{ backgroundColor: '#F8F9FA' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4" style={{ color: '#2D6A4F' }}>
              How It{' '}
              <span className="relative inline-block">
                Works
                <svg
                  className="absolute -bottom-1 left-0 w-full"
                  height="10"
                  viewBox="0 0 300 10"
                  style={{ transform: 'translateY(8px)' }}
                >
                  <path
                    d="M0,5 Q75,1 150,5 T300,5"
                    stroke="#E76F51"
                    strokeWidth="6"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h2>
            <p className="text-sm max-w-2xl mx-auto" style={{ color: '#717182' }}>
              Three simple steps to advance your professional development
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Browse & Enroll',
                description: 'Explore our extensive course catalog and enroll in courses that match your CPD requirements.',
                icon: BookOpen,
                color: '#2D6A4F',
              },
              {
                step: '02',
                title: 'Learn & Complete',
                description: 'Access video lessons, reading materials, and pass assessments at your own pace.',
                icon: Users,
                color: '#74C69D',
              },
              {
                step: '03',
                title: 'Earn Certificate',
                description: 'Download your verified CPD certificate with unique verification ID and QR code.',
                icon: Award,
                color: '#E76F51',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="relative p-6 transition-all duration-300 hover:translate-y-[-6px] rounded-lg"
                style={{
                  backgroundColor: '#ffffff',
                  boxShadow: '0 15px 30px -8px rgba(0,0,0,0.06)',
                }}
              >
                <div
                  className="absolute top-0 right-0 w-16 h-16 flex items-center justify-center text-2xl opacity-10 font-bold"
                  style={{ color: item.color }}
                >
                  {item.step}
                </div>

                <div
                  className="w-12 h-12 flex items-center justify-center mb-4 rounded"
                  style={{ backgroundColor: item.color }}
                >
                  <item.icon className="w-6 h-6 text-white" />
                </div>

                <h3 className="text-base mb-2 font-semibold" style={{ color: '#2D6A4F' }}>
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#717182' }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses Carousel */}
      <section id="courses" style={{ padding: "5rem 1.5rem", backgroundColor: "#ffffff" }}>
        <CuratedPathCarousel />
      </section>

      {/* Section divider */}
      <div className="cpd-divider" />

      {/* Categories grid */}
      <section id="categories" className="cpd-bg-dots" style={{ padding: "5rem 1.5rem" }}>
        <CategoriesSection />
      </section>

      {/* Platform stats */}
      <StatsBanner />

      {/* Testimonials */}
      <section id="testimonials" style={{ padding: "5rem 1.5rem", backgroundColor: "#F8F9FA" }}>
        <TestimonialsSection />
      </section>

      {/* CTA */}
      <CTASection />

      {/* Footer */}
      <Footer />
    </div>
  )
}
