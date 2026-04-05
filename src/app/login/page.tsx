"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { loginCPD, clearError, setInstitutionData } from '@/lib/features/auth/auth-slice'
import type { AppDispatch, RootState } from '@/lib/store'
import {
  Mail, Lock, Eye, EyeOff, AlertCircle, Loader2,
  ArrowRight, Home, GraduationCap, ShieldCheck, Smartphone, Globe,
  Zap, CheckCircle2,
} from 'lucide-react'
import Link from 'next/link'
import { getRoleDashboardPath } from "@/app/utils/roleNavigation"
import { GoogleOAuthProviderWrapper, GoogleLoginButton } from '@/components/auth/google-login'
import { toast } from 'sonner'
import { GoogleOneTapLogin } from '@/components/auth/GoogleOneTap'

/* ─── ECG pulse line (Login Two layout) ─────────────────────────────── */
function EcgLine() {
  return (
    <svg viewBox="0 0 400 48" className="w-full" style={{ opacity: 0.22 }} preserveAspectRatio="none">
      <path
        d="M0,24 L70,24 L82,24 L90,6 L98,42 L106,12 L114,24 L160,24 L172,24 L180,7 L188,41 L196,14 L204,24 L260,24 L272,24 L280,9 L288,39 L296,16 L304,24 L400,24"
        stroke="#74C69D" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  )
}

/* ─── Floating Particles (Login One feature — kept for left panel bg) ── */
function FloatingParticles() {
  const particles = Array.from({ length: 16 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 10 + 14,
    delay: Math.random() * 6,
  }))
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white/20"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{ y: [-10, -55], opacity: [0, 0.6, 0.6, 0], scale: [1, 1.4, 1] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

/* ─── Feature Carousel data (Login One functionality) ───────────────── */
const features = [
  {
    title: 'Protected Institution Data',
    description: 'Your institution affiliation, roles, and settings are safeguarded across systems.',
    icon: ShieldCheck,
  },
  {
    title: 'Global Access',
    description: 'Access your learning from anywhere, on any device',
    icon: Globe,
  },
]

const highlights = [
  'Accredited CPD certificates',
  'Expert clinical instructors',
  'Flexible, self-paced learning',
]

