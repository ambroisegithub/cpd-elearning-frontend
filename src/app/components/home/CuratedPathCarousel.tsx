"use client"

import { Clock, Users, Star, ArrowRight, BookOpen, Loader2, AlertCircle } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import type { RootState } from '@/lib/store'
import { LoginModal } from '@/components/auth/LoginModal'
import { Skeleton } from '@/components/ui/skeleton'

interface BackendCourse {
  id: string
  title: string
  description: string
  thumbnail_url: string
  category: string
  level: string
  cpd_hours: string
  enrollment_count: number
  average_rating: string
  instructor: {
    first_name: string
    last_name: string
  }
}

// Skeleton for the carousel loading state
const CarouselSkeleton = () => (
  <div className="max-w-7xl mx-auto">
    {/* Section header */}
    <div className="flex items-end justify-between mb-10">
      <div>
        <Skeleton className="h-3 w-24 mb-2 bg-gray-200/70" />
        <Skeleton className="h-8 w-64 bg-gray-200/70" />
      </div>
      <Skeleton className="hidden md:block h-6 w-32 bg-gray-200/70" />
    </div>

    {/* Carousel cards */}
    <div 
      className="flex overflow-x-auto gap-5 pb-4"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <div 
          key={i} 
          className="flex-shrink-0 rounded-xl overflow-hidden bg-white/80 backdrop-blur-sm"
          style={{ width: '17.5rem' }}
        >
          {/* Thumbnail skeleton */}
          <Skeleton className="h-36 w-full rounded-t-xl bg-gray-200/70" />
          
          {/* Card body */}
          <div className="p-4 space-y-3">
            {/* Title skeleton */}
            <Skeleton className="h-5 w-full bg-gray-200/70" />
            <Skeleton className="h-5 w-3/4 bg-gray-200/70" />
            
            {/* Category badge skeleton */}
            <Skeleton className="h-6 w-20 rounded-full bg-gray-200/70" />
            
            {/* Description skeleton */}
            <Skeleton className="h-3 w-full bg-gray-200/70" />
            <Skeleton className="h-3 w-5/6 bg-gray-200/70" />
            
            {/* Instructor skeleton */}
            <div className="flex items-center gap-2 pt-1">
              <Skeleton className="w-6 h-6 rounded bg-gray-200/70" />
              <Skeleton className="h-3 w-24 bg-gray-200/70" />
            </div>
            
            {/* Divider */}
            <Skeleton className="h-px w-full bg-gray-200/50" />
            
            {/* Meta row skeleton */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-3">
                <Skeleton className="h-3 w-16 bg-gray-200/70" />
                <Skeleton className="h-3 w-12 bg-gray-200/70" />
              </div>
              <Skeleton className="h-4 w-10 bg-gray-200/70" />
            </div>
            
            {/* Progress bar skeleton */}
            <Skeleton className="h-0.5 w-full bg-gray-200/70 mt-2" />
          </div>
        </div>
      ))}
    </div>

    {/* Scroll hint skeleton */}
    <Skeleton className="h-4 w-64 mx-auto mt-3 bg-gray-200/70" />
  </div>
)

export function CuratedPathCarousel() {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const [courses, setCourses] = useState<BackendCourse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null)
  
  const { isAuthenticated } = useSelector((state: RootState) => state.cpdAuth)
