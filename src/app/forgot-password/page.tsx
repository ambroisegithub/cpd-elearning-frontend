"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { requestPasswordChange, clearError } from "@/lib/features/auth/auth-slice"
import type { AppDispatch, RootState } from "@/lib/store"
import {
  Mail, Loader2, AlertCircle, ArrowLeft, ArrowRight,
  KeyRound, GraduationCap, ShieldCheck, CheckCircle
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

/* ── ECG line ─────────────────────────────────────────────────────────── */
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

/* ── Recovery steps ──────────────────────────────────────────────────── */
const steps = [
  { n: "1", title: "Enter your email",   desc: "We'll look up your account"          },
  { n: "2", title: "Receive a code",     desc: "Check your inbox for a 6-digit OTP"  },
  { n: "3", title: "Set new password",   desc: "Choose a strong, secure password"    },
]

export default function CPDForgotPasswordPage() {
  const router   = useRouter()
  const dispatch = useDispatch<AppDispatch>()
   const { isLoading, error } = useSelector((state: RootState) => state.cpdAuth)


  const [email, setEmail] = useState("")
  const [sent, setSent]   = useState(false)

  useEffect(() => () => { dispatch(clearError()) }, [dispatch])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    try {
      await dispatch(requestPasswordChange(email.toLowerCase().trim())).unwrap()
      setSent(true)
      toast.success("Verification code sent! Check your email.")
    } catch {
      // shown via redux state
    }
  }

  /* ── Sent / success state ── */
  if (sent) {
    return (
      <div className="h-screen w-screen flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: '#F8F9FA' }}>
        {/* Soft blobs */}
        <div className="absolute top-[-60px] left-[-60px] w-72 h-72 rounded-full pointer-events-none"
          style={{ backgroundColor: 'rgba(116,198,157,0.15)', filter: 'blur(60px)' }} />
        <div className="absolute bottom-[-60px] right-[-60px] w-72 h-72 rounded-full pointer-events-none"
          style={{ backgroundColor: 'rgba(231,111,81,0.10)', filter: 'blur(60px)' }} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-[380px] relative z-10 mx-4"
        >
          <div className="p-7" style={{
            backgroundColor: '#fff',
            border: '1px solid rgba(45,106,79,0.08)',
            boxShadow: '0 8px 32px -4px rgba(45,106,79,0.12)',
          }}>
            {/* Icon */}
            <div className="flex flex-col items-center mb-5">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.1 }}
                className="w-14 h-14 flex items-center justify-center mb-3"
                style={{ backgroundColor: 'rgba(116,198,157,0.15)', border: '2px solid rgba(116,198,157,0.4)' }}
              >
                <Mail className="w-6 h-6" style={{ color: '#2D6A4F' }} />
              </motion.div>
              <h1 className="text-xl font-bold" style={{ color: '#1E2F5E' }}>Check your email</h1>
              <p className="text-xs mt-1 text-center" style={{ color: '#717182' }}>
                We sent a code to{' '}
                <span className="font-semibold" style={{ color: '#2D6A4F' }}>{email}</span>
              </p>
            </div>

            {/* Info box */}
            <div className="p-3 mb-4" style={{
              backgroundColor: 'rgba(116,198,157,0.08)',
              border: '1px solid rgba(116,198,157,0.3)',
            }}>
              <p className="text-xs text-center leading-relaxed" style={{ color: '#2D6A4F' }}>
                Enter the 6-digit code along with your new password on the next page.
              </p>
            </div>

            {/* CTA */}
            <motion.button
              onClick={() => router.push(`/reset-password?email=${encodeURIComponent(email)}`)}
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-bold text-white mb-3 transition-all relative overflow-hidden group"
              style={{ backgroundColor: '#2D6A4F' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#1f4d37' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#2D6A4F' }}
            >
              <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700 pointer-events-none" />
              <span>Enter Reset Code</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.button>

            <button
              onClick={() => setSent(false)}
              className="w-full flex items-center justify-center gap-1.5 text-xs transition-colors"
              style={{ color: '#717182' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#2D6A4F' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#717182' }}
            >
              <ArrowLeft className="w-3 h-3" /> Use a different email
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  /* ── Main two-column layout ── */
  return (
    <div className="h-screen w-screen flex overflow-hidden" style={{ backgroundColor: '#F8F9FA' }}>

      {/* ╔══════════════════════════════╗
          ║  LEFT — Health brand panel  ║
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
              <p className="text-white font-bold text-[15px] leading-none">CPD Academy</p>
              <p className="text-white/45 text-[9px] mt-0.5 tracking-widest uppercase">Health eLearning</p>
            </div>
          </div>

          <h2 className="text-white font-bold leading-snug text-[1.55rem] mb-1">
            Recover Your<br />
            <span style={{ color: '#74C69D' }}>Account Access</span>
          </h2>
          <svg width="115" height="7" viewBox="0 0 230 7" className="mb-3">
            <path d="M0,3.5 Q57.5,0 115,3.5 T230,3.5" stroke="#E76F51" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          </svg>
          <p className="text-white/55 text-[11.5px] leading-relaxed max-w-[205px]">
            Secure account recovery for healthcare professionals.
          </p>
        </div>

        {/* MIDDLE — ECG + steps */}
        <div className="relative z-10 space-y-3">
          <EcgLine />
          <div className="space-y-2.5 pt-1">
            {steps.map(({ n, title, desc }) => (
              <div key={n} className="flex items-start gap-3">
                <div className="w-7 h-7 flex-shrink-0 flex items-center justify-center text-white font-bold text-xs"
                  style={{ backgroundColor: 'rgba(116,198,157,0.22)', border: '1px solid rgba(116,198,157,0.38)' }}>
                  {n}
                </div>
                <div>
                  <p className="text-white text-[12px] font-semibold leading-none">{title}</p>
                  <p className="text-white/45 text-[10px] mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM — stats */}
        <div className="relative z-10">
          <div className="w-full mb-3.5" style={{ borderTop: '1px solid rgba(255,255,255,0.11)' }} />
          <div className="flex items-center justify-between">
            {[['12K+','Professionals'],['200+','CPD Hours'],['50+','Specialties']].map(([n, l]) => (
              <div key={l} className="text-center">
                <p className="text-white font-bold text-sm">{n}</p>
                <p className="text-white/45 text-[10px]">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ╔══════════════════════════════╗
          ║  RIGHT — Form               ║
          ╚══════════════════════════════╝ */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 sm:px-10 relative"
        style={{ backgroundColor: '#F8F9FA' }}>

        {/* Back to login */}
        <Link href="/login"
          className="absolute top-5 left-5 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-all group"
          style={{ backgroundColor: 'rgba(45,106,79,0.08)', border: '1px solid rgba(45,106,79,0.18)', color: '#2D6A4F' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(45,106,79,0.14)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(45,106,79,0.08)' }}
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Login</span>
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
            <span className="font-bold text-sm" style={{ color: '#2D6A4F' }}>CPD Academy</span>
          </div>

          {/* Heading */}
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 flex items-center justify-center" style={{ backgroundColor: 'rgba(116,198,157,0.15)', border: '1px solid rgba(116,198,157,0.3)' }}>
                <KeyRound className="w-4 h-4" style={{ color: '#2D6A4F' }} />
              </div>
              <h1 className="text-xl font-bold" style={{ color: '#1E2F5E' }}>
                Forgot{' '}
                <span className="relative inline-block" style={{ color: '#2D6A4F' }}>
                  Password?
                  <svg className="absolute left-0 w-full" style={{ bottom: '-3px' }} height="6" viewBox="0 0 100 6">
                    <path d="M0,3 Q25,0 50,3 T100,3" stroke="#E76F51" strokeWidth="2" fill="none" strokeLinecap="round"/>
                  </svg>
                </span>
              </h1>
            </div>
            <p className="text-xs mt-1.5" style={{ color: '#717182' }}>
              Enter your email and we'll send a verification code
            </p>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
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

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#2D6A4F' }}>
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: '#74C69D' }} />
                  <input
                    type="email" value={email} onChange={e => setEmail(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSubmit(e as any)}
                    placeholder="email@institution.com" required disabled={isLoading}
                    className="w-full pl-9 pr-3 py-2 text-sm outline-none transition-all"
                    style={{ backgroundColor: '#F8F9FA', border: '1.5px solid rgba(30,47,94,0.1)', color: '#1E2F5E' }}
                    onFocus={e => { e.currentTarget.style.borderColor='#74C69D'; e.currentTarget.style.backgroundColor='#fff'; e.currentTarget.style.boxShadow='0 0 0 3px rgba(116,198,157,0.1)' }}
                    onBlur={e => { e.currentTarget.style.borderColor='rgba(30,47,94,0.1)'; e.currentTarget.style.backgroundColor='#F8F9FA'; e.currentTarget.style.boxShadow='none' }}
                  />
                </div>
              </div>

              <motion.button
                onClick={handleSubmit} disabled={isLoading || !email.trim()}
                whileHover={{ scale: isLoading || !email.trim() ? 1 : 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-bold text-white transition-all disabled:opacity-60 relative overflow-hidden group"
                style={{ backgroundColor: '#2D6A4F' }}
                onMouseEnter={e => { if (!isLoading && email.trim()) (e.currentTarget as HTMLElement).style.backgroundColor='#1f4d37' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor='#2D6A4F' }}
              >
                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700 pointer-events-none" />
                {isLoading
                  ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /><span>Sending code…</span></>
                  : <><span className="tracking-wide">Send Reset Code</span><ArrowRight className="w-3.5 h-3.5" /></>
                }
              </motion.button>
            </form>

            {/* Footer links */}
            <div className="flex items-center justify-between mt-4 pt-3.5" style={{ borderTop: '1px solid rgba(30,47,94,0.07)' }}>
              <Link href="/login" className="text-[11px] transition-colors hover:underline" style={{ color: '#717182' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color='#2D6A4F' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color='#717182' }}
              >
                Back to Sign In
              </Link>
              <Link href="/register" className="text-[11px] font-semibold hover:underline transition-colors" style={{ color: '#2D6A4F' }}>
                Create account
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}