/* ═══════════════════════════════════════════════════════════════════════
   Main Page — Login One logic + Login Two layout/style
═══════════════════════════════════════════════════════════════════════ */
export default function LoginPage() {
  const router   = useRouter()
  const dispatch = useDispatch<AppDispatch>()

  // ── Login One state slice ──────────────────────────────────────────
  const {
    isLoading, error, isAuthenticated, user,
    requiresVerification, verificationEmail, errorCode, rejectionReason,
  } = useSelector((state: RootState) => state.cpdAuth)

  const hasRedirected         = React.useRef(false)
  const hasRedirectedToVerify = React.useRef(false)

  // ── Login One: redirect after auth ────────────────────────────────
  useEffect(() => {
    if (isAuthenticated && user && !hasRedirected.current) {
      const dashboardPath = getRoleDashboardPath(user.cpd_role)
      if (user.institution) {
        sessionStorage.setItem('current_institution', JSON.stringify(user.institution))
        if (!user.institution?._protected) {
          dispatch(setInstitutionData({
            ...user.institution,
            _protected: {
              system: 'CPD_ELEARNING',
              last_updated: new Date().toISOString(),
              immutable_fields: ['id', 'name', 'type', 'slug', 'created_at'],
              version: 1,
            },
          }))
        }
        toast.success(`Welcome back to ${user.institution.name || 'CPD eLearning'}!`, {
          description: 'Your institution data is protected',
        })
      }
      hasRedirected.current = true
      setTimeout(() => router.push(dashboardPath), 500)
    }
  }, [isAuthenticated, user, router, dispatch])

  // ── Login One: verify-email redirect ──────────────────────────────
  useEffect(() => {
    if (requiresVerification && verificationEmail && !hasRedirectedToVerify.current) {
      hasRedirectedToVerify.current = true
      toast.error("Please verify your email before signing in.")
      router.push(`/verify-email?email=${encodeURIComponent(verificationEmail)}`)
    }
  }, [requiresVerification, verificationEmail, router])

  const [formData,       setFormData]      = useState({ email: '', password: '' })
  const [showPassword,   setShowPassword]  = useState(false)
  const [rememberMe,     setRememberMe]    = useState(false)
  const [currentFeature, setCurrentFeature] = useState(0)   // Login One feature carousel

  useEffect(() => { return () => { dispatch(clearError()) } }, [dispatch])

  // ── Login One: feature carousel timer ─────────────────────────────
  useEffect(() => {
    const t = setInterval(() => setCurrentFeature((p) => (p + 1) % features.length), 8000)
    return () => clearInterval(t)
  }, [])

  // ── Login One: submit handler ──────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    hasRedirected.current = false
    try {
      const result = await dispatch(loginCPD(formData)).unwrap()
      if (result.user) {
        const hasInstitutionData = result.user.institution || result.user.primary_institution_id
        if (hasInstitutionData) {
          toast.success('Institution data preserved successfully', {
            description: 'Your institution context is protected across systems',
          })
        }
        localStorage.setItem('cpd_protection_active', 'true')
        localStorage.setItem('last_system_login', 'cpd_elearning')
      }
    } catch (err: any) {
      if (err.includes?.('protection') || err.includes?.('institution')) {
        toast.error('Data Protection Alert', {
          description: 'Your institution data is being safeguarded. Please contact support if this persists.',
        })
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value })

  return (
    <GoogleOAuthProviderWrapper>
      {/* ── Login Two outer shell ──────────────────────────────────── */}
      <div className="h-screen w-screen flex overflow-hidden" style={{ backgroundColor: '#F8F9FA' }}>

        {/* Google One Tap (Login One) */}
        {!isAuthenticated && (
          <GoogleOneTapLogin autoSelect={false} cancelOnTapOutside={false} context="signin" forceDisplay={false} />
        )}

        {/* ╔══════════════════════════════╗
            ║  LEFT — Brand / Showcase     ║  ← Login Two layout, CPD eLearning brand
            ╚══════════════════════════════╝ */}
        <div
          className="hidden lg:flex w-[44%] flex-col justify-between relative overflow-hidden px-10 py-8"
          style={{ backgroundColor: '#2D6A4F' }}
        >
          {/* Floating particles (Login One) */}
          <FloatingParticles />

          {/* Ambient glows */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 70% 60% at 28% 38%, rgba(116,198,157,0.18) 0%, transparent 68%)' }} />
          <div className="absolute bottom-[-60px] right-[-60px] w-52 h-52 rounded-full pointer-events-none"
            style={{ backgroundColor: 'rgba(231,111,81,0.10)', filter: 'blur(44px)' }} />

          {/* TOP — logo + headline */}
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="w-10 h-10 flex items-center justify-center"
                style={{ backgroundColor: 'rgba(255,255,255,0.14)', border: '1.5px solid rgba(255,255,255,0.28)' }}>
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-[15px] leading-none">
                  CPD<span style={{ color: '#74C69D' }}>Academy</span>
                </p>
                <p className="text-white/45 text-[9px] mt-0.5 tracking-widest uppercase">eLearning Platform</p>
              </div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-white font-bold leading-snug text-[1.6rem] mb-1"
            >
              Elevate Your<br />
              <span style={{ color: '#74C69D' }}>Clinical Practice</span>
            </motion.h2>
            <svg width="120" height="7" viewBox="0 0 240 7" className="mb-3">
              <path d="M0,3.5 Q60,0 120,3.5 T240,3.5" stroke="#E76F51" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            </svg>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-white/55 text-[11.5px] leading-relaxed max-w-[220px]"
            >
              Accredited courses for healthcare professionals across every discipline.
            </motion.p>
          </div>

          {/* MIDDLE — ECG + Login One highlights + feature carousel */}
          <div className="relative z-10 space-y-4">
            <EcgLine />

            {/* Highlights (Login One) */}
            <div className="space-y-2">
              {highlights.map((h, i) => (
                <motion.div
                  key={h}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.4 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-7 h-7 flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'rgba(116,198,157,0.18)', border: '1px solid rgba(116,198,157,0.32)' }}>
                    <CheckCircle2 className="w-3.5 h-3.5" style={{ color: '#74C69D' }} />
                  </div>
                  <span className="text-white/80 text-[12px] font-medium">{h}</span>
                </motion.div>
              ))}
            </div>

            {/* Feature carousel (Login One) */}
            <div
              className="w-full"
              style={{
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.12)',
                padding: '1rem 1.25rem',
              }}
            >
              <div className="relative h-20 overflow-hidden">
                {features.map((feat, index) => {
                  const FIcon = feat.icon
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{
                        opacity: index === currentFeature ? 1 : 0,
                        x: index === currentFeature ? 0 : 24,
                      }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0 flex items-center gap-3 px-1"
                    >
                      <div className="w-9 h-9 flex-shrink-0 flex items-center justify-center"
                        style={{ background: 'rgba(255,255,255,0.15)' }}>
                        <FIcon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-bold text-[12px] leading-none mb-1">{feat.title}</p>
                        <p className="text-[10.5px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.60)' }}>
                          {feat.description}
                        </p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
              {/* Dot indicators */}
              <div className="flex gap-1.5 mt-2">
                {features.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentFeature(i)}
                    className="h-1 transition-all duration-300"
                    style={{
                      width: i === currentFeature ? '1.25rem' : '0.25rem',
                      background: i === currentFeature ? '#ffffff' : 'rgba(255,255,255,0.3)',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* BOTTOM — stats */}
          <div className="relative z-10">
            <div className="w-full mb-3.5" style={{ borderTop: '1px solid rgba(255,255,255,0.11)' }} />
            <div className="flex items-center justify-between">
              {[['10K+', 'Learners'], ['100+', 'Institutions'], ['500+', 'Courses']].map(([n, l]) => (
                <div key={l} className="text-center">
                  <p className="text-white font-bold text-sm">{n}</p>
                  <p className="text-white/45 text-[10px]">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ╔══════════════════════════════╗
            ║  RIGHT — Login form          ║  ← Login Two layout, Login One logic
            ╚══════════════════════════════╝ */}
        <div
          className="flex-1 flex flex-col justify-center items-center px-6 sm:px-10 relative"
          style={{ backgroundColor: '#F8F9FA' }}
        >
          {/* Back home pill (Login Two style) */}
          <Link
            href="/"
            className="absolute top-5 left-5 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-all group"
            style={{ backgroundColor: 'rgba(45,106,79,0.08)', border: '1px solid rgba(45,106,79,0.18)', color: '#2D6A4F' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(45,106,79,0.14)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(45,106,79,0.08)' }}
          >
            <Home className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Home</span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="w-full max-w-[360px]"
          >
            {/* Mobile logo */}
            <div className="flex lg:hidden items-center gap-2 mb-5">
              <div className="w-8 h-8 flex items-center justify-center" style={{ backgroundColor: '#2D6A4F' }}>
                <GraduationCap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-sm" style={{ color: '#2D6A4F' }}>CPDAcademy</span>
            </div>

            {/* Heading */}
            <div className="mb-5">
              <h1 className="text-xl font-bold" style={{ color: '#1E2F5E' }}>
                Welcome{' '}
                <span className="relative inline-block" style={{ color: '#2D6A4F' }}>
                  Back
                  <svg className="absolute left-0 w-full" style={{ bottom: '-3px' }} height="6" viewBox="0 0 60 6">
                    <path d="M0,3 Q15,0 30,3 T60,3" stroke="#E76F51" strokeWidth="2" fill="none" strokeLinecap="round"/>
                  </svg>
                </span>
              </h1>
              <p className="text-xs mt-1.5" style={{ color: '#717182' }}>Sign in to continue your learning journey</p>
            </div>

            {/* ── Login One error banners (all 3 variants), Login Two style ── */}
            <AnimatePresence>
              {error && errorCode === 'PENDING_APPROVAL' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="mb-3 p-2.5 flex items-start gap-2"
                  style={{ backgroundColor: 'rgba(233,196,106,0.10)', border: '1px solid rgba(233,196,106,0.35)' }}
                >
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: '#E9C46A' }} />
                  <div>
                    <p className="text-xs font-bold" style={{ color: '#1E2F5E' }}>Application Under Review</p>
                    <p className="text-xs mt-0.5 leading-relaxed" style={{ color: '#717182' }}>{error}</p>
                  </div>
                </motion.div>
              )}
              {error && errorCode === 'APPLICATION_REJECTED' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="mb-3 p-2.5 flex items-start gap-2"
                  style={{ backgroundColor: '#FFF0EE', border: '1px solid #FFCFC9' }}
                >
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: '#E76F51' }} />
                  <div>
                    <p className="text-xs font-bold" style={{ color: '#E76F51' }}>Application Not Approved</p>
                    <p className="text-xs mt-0.5 leading-relaxed" style={{ color: '#717182' }}>{error}</p>
                    {rejectionReason && (
                      <p className="text-xs mt-1 italic" style={{ color: '#717182' }}>Reason: {rejectionReason}</p>
                    )}
                  </div>
                </motion.div>
              )}
              {error && !errorCode && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="mb-3 p-2.5 flex items-start gap-2"
                  style={{ backgroundColor: '#FFF0EE', border: '1px solid #FFCFC9' }}
                >
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: '#E76F51' }} />
                  <p className="text-xs font-medium" style={{ color: '#C0392B' }}>{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form card */}
            <div className="p-6" style={{
              backgroundColor: '#fff',
              border: '1px solid rgba(45,106,79,0.08)',
              boxShadow: '0 6px 28px -4px rgba(45,106,79,0.10)',
            }}>
              <form onSubmit={handleSubmit} className="space-y-3">

                {/* Email */}
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#2D6A4F' }}>
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: '#74C69D' }} />
                    <input
                      type="email" name="email" value={formData.email} onChange={handleChange}
                      placeholder="you@example.com" required disabled={isLoading}
                      className="w-full pl-9 pr-3 py-2 text-sm outline-none transition-all"
                      style={{ backgroundColor: '#F8F9FA', border: '1.5px solid rgba(30,47,94,0.1)', color: '#1E2F5E' }}
                      onFocus={e => { e.currentTarget.style.borderColor = '#74C69D'; e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(116,198,157,0.1)' }}
                      onBlur={e  => { e.currentTarget.style.borderColor = 'rgba(30,47,94,0.1)'; e.currentTarget.style.backgroundColor = '#F8F9FA'; e.currentTarget.style.boxShadow = 'none' }}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#2D6A4F' }}>
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: '#74C69D' }} />
                    <input
                      type={showPassword ? 'text' : 'password'} name="password" value={formData.password}
                      onChange={handleChange} placeholder="••••••••" required disabled={isLoading}
                      className="w-full pl-9 pr-9 py-2 text-sm outline-none transition-all"
                      style={{ backgroundColor: '#F8F9FA', border: '1.5px solid rgba(30,47,94,0.1)', color: '#1E2F5E' }}
                      onFocus={e => { e.currentTarget.style.borderColor = '#74C69D'; e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(116,198,157,0.1)' }}
                      onBlur={e  => { e.currentTarget.style.borderColor = 'rgba(30,47,94,0.1)'; e.currentTarget.style.backgroundColor = '#F8F9FA'; e.currentTarget.style.boxShadow = 'none' }}
                    />
                    <button
                      type="button" onClick={() => setShowPassword(!showPassword)} disabled={isLoading}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 transition-colors"
                      style={{ color: '#717182' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#2D6A4F' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#717182' }}
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Remember + Forgot */}
                <div className="flex items-center justify-between pt-0.5">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <div
                      onClick={() => !isLoading && setRememberMe(!rememberMe)}
                      className="w-3.5 h-3.5 flex items-center justify-center cursor-pointer transition-all"
                      style={{
                        backgroundColor: rememberMe ? '#2D6A4F' : '#fff',
                        border: `2px solid ${rememberMe ? '#2D6A4F' : 'rgba(30,47,94,0.2)'}`,
                      }}
                    >
                      {rememberMe && (
                        <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 10 10">
                          <path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                    <span className="text-[11px] select-none" style={{ color: '#717182' }}>Remember me</span>
                  </label>
                  <Link href="/forgot-password" className="text-[11px] font-medium hover:underline" style={{ color: '#E76F51' }}>
                    Forgot password?
                  </Link>
                </div>

                {/* Submit */}
                <motion.button
                  type="submit" disabled={isLoading}
                  whileHover={{ scale: isLoading ? 1 : 1.01 }}
                  whileTap={{ scale: isLoading ? 1 : 0.99 }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-bold text-white transition-all disabled:opacity-60 relative overflow-hidden group"
                  style={{ backgroundColor: '#2D6A4F' }}
                  onMouseEnter={e => { if (!isLoading) (e.currentTarget as HTMLElement).style.backgroundColor = '#1f4d37' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#2D6A4F' }}
                >
                  <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700 pointer-events-none" />
                  {isLoading
                    ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /><span>Signing in…</span></>
                    : <><span className="tracking-wide">Sign In</span><ArrowRight className="w-3.5 h-3.5" /></>
                  }
                </motion.button>
              </form>

              {/* OR divider */}
              <div className="flex items-center gap-3 my-3.5">
                <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(30,47,94,0.08)' }} />
                <span className="text-[10px] font-medium" style={{ color: '#717182' }}>OR</span>
                <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(30,47,94,0.08)' }} />
              </div>

              <GoogleLoginButton />

              {/* Sign up */}
              <div className="mt-4 pt-3 text-center" style={{ borderTop: '1px solid rgba(30,47,94,0.07)' }}>
                <p className="text-[11px]" style={{ color: '#717182' }}>
                  Don't have an account?{' '}
                  <Link
                    href="/register"
                    className="font-semibold inline-flex items-center gap-0.5 transition-colors group/reg"
                    style={{ color: '#2D6A4F' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#1f4d37' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#2D6A4F' }}
                  >
                    Apply to join CPD eLearning
                    <ArrowRight className="w-3 h-3 group-hover/reg:translate-x-0.5 transition-transform" />
                  </Link>
                </p>
              </div>
            </div>

            <p className="text-center mt-3.5 text-[11px]" style={{ color: '#717182' }}>
              <Link href="/" className="hover:underline">← Back to Home</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </GoogleOAuthProviderWrapper>
  )
}