useEffect(() => {
  const fetchCourses = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/all`)
      if (!res.ok) throw new Error(`Failed to fetch courses (${res.status})`)
      const json = await res.json()
      if (json.success && json.data?.courses) {
        setCourses(json.data.courses)
      } else {
        throw new Error('Unexpected response format')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load courses')
    } finally {
      setLoading(false)
    }
  }
  fetchCourses()
}, [])

  const handleCourseClick = (courseId: string) => {
    if (!isAuthenticated) {
      setSelectedCourseId(courseId)
      setIsLoginModalOpen(true)
    } else {
      window.location.href = `/courses/${courseId}`
    }
  }

  const handleLoginModalClose = () => {
    setIsLoginModalOpen(false)
    setSelectedCourseId(null)
  }

  return (
    <>
      <div className="max-w-7xl mx-auto">
        {/* Loading state with skeleton */}
        {loading && <CarouselSkeleton />}

        {/* Error state */}
        {!loading && error && (
          <div>
            {/* Section header */}
            <div className="flex items-end justify-between mb-10">
              <div>
                <div className="cpd-eyebrow">Featured Content</div>
                <h2 className="cpd-heading">
                  CPD-Accredited{' '}
                  <span className="relative inline-block">
                    <span style={{ color: '#2D6A4F' }}>Courses</span>
                    <svg
                      className="absolute -bottom-1 left-0 w-full"
                      height="6"
                      viewBox="0 0 300 6"
                      style={{ transform: 'translateY(4px)' }}
                    >
                      <path
                        d="M0,3 Q75,1 150,3 T300,3"
                        stroke="#E76F51"
                        strokeWidth="4"
                        fill="none"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </h2>
              </div>
              <Link
                href="/courses"
                className="hidden md:flex items-center gap-1.5 text-xs font-semibold group transition-colors"
                style={{ color: '#2D6A4F' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#1f4d37' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#2D6A4F' }}
              >
                View all courses
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
            
            <div className="flex flex-col items-center py-20 gap-3">
              <div
                className="w-10 h-10 flex items-center justify-center"
                style={{ background: 'rgba(231,111,81,0.08)' }}
              >
                <AlertCircle className="w-5 h-5" style={{ color: '#E76F51' }} />
              </div>
              <p className="text-xs font-medium" style={{ color: '#717182' }}>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="text-xs font-semibold underline"
                style={{ color: '#2D6A4F' }}
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {/* Carousel */}
        {!loading && !error && courses.length > 0 && (
          <>
            {/* Section header */}
            <div className="flex items-end justify-between mb-10">
              <div>
                <div className="cpd-eyebrow">Featured Content</div>
                <h2 className="cpd-heading">
                  CPD-Accredited{' '}
                  <span className="relative inline-block">
                    <span style={{ color: '#2D6A4F' }}>Courses</span>
                    <svg
                      className="absolute -bottom-1 left-0 w-full"
                      height="6"
                      viewBox="0 0 300 6"
                      style={{ transform: 'translateY(4px)' }}
                    >
                      <path
                        d="M0,3 Q75,1 150,3 T300,3"
                        stroke="#E76F51"
                        strokeWidth="4"
                        fill="none"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </h2>
              </div>
              <Link
                href="/courses"
                className="hidden md:flex items-center gap-1.5 text-xs font-semibold group transition-colors"
                style={{ color: '#2D6A4F' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#1f4d37' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#2D6A4F' }}
              >
                View all courses
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            <div
              ref={scrollRef}
              className="cpd-hscroll"
              style={{ gap: '1.25rem', paddingBottom: '1rem' }}
            >
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="cpd-course-card cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
                  style={{ width: '17.5rem', flexShrink: 0 }}
                  onClick={() => handleCourseClick(course.id)}
                >
                  {/* Image */}
                  <div className="course-img-wrap">
                    <img
                      src={course.thumbnail_url}
                      alt={course.title}
                    />
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: 'linear-gradient(180deg, transparent 50%, rgba(30,47,94,0.35) 100%)',
                      }}
                    />
                    {/* Level badge - only level on image */}
                    <span
                      className="cpd-badge cpd-badge-solid-navy"
                      style={{
                        position: 'absolute',
                        top: '0.75rem',
                        right: '0.75rem',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {course.level}
                    </span>
                  </div>

                  {/* Card body */}
                  <div className="course-body">
                    {/* Title */}
                    <h3
                      className="font-bold leading-snug mb-2 line-clamp-2"
                      style={{
                        color: '#1E2F5E',
                        fontSize: '0.875rem',
                        minHeight: '2.5rem',
                      }}
                    >
                      {course.title}
                    </h3>

                    {/* Category badge - now under title */}
                    <div className="mb-3">
                      <span
                        className="cpd-badge cpd-badge-solid-green"
                        style={{
                          letterSpacing: '0.04em',
                          fontSize: '0.7rem',
                          padding: '0.25rem 0.75rem',
                        }}
                      >
                        {course.category}
                      </span>
                    </div>

                    {/* Description */}
                    <p
                      className="text-[11px] line-clamp-2 mb-3 leading-relaxed"
                      style={{ color: '#717182' }}
                    >
                      {course.description}
                    </p>

                    {/* Instructor */}
                    <div className="flex items-center gap-1.5 mb-3">
                      <div
                        className="cpd-icon-box cpd-icon-box-sm flex-shrink-0"
                        style={{ background: 'rgba(45,106,79,0.1)', width: '1.5rem', height: '1.5rem' }}
                      >
                        <BookOpen className="w-3 h-3" style={{ color: '#2D6A4F' }} />
                      </div>
                      <p className="text-[10px]" style={{ color: '#717182' }}>
                        By{' '}
                        <span className="font-semibold" style={{ color: '#2D6A4F' }}>
                          {course.instructor.first_name} {course.instructor.last_name}
                        </span>
                      </p>
                    </div>

                    {/* Separator */}
                    <div style={{ height: '1px', background: 'rgba(30,47,94,0.07)', marginBottom: '0.75rem' }} />

                    {/* Meta row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-[11px]" style={{ color: '#717182' }}>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" style={{ color: '#74C69D' }} />
                          {course.cpd_hours}h CPD
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" style={{ color: '#74C69D' }} />
                          {course.enrollment_count.toLocaleString()}
                        </span>
                      </div>
                      <span
                        className="flex items-center gap-0.5 text-[11px] font-bold"
                        style={{ color: '#1E2F5E' }}
                      >
                        <Star
                          className="w-3 h-3 fill-current"
                          style={{ color: '#E9C46A' }}
                        />
                        {parseFloat(course.average_rating).toFixed(1)}
                      </span>
                    </div>

                    {/* Progress bar — visual flair */}
                    <div
                      className="mt-3 overflow-hidden"
                      style={{ height: '2px', background: 'rgba(30,47,94,0.07)' }}
                    >
                      <div
                        style={{
                          width: '0%',
                          height: '100%',
                          background: 'linear-gradient(90deg, #2D6A4F, #74C69D)',
                          transition: 'width 0.7s ease',
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Scroll hint */}
            <p
              className="text-center mt-3 text-[11px] flex items-center justify-center gap-2"
              style={{ color: '#717182' }}
            >
              <ArrowRight className="w-3 h-3 rotate-180 opacity-60" />
              Scroll to explore more courses
              <ArrowRight className="w-3 h-3 opacity-60" />
            </p>
          </>
        )}

        {/* Empty state */}
        {!loading && !error && courses.length === 0 && (
          <>
            {/* Section header */}
            <div className="flex items-end justify-between mb-10">
              <div>
                <div className="cpd-eyebrow">Featured Content</div>
                <h2 className="cpd-heading">
                  CPD-Accredited{' '}
                  <span className="relative inline-block">
                    <span style={{ color: '#2D6A4F' }}>Courses</span>
                    <svg
                      className="absolute -bottom-1 left-0 w-full"
                      height="6"
                      viewBox="0 0 300 6"
                      style={{ transform: 'translateY(4px)' }}
                    >
                      <path
                        d="M0,3 Q75,1 150,3 T300,3"
                        stroke="#E76F51"
                        strokeWidth="4"
                        fill="none"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </h2>
              </div>
            </div>
            
            <div className="flex flex-col items-center py-20 gap-3">
              <div
                className="w-10 h-10 flex items-center justify-center"
                style={{ background: 'rgba(30,47,94,0.05)' }}
              >
                <BookOpen className="w-5 h-5" style={{ color: 'rgba(30,47,94,0.25)' }} />
              </div>
              <p className="text-xs font-medium" style={{ color: '#717182' }}>No courses available yet</p>
            </div>
          </>
        )}
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={handleLoginModalClose}
        redirectTo={selectedCourseId ? `/courses/${selectedCourseId}` : "/courses"}
        message="Sign in to view course details and enroll."
      />
    </>
  )
}