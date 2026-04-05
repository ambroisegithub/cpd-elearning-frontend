// @ts-nocheck
"use client"

import React, { useState, useEffect, useRef, Suspense } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter, useSearchParams } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { changePasswordWithOTP, requestPasswordChange, clearError } from "@/lib/features/auth/auth-slice"
import type { AppDispatch, RootState } from "@/lib/store"
import {
  Lock, Eye, EyeOff, Loader2, AlertCircle, CheckCircle,
  ArrowLeft, KeyRound, RefreshCw, ShieldCheck, GraduationCap,
} from "lucide-react"
import Link from "next/link"
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

/* ── Password strength (One logic) ───────────────────────────────── */
function getStrength(pw: string) {
  let s = 0
  if (pw.length >= 8) s++
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++
  if (/[0-9]/.test(pw)) s++
  if (/[^a-zA-Z0-9]/.test(pw)) s++
  return s
}
const sColor = ["#ef4444", "#f59e0b", "#eab308", "#22c55e"]
const sLabel = ["Weak", "Fair", "Good", "Strong"]

/* ── Password tips for left panel (Two style) ───────────────────── */
const tips = [
  { title: "At least 8 characters",  sub: "Keep it long for better security"       },
  { title: "Mix letters & numbers",  sub: "Uppercase, lowercase and digits"         },
  { title: "Use a special character", sub: "!, @, #, $ make passwords stronger"    },
]

