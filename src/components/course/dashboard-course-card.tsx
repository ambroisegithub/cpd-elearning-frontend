// @ts-nocheck
"use client"

import { CPDCourseCard } from '@/app/components/Card3D'
import { Course, CourseType, CourseLevel, CourseStatus } from '@/types'

interface DashboardCourseCardProps {
  course: Course
  index?: number
  variant?: 'dashboard' | 'admin' | 'browse' | 'student' | 'instructor'
  showActions?: boolean
  onAnalytics?: (courseId: string) => void
  onShare?: (courseId: string) => void
}

const variantToLinkPrefix: Record<string, string> = {
  admin:      '/dashboard/system-admin/courses',
  instructor: '/dashboard/instructor/courses',
  dashboard:  '/dashboard/courses',
  student:    '/courses',
  browse:     '/courses',
}

export function DashboardCourseCard({
  course, index = 0, variant = 'dashboard', showActions = true,
  onAnalytics, onShare,
}: DashboardCourseCardProps) {
  const linkPrefix = variantToLinkPrefix[variant] || '/courses'

  return (
    <CPDCourseCard
      id={course.id}
      title={course.title}
      description={course.description}
      short_description={course.short_description}
      thumbnail_url={course.thumbnail_url}
      instructor={course.instructor}
      level={course.level}
      course_type={course.course_type}
      price={course.price}
      average_rating={course.average_rating}
      total_reviews={course.total_reviews}
      enrollment_count={course.enrollment_count}
      duration_minutes={course.duration_minutes}
      total_lessons={course.total_lessons}
      tags={course.tags ?? []}
      is_popular={course.is_popular}
      is_certificate_available={course.is_certificate_available}
      institution={course.institution}
      status={course.status}
      variant={variant}
      showActions={showActions}
      showInstitution={true}
      index={index}
      linkPrefix={linkPrefix}
    />
  )
}
