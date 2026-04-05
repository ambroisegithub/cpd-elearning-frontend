// @ts-nocheck
"use client"

import React, { useState, useEffect, useRef, useMemo, Suspense } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter, useSearchParams } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { clearError, clearVerificationState } from "@/lib/features/auth/auth-slice"
import type { AppDispatch, RootState } from "@/lib/store"
import {
  Mail, Loader2, CheckCircle, AlertCircle, ArrowLeft,
  RefreshCw, ShieldCheck, GraduationCap, Lock, KeyRound,
} from "lucide-react"
import Link from "next/link"
import api from "@/lib/api"
import { toast } from "sonner"

/* ── ECG line (Two style) ─────────────────────────────────────────── */
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

/* ── Why verify — left panel items (Two style) ───────────────────── */
const reasons = [
  { icon: ShieldCheck, title: "Secure your account",       sub: "Confirm it's really you before accessing CPD content"  },
  { icon: Lock,        title: "Protect your CPD record",   sub: "Only verified accounts earn & store CPD certificates"   },
  { icon: KeyRound,    title: "One-time step",              sub: "Verify once, then sign in freely on any device"         },
]

function VerifyEmailForm() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const dispatch     = useDispatch<AppDispatch>()

  // ── One's state slice ───────────────────────────────────────────
  const { error } = useSelector((state: RootState) => state.cpdAuth)

  const emailParam = searchParams.get("email")    || ""
  const redirectParam = searchParams.get("redirect") || ""

  // ── One's redirect/join-flow logic ──────────────────────────────
  const redirectTarget = redirectParam ? decodeURIComponent(redirectParam) : "/login"
  const isJoinFlow     = redirectTarget.includes("/join")

  const [otp,         setOtp]         = useState(["", "", "", "", "", ""])
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [verified,    setVerified]    = useState(false)
  const [localError,  setLocalError]  = useState("")
  const [cooldown,    setCooldown]    = useState(0)
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => () => { dispatch(clearError()) }, [dispatch])

  useEffect(() => {
    if (cooldown > 0) {
      const t = setTimeout(() => setCooldown(c => c - 1), 1000)
      return () => clearTimeout(t)
    }
  }, [cooldown])

  // ── One's OTP change handler (with auto-submit on 6th digit) ────
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const next = [...otp]; next[index] = value; setOtp(next)
    setLocalError("")
    if (value && index < 5) otpRefs.current[index + 1]?.focus()
    // Auto-submit when all filled (One behaviour)
    if (value && index === 5 && next.every(Boolean)) {
      handleVerify(next.join(""))
    }
  }
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }
  const handlePaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    if (text.length === 6) {
      const digits = text.split(""); setOtp(digits)
      otpRefs.current[5]?.focus(); handleVerify(text)
    }
  }

  // ── One's verify handler (clears verificationState, uses redirectTarget) ──
  const handleVerify = async (code?: string) => {
    const otpString = code || otp.join("")
    if (otpString.length !== 6) { setLocalError("Please enter all 6 digits"); return }
    setIsVerifying(true); setLocalError("")
    try {
      const res = await api.post("/auth/verify-email", { email: emailParam, otp: otpString })
      if (res.data.success) {
        // One: clear Redux verification state FIRST
        dispatch(clearVerificationState())
        dispatch(clearError())
        setVerified(true)
        toast.success(
          isJoinFlow
            ? "Email verified! Continuing to join your institution…"
            : "Email verified! Welcome to CPD eLearning 🎉"
        )
        setTimeout(() => router.push(redirectTarget), 2200)
      }
    } catch (err: any) {
      setLocalError(err.response?.data?.message || "Invalid or expired code. Please try again.")
      setOtp(["", "", "", "", "", ""])
      otpRefs.current[0]?.focus()
    } finally {
      setIsVerifying(false)
    }
  }

  // ── One's resend handler ────────────────────────────────────────
  const handleResend = async () => {
    if (cooldown > 0 || !emailParam) return
    setIsResending(true)
    try {
      await api.post("/auth/resend-verification", { email: emailParam })
      toast.success("New verification code sent!")
      setCooldown(60)
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to resend code")
    } finally {
      setIsResending(false)
    }
  }

  // ── One's verified logic, Two's success style ───────────────────
  if (verified) {
    return (
      <div className="h-screen w-screen flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: '#F8F9FA' }}>
        <div className="absolute top-[-60px] left-[-60px] w-72 h-72 rounded-full pointer-events-none"
          style={{ backgroundColor: 'rgba(116,198,157,0.15)', filter: 'blur(60px)' }} />
        <div className="absolute bottom-[-60px] right-[-60px] w-72 h-72 rounded-full pointer-events-none"
          style={{ backgroundColor: 'rgba(231,111,81,0.10)', filter: 'blur(60px)' }} />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-[320px] relative z-10 mx-4 text-center"
        >
          <div className="p-8" style={{
            backgroundColor: '#fff',
            border: '1px solid rgba(45,106,79,0.08)',
            boxShadow: '0 8px 32px -4px rgba(45,106,79,0.12)',
          }}>
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-14 h-14 flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: 'rgba(116,198,157,0.15)', border: '2px solid rgba(116,198,157,0.4)' }}
            >
              <CheckCircle className="w-7 h-7" style={{ color: '#2D6A4F' }} />
            </motion.div>
            <h2 className="text-xl font-bold mb-2" style={{ color: '#1E2F5E' }}>Email Verified!</h2>
            <p className="text-sm mb-1" style={{ color: '#717182' }}>Your account is now active.</p>
            {/* One's conditional redirect message */}
            <p className="text-xs mb-5" style={{ color: '#717182' }}>
              {isJoinFlow ? "Returning to join your institution…" : "Redirecting to sign in…"}
            </p>
            <div className="h-1 overflow-hidden" style={{ backgroundColor: 'rgba(45,106,79,0.1)' }}>
              <motion.div className="h-full" style={{ backgroundColor: '#2D6A4F' }}
                initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 2.2 }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="h-screen w-screen flex overflow-hidden" style={{ backgroundColor: '#F8F9FA' }}>

      {/* ╔══════════════════════════════╗
          ║  LEFT — Brand panel          ║  Two style
          ╚══════════════════════════════╝ */}
      <div
        className="hidden lg:flex w-[44%] flex-col justify-between relative overflow-hidden px-10 py-8"
        style={{ backgroundColor: '#2D6A4F' }}
      >
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 60% at 28% 38%, rgba(116,198,157,0.18) 0%, transparent 68%)' }} />
        <div className="absolute bottom-[-60px] right-[-60px] w-52 h-52 rounded-full pointer-events-none"
          style={{ backgroundColor: 'rgba(231,111,81,0.10)', filter: 'blur(44px)' }} />

        {/* TOP */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
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
          </div>

          <h2 className="text-white font-bold leading-snug text-[1.55rem] mb-1">
            Verify Your<br />
            <span style={{ color: '#74C69D' }}>Identity</span>
          </h2>
          <svg width="115" height="7" viewBox="0 0 230 7" className="mb-3">
            <path d="M0,3.5 Q57.5,0 115,3.5 T230,3.5" stroke="#E76F51" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          </svg>
          <p className="text-white/55 text-[11.5px] leading-relaxed max-w-[205px]">
            One quick step to secure your CPD eLearning account.
          </p>
        </div>

        {/* MIDDLE — ECG + reasons */}
        <div className="relative z-10 space-y-3">
          <EcgLine />
          <div className="space-y-2.5 pt-1">
            {reasons.map(({ icon: Icon, title, sub }) => (
              <div key={title} className="flex items-start gap-3">
                <div className="w-7 h-7 flex-shrink-0 flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(116,198,157,0.18)', border: '1px solid rgba(116,198,157,0.32)' }}>
                  <Icon className="w-3.5 h-3.5" style={{ color: '#74C69D' }} />
                </div>
                <div>
                  <p className="text-white text-[12px] font-semibold leading-none">{title}</p>
                  <p className="text-white/45 text-[10px] mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
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
          ║  RIGHT — OTP form            ║  Two style, One logic
          ╚══════════════════════════════╝ */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 sm:px-10 relative"
        style={{ backgroundColor: '#F8F9FA' }}>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
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
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 flex items-center justify-center"
                style={{ backgroundColor: 'rgba(116,198,157,0.15)', border: '1px solid rgba(116,198,157,0.3)' }}>
                <ShieldCheck className="w-4 h-4" style={{ color: '#2D6A4F' }} />
              </div>
              <h1 className="text-xl font-bold" style={{ color: '#1E2F5E' }}>
                Verify Your{' '}
                <span className="relative inline-block" style={{ color: '#2D6A4F' }}>
                  Email
                  <svg className="absolute left-0 w-full" style={{ bottom: '-3px' }} height="6" viewBox="0 0 60 6">
                    <path d="M0,3 Q15,0 30,3 T60,3" stroke="#E76F51" strokeWidth="2" fill="none" strokeLinecap="round"/>
                  </svg>
                </span>
              </h1>
            </div>
            <p className="text-xs mt-2" style={{ color: '#717182' }}>
              Enter the 6-digit code sent to{' '}
              <span className="font-semibold" style={{ color: '#2D6A4F' }}>{emailParam || "your email"}</span>
            </p>
          </div>

          {/* Error */}
          <AnimatePresence>
            {localError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="mb-3 p-2.5 flex items-start gap-2"
                style={{ backgroundColor: '#FFF0EE', border: '1px solid #FFCFC9' }}
              >
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: '#E76F51' }} />
                <p className="text-xs font-medium" style={{ color: '#C0392B' }}>{localError}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* OTP card */}
          <div className="p-6" style={{
            backgroundColor: '#fff',
            border: '1px solid rgba(45,106,79,0.08)',
            boxShadow: '0 6px 28px -4px rgba(45,106,79,0.10)',
          }}>
            {/* OTP inputs */}
            <div className="mb-4">
              <label className="block text-[10px] font-semibold uppercase tracking-wider mb-3 text-center"
                style={{ color: '#2D6A4F' }}>
                Verification Code
              </label>
              <div className="flex justify-center gap-1.5" onPaste={handlePaste}>
                {otp.map((digit, i) => (
                  <motion.input
                    key={i}
                    ref={el => (otpRefs.current[i] = el)}
                    type="text" inputMode="numeric" maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    onKeyDown={e => handleKeyDown(i, e)}
                    className="w-10 h-10 text-center text-lg font-bold outline-none transition-all"
                    style={{
                      border: `2px solid ${digit ? '#2D6A4F' : 'rgba(30,47,94,0.12)'}`,
                      backgroundColor: digit ? 'rgba(45,106,79,0.06)' : '#F8F9FA',
                      color: digit ? '#2D6A4F' : '#1E2F5E',
                    }}
                    onFocus={e => { e.currentTarget.style.borderColor='#74C69D'; e.currentTarget.style.backgroundColor='#fff'; e.currentTarget.style.boxShadow='0 0 0 3px rgba(116,198,157,0.12)' }}
                    onBlur={e => {
                      e.currentTarget.style.borderColor = digit ? '#2D6A4F' : 'rgba(30,47,94,0.12)'
                      e.currentTarget.style.backgroundColor = digit ? 'rgba(45,106,79,0.06)' : '#F8F9FA'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                    whileFocus={{ scale: 1.05 }}
                    disabled={isVerifying}
                  />
                ))}
              </div>
            </div>

            {/* Verify button */}
            <motion.button
              onClick={() => handleVerify()}
              disabled={isVerifying || otp.some(d => !d)}
              whileHover={{ scale: isVerifying || otp.some(d => !d) ? 1 : 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-bold text-white transition-all disabled:opacity-60 relative overflow-hidden group mb-4"
              style={{ backgroundColor: '#2D6A4F' }}
              onMouseEnter={e => { if (!isVerifying && !otp.some(d => !d)) (e.currentTarget as HTMLElement).style.backgroundColor = '#1f4d37' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#2D6A4F' }}
            >
              <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700 pointer-events-none" />
              {isVerifying
                ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /><span>Verifying…</span></>
                : <><CheckCircle className="w-3.5 h-3.5" /><span className="tracking-wide">Verify Email</span></>
              }
            </motion.button>

            {/* Resend */}
            <div className="text-center space-y-1.5">
              <p className="text-[11px]" style={{ color: '#717182' }}>Didn't receive the code?</p>
              <button
                onClick={handleResend} disabled={isResending || cooldown > 0}
                className="text-[11px] font-semibold transition-colors disabled:opacity-50 flex items-center gap-1.5 mx-auto"
                style={{ color: '#2D6A4F' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#1f4d37' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#2D6A4F' }}
              >
                {isResending ? <><Loader2 className="w-3 h-3 animate-spin" />Sending…</>
                  : cooldown > 0 ? `Resend in ${cooldown}s`
                  : <><RefreshCw className="w-3 h-3" />Resend code</>
                }
              </button>
            </div>

            {/* One's conditional back link (join flow vs registration) */}
            <div className="mt-4 pt-3 text-center" style={{ borderTop: '1px solid rgba(30,47,94,0.07)' }}>
              <Link
                href={isJoinFlow ? redirectTarget : "/register"}
                className="flex items-center justify-center gap-1.5 text-[11px] transition-colors"
                style={{ color: '#717182' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#2D6A4F' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#717182' }}
              >
                <ArrowLeft className="w-3 h-3" />
                {isJoinFlow ? "Back to invitation" : "Back to registration"}
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="h-screen w-screen flex items-center justify-center" style={{ backgroundColor: '#F8F9FA' }}>
      <div className="p-8" style={{ backgroundColor: '#fff', border: '1px solid rgba(45,106,79,0.08)' }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#2D6A4F' }} />
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <VerifyEmailForm />
    </Suspense>
  )
}