function ResetPasswordForm() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const dispatch     = useDispatch<AppDispatch>()

  // ── One's state slice ───────────────────────────────────────────
  const { isLoading, error } = useSelector((state: RootState) => state.cpdAuth)

  const emailParam = searchParams.get("email") || ""
  const [otp,             setOtp]             = useState(["", "", "", "", "", ""])
  const [newPassword,     setNewPassword]     = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPw,          setShowPw]          = useState(false)
  const [showConfirm,     setShowConfirm]     = useState(false)
  const [localError,      setLocalError]      = useState("")
  const [success,         setSuccess]         = useState(false)
  const [cooldown,        setCooldown]        = useState(0)
  const [isResending,     setIsResending]     = useState(false)
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => () => { dispatch(clearError()) }, [dispatch])

  useEffect(() => {
    if (cooldown > 0) {
      const t = setTimeout(() => setCooldown(c => c - 1), 1000)
      return () => clearTimeout(t)
    }
  }, [cooldown])

  const strength  = getStrength(newPassword)
  const pwMatch   = confirmPassword && newPassword === confirmPassword
  const otpFilled = otp.every(Boolean)
  const canSubmit = otpFilled && newPassword.length >= 8 && pwMatch

  // ── One's OTP handlers ──────────────────────────────────────────
  const handleOtpChange = (i: number, v: string) => {
    if (!/^\d*$/.test(v)) return
    const next = [...otp]; next[i] = v; setOtp(next)
    setLocalError("")
    if (v && i < 5) otpRefs.current[i + 1]?.focus()
  }
  const handleOtpKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus()
  }
  const handlePaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    if (text.length === 6) { setOtp(text.split("")); otpRefs.current[5]?.focus() }
  }

  // ── One's submit handler ────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    setLocalError("")
    try {
      await dispatch(changePasswordWithOTP({
        email:        emailParam,
        otp:          otp.join(""),
        new_password: newPassword,
      })).unwrap()
      setSuccess(true)
      toast.success("Password changed successfully!")
      setTimeout(() => router.push("/login"), 2500)
    } catch (err: any) {
      setLocalError(err || "Invalid code or something went wrong. Please try again.")
      setOtp(["", "", "", "", "", ""])
      otpRefs.current[0]?.focus()
    }
  }

  // ── One's resend handler ────────────────────────────────────────
  const handleResend = async () => {
    if (cooldown > 0 || !emailParam) return
    setIsResending(true)
    try {
      await dispatch(requestPasswordChange(emailParam)).unwrap()
      toast.success("New code sent!")
      setCooldown(60)
    } catch {
      toast.error("Failed to resend code")
    } finally {
      setIsResending(false)
    }
  }

  // ── One's success logic, Two's success style ────────────────────
  if (success) {
    return (
      <div className="h-screen w-screen flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: '#F8F9FA' }}>
        <div className="absolute top-[-60px] left-[-60px] w-72 h-72 rounded-full pointer-events-none"
          style={{ backgroundColor: 'rgba(116,198,157,0.15)', filter: 'blur(60px)' }} />
        <div className="absolute bottom-[-60px] right-[-60px] w-72 h-72 rounded-full pointer-events-none"
          style={{ backgroundColor: 'rgba(231,111,81,0.10)', filter: 'blur(60px)' }} />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-[340px] relative z-10 mx-4 text-center"
        >
          <div className="p-8" style={{
            backgroundColor: '#fff',
            border: '1px solid rgba(45,106,79,0.08)',
            boxShadow: '0 8px 32px -4px rgba(45,106,79,0.12)',
          }}>
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.15 }}
              className="w-14 h-14 flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: 'rgba(116,198,157,0.15)', border: '2px solid rgba(116,198,157,0.4)' }}
            >
              <ShieldCheck className="w-7 h-7" style={{ color: '#2D6A4F' }} />
            </motion.div>
            <h2 className="text-xl font-bold mb-2" style={{ color: '#1E2F5E' }}>Password Changed!</h2>
            <p className="text-sm mb-1" style={{ color: '#717182' }}>Your password has been updated successfully.</p>
            <p className="text-xs mb-5" style={{ color: '#717182' }}>Redirecting to login…</p>
            <div className="h-1 overflow-hidden" style={{ backgroundColor: 'rgba(45,106,79,0.1)' }}>
              <motion.div className="h-full" style={{ backgroundColor: '#2D6A4F' }}
                initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 2.5 }}
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
            Almost There!<br />
            <span style={{ color: '#74C69D' }}>Set Your Password</span>
          </h2>
          <svg width="115" height="7" viewBox="0 0 230 7" className="mb-3">
            <path d="M0,3.5 Q57.5,0 115,3.5 T230,3.5" stroke="#E76F51" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          </svg>
          <p className="text-white/55 text-[11.5px] leading-relaxed max-w-[205px]">
            Choose a strong password you haven't used before.
          </p>
        </div>

        {/* MIDDLE — ECG + tips */}
        <div className="relative z-10 space-y-3">
          <EcgLine />
          <div className="space-y-2.5 pt-1">
            {tips.map(({ title, sub }) => (
              <div key={title} className="flex items-start gap-3">
                <div className="w-7 h-7 flex-shrink-0 flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(116,198,157,0.18)', border: '1px solid rgba(116,198,157,0.32)' }}>
                  <CheckCircle className="w-3.5 h-3.5" style={{ color: '#74C69D' }} />
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
          ║  RIGHT — Reset form          ║  Two style, One logic
          ╚══════════════════════════════╝ */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 sm:px-10 relative"
        style={{ backgroundColor: '#F8F9FA' }}>

        {/* Back to forgot-password (Two style) */}
        <Link href="/forgot-password"
          className="absolute top-5 left-5 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-all group"
          style={{ backgroundColor: 'rgba(45,106,79,0.08)', border: '1px solid rgba(45,106,79,0.18)', color: '#2D6A4F' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(45,106,79,0.14)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(45,106,79,0.08)' }}
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-[380px]"
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
                <KeyRound className="w-4 h-4" style={{ color: '#2D6A4F' }} />
              </div>
              <h1 className="text-xl font-bold" style={{ color: '#1E2F5E' }}>
                Reset{' '}
                <span className="relative inline-block" style={{ color: '#2D6A4F' }}>
                  Password
                  <svg className="absolute left-0 w-full" style={{ bottom: '-3px' }} height="6" viewBox="0 0 100 6">
                    <path d="M0,3 Q25,0 50,3 T100,3" stroke="#E76F51" strokeWidth="2" fill="none" strokeLinecap="round"/>
                  </svg>
                </span>
              </h1>
            </div>
            <p className="text-xs mt-1.5" style={{ color: '#717182' }}>
              Code sent to{' '}
              <span className="font-semibold" style={{ color: '#2D6A4F' }}>{emailParam || "your email"}</span>
            </p>
          </div>

          {/* Error (One logic — localError || error from cpdAuth) */}
          <AnimatePresence>
            {(localError || error) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="mb-3 p-2.5 flex items-start gap-2"
                style={{ backgroundColor: '#FFF0EE', border: '1px solid #FFCFC9' }}
              >
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: '#E76F51' }} />
                <p className="text-xs font-medium" style={{ color: '#C0392B' }}>{localError || error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form card */}
          <div className="p-5" style={{
            backgroundColor: '#fff',
            border: '1px solid rgba(45,106,79,0.08)',
            boxShadow: '0 6px 28px -4px rgba(45,106,79,0.10)',
          }}>
            <form onSubmit={handleSubmit} className="space-y-3">

              {/* OTP inputs */}
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider mb-2 text-center"
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
                      onKeyDown={e => handleOtpKeyDown(i, e)}
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
                      disabled={isLoading}
                    />
                  ))}
                </div>
                {/* Resend (One's handler) */}
                <div className="text-center mt-2">
                  <button type="button" onClick={handleResend} disabled={isResending || cooldown > 0}
                    className="text-[11px] transition-colors disabled:opacity-50 flex items-center gap-1 mx-auto"
                    style={{ color: '#717182' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#2D6A4F' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#717182' }}
                  >
                    {isResending
                      ? <><Loader2 className="w-3 h-3 animate-spin" />Sending…</>
                      : cooldown > 0 ? `Resend in ${cooldown}s`
                      : <><RefreshCw className="w-3 h-3" />Resend code</>
                    }
                  </button>
                </div>
              </div>

              {/* New password */}
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#2D6A4F' }}>
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: '#74C69D' }} />
                  <input
                    type={showPw ? "text" : "password"} value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="New password (min 8 chars)" required disabled={isLoading}
                    className="w-full pl-9 pr-9 py-2 text-sm outline-none transition-all"
                    style={{ backgroundColor: '#F8F9FA', border: '1.5px solid rgba(30,47,94,0.1)', color: '#1E2F5E' }}
                    onFocus={e => { e.currentTarget.style.borderColor='#74C69D'; e.currentTarget.style.backgroundColor='#fff'; e.currentTarget.style.boxShadow='0 0 0 3px rgba(116,198,157,0.1)' }}
                    onBlur={e => { e.currentTarget.style.borderColor='rgba(30,47,94,0.1)'; e.currentTarget.style.backgroundColor='#F8F9FA'; e.currentTarget.style.boxShadow='none' }}
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 transition-colors" style={{ color: '#717182' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#2D6A4F' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#717182' }}
                  >
                    {showPw ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                {/* Strength bar (One logic, Two style) */}
                {newPassword && (
                  <div className="mt-1.5 space-y-0.5">
                    <div className="flex gap-0.5">
                      {[0,1,2,3].map(i => (
                        <div key={i} className="h-0.5 flex-1 transition-all"
                          style={{ backgroundColor: i < strength ? sColor[strength-1] : 'rgba(30,47,94,0.1)' }} />
                      ))}
                    </div>
                    <p className="text-[10px] font-medium" style={{ color: strength > 0 ? sColor[strength-1] : '#717182' }}>
                      {strength > 0 ? sLabel[strength-1] : "Too weak"}
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#2D6A4F' }}>
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    {confirmPassword
                      ? pwMatch
                        ? <CheckCircle className="w-3.5 h-3.5" style={{ color: '#22c55e' }} />
                        : <AlertCircle className="w-3.5 h-3.5" style={{ color: '#E76F51' }} />
                      : <Lock className="w-3.5 h-3.5" style={{ color: '#74C69D' }} />
                    }
                  </div>
                  <input
                    type={showConfirm ? "text" : "password"} value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password" required disabled={isLoading}
                    className="w-full pl-9 pr-9 py-2 text-sm outline-none transition-all"
                    style={{
                      backgroundColor: '#F8F9FA',
                      border: `1.5px solid ${confirmPassword && !pwMatch ? '#E76F51' : 'rgba(30,47,94,0.1)'}`,
                      color: '#1E2F5E',
                    }}
                    onFocus={e => { e.currentTarget.style.borderColor='#74C69D'; e.currentTarget.style.backgroundColor='#fff'; e.currentTarget.style.boxShadow='0 0 0 3px rgba(116,198,157,0.1)' }}
                    onBlur={e => {
                      e.currentTarget.style.borderColor = confirmPassword && !pwMatch ? '#E76F51' : 'rgba(30,47,94,0.1)'
                      e.currentTarget.style.backgroundColor='#F8F9FA'; e.currentTarget.style.boxShadow='none'
                    }}
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 transition-colors" style={{ color: '#717182' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#2D6A4F' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#717182' }}
                  >
                    {showConfirm ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <motion.button
                onClick={handleSubmit} disabled={isLoading || !canSubmit}
                whileHover={{ scale: isLoading || !canSubmit ? 1 : 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-bold text-white transition-all disabled:opacity-60 relative overflow-hidden group"
                style={{ backgroundColor: '#2D6A4F' }}
                onMouseEnter={e => { if (!isLoading && canSubmit) (e.currentTarget as HTMLElement).style.backgroundColor = '#1f4d37' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#2D6A4F' }}
              >
                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700 pointer-events-none" />
                {isLoading
                  ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /><span>Resetting…</span></>
                  : <><ShieldCheck className="w-3.5 h-3.5" /><span className="tracking-wide">Reset Password</span></>
                }
              </motion.button>
            </form>

            <div className="mt-4 pt-3 text-center" style={{ borderTop: '1px solid rgba(30,47,94,0.07)' }}>
              <p className="text-[11px]" style={{ color: '#717182' }}>
                Remember your password?{' '}
                <Link href="/login" className="font-semibold hover:underline" style={{ color: '#2D6A4F' }}>
                  Sign in
                </Link>
              </p>
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ResetPasswordForm />
    </Suspense>
  )
}