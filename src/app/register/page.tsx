"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { registerCPD, clearError } from "@/lib/features/auth/auth-slice"
import type { AppDispatch, RootState } from "@/lib/store"
import {
  Mail, Lock, Eye, EyeOff, AlertCircle, Loader2, ArrowRight,
  User, Phone, Globe, CheckCircle, Home, Check, ChevronRight,
  Users, GraduationCap, FileText, Clock, Stethoscope, CreditCard,ClipboardList 
} from "lucide-react"
import Link from "next/link"
import { GoogleOAuthProviderWrapper } from "@/components/auth/google-login"
import { toast } from "sonner"

// Health Specialist Areas
const HEALTH_SPECIALISTS = [
  "Doctor",
  "Nurse",
  "Pharmacist",
  "Dentist",
  "Lab Technician",
  "Radiologist",
  "Physiotherapist",
  "Public Health Officer",
  "Clinical Officer",
  "Midwife",
  "Other",
]

// Education Levels
const EDUCATION_LEVELS = [
  "High School / Secondary",
  "Diploma / Certificate",
  "Bachelor's Degree",
  "Master's Degree",
  "PhD / Doctorate",
  "Other",
]

const GENDERS = ["Male", "Female", "Prefer not to say", "Other"]

// Step configuration
const STEPS = [
  { id: 1, label: "Personal Info", icon: User },
  { id: 2, label: "Health Credentials", icon: Stethoscope },
  { id: 3, label: "Account Setup", icon: Lock },
  { id: 4, label: "Background", icon: GraduationCap },
]

// Application process steps for left panel
const appSteps = [
  { icon: ClipboardList, text: "Fill in your personal & health credentials" },
  { icon: Clock, text: "Admin reviews your application (24–48 hrs)" },
  { icon: Mail, text: "Get notified by email when approved" },
  { icon: GraduationCap, text: "Log in and start learning immediately" },
]

// Shared input style helpers
const iStyle = { backgroundColor: '#F8F9FA', border: '1.5px solid rgba(30,47,94,0.1)', color: '#1E2F5E' }
const iFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  e.currentTarget.style.borderColor = '#74C69D'
  e.currentTarget.style.backgroundColor = '#fff'
  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(116,198,157,0.1)'
}
const iBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  e.currentTarget.style.borderColor = 'rgba(30,47,94,0.1)'
  e.currentTarget.style.backgroundColor = '#F8F9FA'
  e.currentTarget.style.boxShadow = 'none'
}
const iClass = "w-full text-sm outline-none transition-all placeholder:text-gray-400"

// Password strength helper
function getStrength(pw: string) {
  let s = 0
  if (pw.length >= 8) s++
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++
  if (/[0-9]/.test(pw)) s++
  if (/[^a-zA-Z0-9]/.test(pw)) s++
  return s
}
const strengthColor = ["#ef4444", "#f59e0b", "#eab308", "#22c55e"]
const strengthLabel = ["Weak", "Fair", "Good", "Strong"]

// ECG line component
function EcgLine() {
  return (
    <svg viewBox="0 0 400 40" className="w-full" style={{ opacity: 0.22 }} preserveAspectRatio="none">
      <path
        d="M0,20 L65,20 L76,20 L83,5 L90,35 L97,10 L104,20 L155,20 L166,20 L173,6 L180,34 L187,11 L194,20 L248,20 L259,20 L266,7 L273,33 L280,12 L287,20 L400,20"
        stroke="#74C69D" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  )
}

