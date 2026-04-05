// components/auth/LoginModal.tsx
"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { X, Mail, Lock, Eye, EyeOff, Loader2, GraduationCap } from 'lucide-react'
import { GoogleLogin } from '@react-oauth/google'
import type { AppDispatch } from '@/lib/store'
import { loginCPD, loginWithGoogle } from '@/lib/features/auth/auth-slice'
import { toast } from 'sonner'
import Link from 'next/link'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  redirectTo: string
  message?: string
}

export function LoginModal({ isOpen, onClose, redirectTo, message }: LoginModalProps) {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (!credentialResponse.credential) {
      toast.error('Google login failed - no credential received')
      return
    }

    setIsLoading(true)
    
    try {
      const result = await dispatch(loginWithGoogle(credentialResponse.credential)).unwrap()
      
      toast.success(`Welcome ${result.user.first_name}!`)
      
      onClose()
      
      setTimeout(() => {
        router.push(redirectTo)
      }, 300)
      
    } catch (error: any) {
      toast.error(error || 'Google login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleError = () => {
    toast.error('Google login failed. Please try again.')
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setIsLoading(true)
    
    try {
      const result = await dispatch(loginCPD(formData)).unwrap()
      
      toast.success(`Welcome back, ${result.user.first_name}!`)
      
      onClose()
      
      setTimeout(() => {
        router.push(redirectTo)
      }, 300)
      
    } catch (error: any) {
      toast.error(error || 'Login failed. Please check your credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle escape key press
  useState(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  })

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - click to close */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
            onClick={onClose} // Click outside modal content closes it
          >
            {/* Modal Content - click stops propagation */}
            <div 
              className="relative w-full max-w-[400px]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Card */}
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Top accent bar */}
                <div className="h-1" style={{ background: 'linear-gradient(90deg, #2D6A4F 0%, #74C69D 50%, #2D6A4F 100%)' }} />

                {/* Close button - inside the card, top right */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-1.5 rounded-full transition-all z-10 hover:bg-gray-100"
                  style={{ color: '#717182' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#f3f4f6' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Header */}
                <div className="px-6 pt-6 pb-3 text-center">
                  <div className="flex justify-center mb-3">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ background: 'rgba(45,106,79,0.1)' }}
                    >
                      <GraduationCap className="w-6 h-6" style={{ color: '#2D6A4F' }} />
                    </div>
                  </div>
                  <h2 className="text-xl font-bold" style={{ color: '#1E2F5E' }}>
                    Welcome Back
                  </h2>
                  <p className="text-xs mt-1" style={{ color: '#717182' }}>
                    {message || "Sign in to continue your learning journey"}
                  </p>
                </div>

                {/* Body */}
                <div className="px-6 pb-6">
                  {/* Google Login */}
                  <div className="mb-4">
                    <div className="flex justify-center">
                      <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        type="standard"
                        theme="outline"
                        size="large"
                        text="continue_with"
                        shape="rectangular"
                        logo_alignment="left"
                        width="100%"
                      />
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t" style={{ borderColor: 'rgba(30,47,94,0.08)' }} />
                    </div>
                    <div className="relative flex justify-center text-[10px]">
                      <span className="px-3 bg-white" style={{ color: '#717182' }}>OR</span>
                    </div>
                  </div>

                  {/* Email Login Form */}
                  <form onSubmit={handleEmailLogin} className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#2D6A4F' }}>
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: '#74C69D' }} />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full pl-9 pr-3 py-2 text-sm outline-none transition-all rounded-lg"
                          style={{ 
                            backgroundColor: '#F8F9FA', 
                            border: '1.5px solid rgba(30,47,94,0.1)', 
                            color: '#1E2F5E' 
                          }}
                          placeholder="you@example.com"
                          required
                          disabled={isLoading}
                          onFocus={e => { 
                            e.currentTarget.style.borderColor = '#74C69D'
                            e.currentTarget.style.backgroundColor = '#fff'
                            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(116,198,157,0.1)'
                          }}
                          onBlur={e => { 
                            e.currentTarget.style.borderColor = 'rgba(30,47,94,0.1)'
                            e.currentTarget.style.backgroundColor = '#F8F9FA'
                            e.currentTarget.style.boxShadow = 'none'
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#2D6A4F' }}>
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: '#74C69D' }} />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          className="w-full pl-9 pr-9 py-2 text-sm outline-none transition-all rounded-lg"
                          style={{ 
                            backgroundColor: '#F8F9FA', 
                            border: '1.5px solid rgba(30,47,94,0.1)', 
                            color: '#1E2F5E' 
                          }}
                          placeholder="••••••••"
                          required
                          disabled={isLoading}
                          onFocus={e => { 
                            e.currentTarget.style.borderColor = '#74C69D'
                            e.currentTarget.style.backgroundColor = '#fff'
                            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(116,198,157,0.1)'
                          }}
                          onBlur={e => { 
                            e.currentTarget.style.borderColor = 'rgba(30,47,94,0.1)'
                            e.currentTarget.style.backgroundColor = '#F8F9FA'
                            e.currentTarget.style.boxShadow = 'none'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLoading}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 transition-colors"
                          style={{ color: '#717182' }}
                          onMouseEnter={e => { e.currentTarget.style.color = '#2D6A4F' }}
                          onMouseLeave={e => { e.currentTarget.style.color = '#717182' }}
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-0.5">
                      <Link
                        href="/forgot-password"
                        className="text-[10px] font-medium hover:underline transition-colors"
                        style={{ color: '#E76F51' }}
                      >
                        Forgot password?
                      </Link>
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      whileHover={{ scale: isLoading ? 1 : 1.01 }}
                      whileTap={{ scale: isLoading ? 1 : 0.99 }}
                      className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-bold text-white transition-all disabled:opacity-60 relative overflow-hidden group rounded-lg mt-2"
                      style={{ backgroundColor: '#2D6A4F' }}
                      onMouseEnter={e => { if (!isLoading) e.currentTarget.style.backgroundColor = '#1f4d37' }}
                      onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#2D6A4F' }}
                    >
                      <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700 pointer-events-none" />
                      {isLoading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Signing in...</span>
                        </>
                      ) : (
                        <>
                          <span className="tracking-wide">Sign In</span>
                        </>
                      )}
                    </motion.button>
                  </form>

                  {/* Sign up link */}
                  <div className="mt-4 pt-3 text-center" style={{ borderTop: '1px solid rgba(30,47,94,0.07)' }}>
                    <p className="text-[10px]" style={{ color: '#717182' }}>
                      Don't have an account?{' '}
                      <Link
                        href={`/register?redirect=${encodeURIComponent(redirectTo)}`}
                        className="font-semibold transition-colors hover:underline"
                        style={{ color: '#2D6A4F' }}
                        onClick={onClose}
                      >
                        Create an account
                      </Link>
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 text-center">
                  <p className="text-[9px]" style={{ color: '#717182' }}>
                    By signing in, you agree to our{' '}
                    <Link href="/terms" className="hover:underline" style={{ color: '#2D6A4F' }}>Terms</Link>
                    {' '}and{' '}
                    <Link href="/privacy" className="hover:underline" style={{ color: '#2D6A4F' }}>Privacy Policy</Link>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}