export default function RegisterPage() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()

  const { isLoading, error, applicationSubmitted, applicationEmail } = useSelector(
    (state: RootState) => state.cpdAuth
  )

  const [step, setStep] = useState(1)
  const [agreed, setAgreed] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [form, setForm] = useState({
    // Personal Info
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    country: "",
    gender: "",
    // Health fields (always required)
    health_specialist: "",
    licence_number: "",
    // Account Setup
    password: "",
    confirm_password: "",
    // Background
    education_level: "",
    motivation: "",
  })

  useEffect(() => () => { dispatch(clearError()) }, [dispatch])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const pw = form.password
  const strength = getStrength(pw)
  const pwMatch = form.confirm_password && form.password === form.confirm_password

  // Step validation
  const step1Valid = form.first_name.trim() && form.last_name.trim() && form.email.trim() && 
                     form.phone_number.trim() && form.country.trim()
  const step2Valid = form.health_specialist && form.licence_number.trim()
  const step3Valid = form.password.length >= 8 && pwMatch
  const step4Valid = form.education_level && form.motivation.trim().length >= 20

  const canNext = () => {
    if (step === 1) return !!step1Valid
    if (step === 2) return !!step2Valid
    if (step === 3) return !!step3Valid
    return true
  }

  const handleNext = () => { if (step < 4) setStep(s => s + 1) }
  const handleBack = () => { if (step > 1) setStep(s => s - 1) }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreed) { toast.error("Please agree to the Terms of Service"); return }
    if (!step4Valid) { toast.error("Please fill all required fields"); return }
    try {
      await dispatch(registerCPD({
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        email: form.email.trim(),
        password: form.password,
        confirm_password: form.confirm_password,
        phone_number: form.phone_number || undefined,
        country: form.country || undefined,
        gender: form.gender || undefined,
        education_level: form.education_level || undefined,
        motivation: form.motivation,
        health_specialist: form.health_specialist,
        licence_number: form.licence_number,
      })).unwrap()
      toast.success("Application submitted! Check your email for confirmation.")
    } catch {}
  }

  // Application submitted success screen
  if (applicationSubmitted) {
    return (
      <div className="h-screen w-screen flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: '#F8F9FA' }}>
        <div className="absolute top-[-60px] left-[-60px] w-72 h-72 rounded-full pointer-events-none"
          style={{ backgroundColor: 'rgba(116,198,157,0.15)', filter: 'blur(60px)' }} />
        <div className="absolute bottom-[-60px] right-[-60px] w-72 h-72 rounded-full pointer-events-none"
          style={{ backgroundColor: 'rgba(231,111,81,0.10)', filter: 'blur(60px)' }} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-[400px] relative z-10 mx-4"
        >
          <div className="p-8" style={{
            backgroundColor: '#fff',
            border: '1px solid rgba(45,106,79,0.08)',
            boxShadow: '0 8px 32px -4px rgba(45,106,79,0.12)',
          }}>
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.15 }}
              className="w-14 h-14 flex items-center justify-center mx-auto mb-5"
              style={{ backgroundColor: 'rgba(116,198,157,0.15)', border: '2px solid rgba(116,198,157,0.4)' }}
            >
              <CheckCircle className="w-7 h-7" style={{ color: '#2D6A4F' }} />
            </motion.div>

            <h2 className="text-xl font-bold text-center mb-2" style={{ color: '#1E2F5E' }}>
              Application Submitted!
            </h2>
            <p className="text-sm text-center mb-4 leading-relaxed" style={{ color: '#717182' }}>
              Your application to join CPD eLearning has been received. Our admin team will review it within{' '}
              <strong style={{ color: '#1E2F5E' }}>24–48 hours</strong>.
            </p>

            <div className="p-3.5 mb-5"
              style={{ backgroundColor: 'rgba(45,106,79,0.05)', border: '1px solid rgba(45,106,79,0.15)' }}>
              <div className="flex items-center gap-2 mb-1.5">
                <Mail className="w-3.5 h-3.5" style={{ color: '#2D6A4F' }} />
                <span className="text-xs font-semibold" style={{ color: '#2D6A4F' }}>Confirmation sent to:</span>
              </div>
              <p className="text-sm font-mono" style={{ color: '#1E2F5E' }}>{applicationEmail}</p>
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#E9C46A' }} />
                <span className="text-xs" style={{ color: '#717182' }}>You will receive an email once a decision is made</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#2D6A4F' }} />
                <span className="text-xs" style={{ color: '#717182' }}>If approved, you can log in and start learning</span>
              </div>
            </div>

            <Link href="/login"
              className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-bold text-white transition-all relative overflow-hidden group"
              style={{ backgroundColor: '#2D6A4F' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#1f4d37' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#2D6A4F' }}
            >
              <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700 pointer-events-none" />
              <span className="tracking-wide">Go to Login</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <GoogleOAuthProviderWrapper>
      <div className="h-screen w-screen flex overflow-hidden" style={{ backgroundColor: '#F8F9FA' }}>

        {/* LEFT PANEL - Brand */}
        <div
          className="hidden lg:flex w-[40%] flex-col justify-between relative overflow-hidden px-9 py-8"
          style={{ backgroundColor: '#2D6A4F' }}
        >
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 65% 55% at 25% 35%, rgba(116,198,157,0.17) 0%, transparent 68%)' }} />
          <div className="absolute top-[-50px] right-[-50px] w-44 h-44 rounded-full pointer-events-none"
            style={{ backgroundColor: 'rgba(231,111,81,0.09)', filter: 'blur(40px)' }} />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 flex items-center justify-center"
                style={{ backgroundColor: 'rgba(255,255,255,0.13)', border: '1.5px solid rgba(255,255,255,0.27)' }}>
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-[15px] leading-none">
                  CPD<span style={{ color: '#74C69D' }}>Academy</span>
                </p>
                <p className="text-white/45 text-[9px] mt-0.5 tracking-widest uppercase">eLearning Platform</p>
              </div>
            </div>

            <h2 className="text-white font-bold leading-snug mb-1" style={{ fontSize: '1.55rem' }}>
              Join CPD eLearning<br />
              <span style={{ color: '#74C69D' }}>Healthcare Professionals</span>
            </h2>
            <svg width="115" height="7" viewBox="0 0 230 7" className="mb-3">
              <path d="M0,3.5 Q57.5,0 115,3.5 T230,3.5" stroke="#E76F51" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            </svg>
            <p className="text-white/55 text-[11.5px] leading-relaxed max-w-[210px]">
              Our admin team reviews each application to maintain the quality of our learning community.
            </p>
          </div>

          <div className="relative z-10 space-y-3">
            <EcgLine />
            <div className="space-y-2.5 pt-1">
              {appSteps.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-start gap-3">
                  <div className="w-7 h-7 flex-shrink-0 flex items-center justify-center mt-0.5"
                    style={{ backgroundColor: 'rgba(116,198,157,0.18)', border: '1px solid rgba(116,198,157,0.30)' }}>
                    <Icon className="w-3.5 h-3.5" style={{ color: '#74C69D' }} />
                  </div>
                  <p className="text-white/75 text-[11.5px] leading-snug pt-0.5">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10">
            <div className="w-full mb-3" style={{ borderTop: '1px solid rgba(255,255,255,0.11)' }} />
            <div className="flex items-center justify-between">
              {[['10K+', 'Learners'], ['100+', 'Courses'], ['35+', 'Institutions']].map(([n, l]) => (
                <div key={l} className="text-center">
                  <p className="text-white font-bold text-sm">{n}</p>
                  <p className="text-white/45 text-[10px]">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - Registration Form */}
        <div className="flex-1 flex flex-col justify-center items-center px-6 sm:px-10 relative overflow-y-auto"
          style={{ backgroundColor: '#F8F9FA' }}>

          <Link href="/"
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
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full max-w-[440px] py-16 lg:py-8"
          >
            {/* Mobile logo */}
            <div className="flex lg:hidden items-center gap-2 mb-4">
              <div className="w-8 h-8 flex items-center justify-center" style={{ backgroundColor: '#2D6A4F' }}>
                <GraduationCap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-sm" style={{ color: '#2D6A4F' }}>CPDAcademy</span>
            </div>

            {/* Heading */}
            <div className="mb-4">
              <h1 className="text-xl font-bold" style={{ color: '#1E2F5E' }}>
                Apply to{' '}
                <span className="relative inline-block" style={{ color: '#2D6A4F' }}>
                  CPD eLearning
                  <svg className="absolute left-0 w-full" style={{ bottom: '-2px' }} height="6" viewBox="0 0 120 6">
                    <path d="M0,3 Q30,0 60,3 T120,3" stroke="#E76F51" strokeWidth="2" fill="none" strokeLinecap="round"/>
                  </svg>
                </span>
              </h1>
              <p className="text-xs mt-1.5" style={{ color: '#717182' }}>Healthcare Professional application — Admin approval required</p>
            </div>

            {/* Error display */}
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

            {/* Form Card */}
            <div className="p-5" style={{
              backgroundColor: '#fff',
              border: '1px solid rgba(45,106,79,0.08)',
              boxShadow: '0 6px 28px -4px rgba(45,106,79,0.10)',
            }}>

              {/* Step Indicators */}
              <div className="flex items-center justify-between mb-4">
                {STEPS.map((s, i) => {
                  const Icon = s.icon
                  const active = step === s.id
                  const done = step > s.id
                  return (
                    <React.Fragment key={s.id}>
                      <div className="flex flex-col items-center gap-0.5">
                        <div
                          className="w-7 h-7 flex items-center justify-center transition-all text-xs font-bold"
                          style={{
                            backgroundColor: done ? '#22c55e' : active ? '#2D6A4F' : 'rgba(30,47,94,0.08)',
                            color: done || active ? '#fff' : '#717182',
                          }}
                        >
                          {done ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : <Icon className="w-3.5 h-3.5" />}
                        </div>
                        <span className="text-[9px] font-medium" style={{
                          color: active ? '#2D6A4F' : done ? '#22c55e' : '#717182',
                        }}>
                          {s.label}
                        </span>
                      </div>
                      {i < STEPS.length - 1 && (
                        <div className="flex-1 h-px mx-1 mb-3 transition-colors"
                          style={{ backgroundColor: step > s.id ? '#22c55e' : 'rgba(30,47,94,0.1)' }} />
                      )}
                    </React.Fragment>
                  )
                })}
              </div>

              <form onSubmit={handleSubmit}>
                <AnimatePresence mode="wait">

                  {/* STEP 1: Personal Info */}
                  {step === 1 && (
                    <motion.div key="step1"
                      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}
                      className="space-y-2.5"
                    >
                      <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#2D6A4F' }}>
                        Personal Information
                      </p>

                      {/* Name row */}
                      <div className="grid grid-cols-2 gap-2.5">
                        {(["first_name", "last_name"] as const).map((field, i) => (
                          <div key={field}>
                            <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: '#2D6A4F' }}>
                              {i === 0 ? 'First Name' : 'Last Name'} *
                            </label>
                            <div className="relative">
                              <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: '#74C69D' }} />
                              <input type="text" name={field} value={form[field]} onChange={handleChange}
                                placeholder={i === 0 ? 'First' : 'Last'} required disabled={isLoading}
                                className={`${iClass} pl-8 pr-2.5 py-2`} style={iStyle} onFocus={iFocus} onBlur={iBlur}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: '#2D6A4F' }}>
                          Email Address *
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: '#74C69D' }} />
                          <input type="email" name="email" value={form.email} onChange={handleChange}
                            placeholder="you@example.com" required disabled={isLoading}
                            className={`${iClass} pl-8 pr-3 py-2`} style={iStyle} onFocus={iFocus} onBlur={iBlur}
                          />
                        </div>
                      </div>

                      {/* Phone + Country */}
                      <div className="grid grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: '#2D6A4F' }}>
                            Phone *
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: '#74C69D' }} />
                            <input type="tel" name="phone_number" value={form.phone_number} onChange={handleChange}
                              placeholder="+1 234 567" required disabled={isLoading}
                              className={`${iClass} pl-8 pr-2.5 py-2`} style={iStyle} onFocus={iFocus} onBlur={iBlur}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: '#2D6A4F' }}>
                            Country *
                          </label>
                          <div className="relative">
                            <Globe className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: '#74C69D' }} />
                            <input type="text" name="country" value={form.country} onChange={handleChange}
                              placeholder="Rwanda" required disabled={isLoading}
                              className={`${iClass} pl-8 pr-2.5 py-2`} style={iStyle} onFocus={iFocus} onBlur={iBlur}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Gender */}
                      <div>
                        <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: '#717182' }}>
                          Gender <span className="normal-case font-normal text-[9px]">(opt.)</span>
                        </label>
                        <div className="relative">
                          <Users className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: '#74C69D' }} />
                          <select name="gender" value={form.gender} onChange={handleChange} disabled={isLoading}
                            className={`${iClass} pl-8 pr-2.5 py-2`} style={iStyle} onFocus={iFocus} onBlur={iBlur}
                          >
                            <option value="">Select…</option>
                            {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                          </select>
                        </div>
                      </div>

                      <motion.button type="button" onClick={handleNext} disabled={!canNext()}
                        whileHover={{ scale: canNext() ? 1.01 : 1 }} whileTap={{ scale: 0.99 }}
                        className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-bold text-white transition-all disabled:opacity-50 relative overflow-hidden group mt-1"
                        style={{ backgroundColor: '#2D6A4F' }}
                        onMouseEnter={e => { if (canNext()) (e.currentTarget as HTMLElement).style.backgroundColor = '#1f4d37' }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#2D6A4F' }}
                      >
                        <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700 pointer-events-none" />
                        <span className="tracking-wide">Next: Health Credentials</span>
                        <ChevronRight className="w-4 h-4" />
                      </motion.button>
                    </motion.div>
                  )}

                  {/* STEP 2: Health Credentials (Always required) */}
                  {step === 2 && (
                    <motion.div key="step2"
                      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}
                      className="space-y-3"
                    >

                      <div>
                        <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: '#2D6A4F' }}>
                          Specialist Area *
                        </label>
                        <div className="relative">
                          <Stethoscope className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: '#74C69D' }} />
                          <select name="health_specialist" value={form.health_specialist} onChange={handleChange}
                            required disabled={isLoading}
                            className={`${iClass} pl-8 pr-2.5 py-2`} style={iStyle} onFocus={iFocus} onBlur={iBlur}
                          >
                            <option value="">Select your specialist area</option>
                            {HEALTH_SPECIALISTS.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                      </div>

                      {/* Licence Number */}
                      <div>
                        <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: '#2D6A4F' }}>
                          Licence / Registration Number *
                        </label>
                        <div className="relative">
                          <CreditCard className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: '#74C69D' }} />
                          <input type="text" name="licence_number" value={form.licence_number} onChange={handleChange}
                            placeholder="e.g., RMD-2024-001234" required disabled={isLoading}
                            className={`${iClass} pl-8 pr-2.5 py-2`} style={iStyle} onFocus={iFocus} onBlur={iBlur}
                          />
                        </div>
                        <p className="text-[9px] mt-0.5" style={{ color: '#717182' }}>
                          Your professional licence/registration number from your governing body
                        </p>
                      </div>

                      <div className="flex gap-2 pt-1">
                        <button type="button" onClick={handleBack}
                          className="flex-1 py-2.5 text-sm font-medium transition-all"
                          style={{ border: '1.5px solid rgba(45,106,79,0.2)', color: '#2D6A4F', backgroundColor: 'transparent' }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(45,106,79,0.05)' }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}
                        >
                          Back
                        </button>
                        <motion.button type="button" onClick={handleNext} disabled={!canNext()}
                          whileHover={{ scale: canNext() ? 1.01 : 1 }} whileTap={{ scale: 0.99 }}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold text-white transition-all disabled:opacity-50 relative overflow-hidden group"
                          style={{ backgroundColor: '#2D6A4F' }}
                          onMouseEnter={e => { if (canNext()) (e.currentTarget as HTMLElement).style.backgroundColor = '#1f4d37' }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#2D6A4F' }}
                        >
                          <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700 pointer-events-none" />
                          <span className="tracking-wide">Next: Account Setup</span>
                          <ChevronRight className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 3: Account Setup (Password) */}
                  {step === 3 && (
                    <motion.div key="step3"
                      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}
                      className="space-y-2.5"
                    >
                      <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#2D6A4F' }}>
                        Create Password
                      </p>

                      {/* Password */}
                      <div>
                        <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: '#2D6A4F' }}>
                          Password *
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: '#74C69D' }} />
                          <input type={showPw ? "text" : "password"} name="password" value={form.password}
                            onChange={handleChange} placeholder="Min 8 characters" required disabled={isLoading}
                            className={`${iClass} pl-8 pr-9 py-2`} style={iStyle} onFocus={iFocus} onBlur={iBlur}
                          />
                          <button type="button" onClick={() => setShowPw(!showPw)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 transition-colors"
                            style={{ color: '#717182' }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#2D6A4F' }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#717182' }}
                          >
                            {showPw ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                        {pw && (
                          <div className="mt-1.5 space-y-0.5">
                            <div className="flex gap-0.5">
                              {[0,1,2,3].map(i => (
                                <div key={i} className="h-0.5 flex-1 transition-all"
                                  style={{ backgroundColor: i < strength ? strengthColor[strength-1] : 'rgba(30,47,94,0.1)' }} />
                              ))}
                            </div>
                            <p className="text-[10px] font-medium" style={{ color: strength > 0 ? strengthColor[strength-1] : '#717182' }}>
                              {strength > 0 ? strengthLabel[strength-1] : "Too weak"}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Confirm password */}
                      <div>
                        <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: '#2D6A4F' }}>
                          Confirm Password *
                        </label>
                        <div className="relative">
                          <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                            {form.confirm_password
                              ? pwMatch
                                ? <CheckCircle className="w-3.5 h-3.5" style={{ color: '#22c55e' }} />
                                : <AlertCircle className="w-3.5 h-3.5" style={{ color: '#E76F51' }} />
                              : <Lock className="w-3.5 h-3.5" style={{ color: '#74C69D' }} />
                            }
                          </div>
                          <input type={showConfirm ? "text" : "password"} name="confirm_password"
                            value={form.confirm_password} onChange={handleChange}
                            placeholder="Repeat password" required disabled={isLoading}
                            className={`${iClass} pl-8 pr-9 py-2`}
                            style={{ ...iStyle, borderColor: form.confirm_password && !pwMatch ? '#E76F51' : 'rgba(30,47,94,0.1)' }}
                            onFocus={iFocus} onBlur={iBlur}
                          />
                          <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 transition-colors"
                            style={{ color: '#717182' }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#2D6A4F' }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#717182' }}
                          >
                            {showConfirm ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-1">
                        <button type="button" onClick={handleBack}
                          className="flex-1 py-2.5 text-sm font-medium transition-all"
                          style={{ border: '1.5px solid rgba(45,106,79,0.2)', color: '#2D6A4F', backgroundColor: 'transparent' }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(45,106,79,0.05)' }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}
                        >
                          Back
                        </button>
                        <motion.button type="button" onClick={handleNext} disabled={!canNext()}
                          whileHover={{ scale: canNext() ? 1.01 : 1 }} whileTap={{ scale: 0.99 }}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold text-white transition-all disabled:opacity-50 relative overflow-hidden group"
                          style={{ backgroundColor: '#2D6A4F' }}
                          onMouseEnter={e => { if (canNext()) (e.currentTarget as HTMLElement).style.backgroundColor = '#1f4d37' }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#2D6A4F' }}
                        >
                          <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700 pointer-events-none" />
                          <span className="tracking-wide">Next: Background</span>
                          <ChevronRight className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 4: Background & Motivation */}
                  {step === 4 && (
                    <motion.div key="step4"
                      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}
                      className="space-y-2.5"
                    >
                      <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#2D6A4F' }}>
                        Academic Background &amp; Motivation
                      </p>

                      {/* Education Level */}
                      <div>
                        <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: '#2D6A4F' }}>
                          Education Level *
                        </label>
                        <div className="relative">
                          <GraduationCap className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: '#74C69D' }} />
                          <select name="education_level" value={form.education_level} onChange={handleChange}
                            required disabled={isLoading}
                            className={`${iClass} pl-8 pr-3 py-2`} style={iStyle} onFocus={iFocus} onBlur={iBlur}
                          >
                            <option value="">Select education level</option>
                            {EDUCATION_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                          </select>
                        </div>
                      </div>

                      {/* Motivation */}
                      <div>
                        <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: '#2D6A4F' }}>
                          Motivation *
                        </label>
                        <div className="relative">
                          <FileText className="absolute left-2.5 top-3 w-3.5 h-3.5 pointer-events-none" style={{ color: '#74C69D' }} />
                          <textarea name="motivation" value={form.motivation} onChange={handleChange}
                            placeholder="Why do you want to join CPD eLearning? (min 20 characters)"
                            required rows={3} disabled={isLoading}
                            className={`${iClass} pl-8 pr-3 py-2 resize-none`} style={iStyle} onFocus={iFocus} onBlur={iBlur}
                          />
                        </div>
                        <div className="flex justify-end mt-0.5">
                          <span className="text-[10px] font-medium" style={{ color: form.motivation.length >= 20 ? '#22c55e' : '#717182' }}>
                            {form.motivation.length}/20 min
                          </span>
                        </div>
                      </div>

                      {/* Terms */}
                      <label className="flex items-start gap-2 cursor-pointer pt-0.5">
                        <div
                          onClick={() => !isLoading && setAgreed(!agreed)}
                          className="mt-0.5 w-3.5 h-3.5 flex-shrink-0 flex items-center justify-center cursor-pointer transition-all"
                          style={{ backgroundColor: agreed ? '#2D6A4F' : '#fff', border: `2px solid ${agreed ? '#2D6A4F' : 'rgba(30,47,94,0.2)'}` }}
                        >
                          {agreed && <Check className="w-2 h-2 text-white" strokeWidth={3} />}
                        </div>
                        <span className="text-[11px] leading-snug select-none" style={{ color: '#717182' }}>
                          I agree to the{' '}
                          <Link href="/terms" className="font-semibold hover:underline" style={{ color: '#E76F51' }}>Terms of Service</Link>
                          {' '}and{' '}
                          <Link href="/privacy" className="font-semibold hover:underline" style={{ color: '#E76F51' }}>Privacy Policy</Link>
                        </span>
                      </label>

                      <div className="flex gap-2 pt-1">
                        <button type="button" onClick={handleBack}
                          className="flex-1 py-2.5 text-sm font-medium transition-all"
                          style={{ border: '1.5px solid rgba(45,106,79,0.2)', color: '#2D6A4F', backgroundColor: 'transparent' }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(45,106,79,0.05)' }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}
                        >
                          Back
                        </button>
                        <motion.button
                          type="submit" onClick={handleSubmit}
                          disabled={isLoading || !step4Valid || !agreed}
                          whileHover={{ scale: isLoading || !step4Valid || !agreed ? 1 : 1.01 }}
                          whileTap={{ scale: isLoading ? 1 : 0.99 }}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold text-white transition-all disabled:opacity-60 relative overflow-hidden group"
                          style={{ backgroundColor: '#2D6A4F' }}
                          onMouseEnter={e => { if (!isLoading && step4Valid && agreed) (e.currentTarget as HTMLElement).style.backgroundColor = '#1f4d37' }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#2D6A4F' }}
                        >
                          <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700 pointer-events-none" />
                          {isLoading
                            ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /><span>Submitting…</span></>
                            : <><span className="tracking-wide">Submit Application</span><ArrowRight className="w-3.5 h-3.5" /></>
                          }
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>

              {/* Sign in link */}
              <div className="mt-4 pt-3 text-center" style={{ borderTop: '1px solid rgba(30,47,94,0.07)' }}>
                <p className="text-[11px]" style={{ color: '#717182' }}>
                  Already have an approved account?{' '}
                  <Link href="/login" className="font-semibold hover:underline" style={{ color: '#2D6A4F' }}>
                    Sign in
                  </Link>
                </p>
              </div>
            </div>

            <p className="text-center mt-3 text-[11px]" style={{ color: '#717182' }}>
              <Link href="/" className="hover:underline">← Back to Home</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </GoogleOAuthProviderWrapper>
  )
}