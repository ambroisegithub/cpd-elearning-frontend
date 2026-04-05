"use client"

import { CPDCourseCard } from '@/app/components/Card3D'
import { CourseType, CourseLevel } from '@/types'

interface CourseCardProps {
  course: {
    id: string
    title: string
    description: string
    short_description?: string
    thumbnail_url?: string
    instructor?: {
      first_name: string
      last_name: string
      profile_picture_url?: string
    }
    level: CourseLevel
    course_type: CourseType
    price: number
    original_price?: number
    average_rating: number
    total_reviews: number
    enrollment_count: number
    duration_minutes: number
    total_lessons: number
    tags: string[]
    is_popular?: boolean
    is_certificate_available?: boolean
    institution?: {
      name: string
      logo_url?: string
    }
    status?: string
  }
  showActions?: boolean
  showInstitution?: boolean
}

export function CourseCard({ course, showActions = true, showInstitution = true }: CourseCardProps) {
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
      original_price={course.original_price}
      average_rating={course.average_rating}
      total_reviews={course.total_reviews}
      enrollment_count={course.enrollment_count}
      duration_minutes={course.duration_minutes}
      total_lessons={course.total_lessons}
      tags={course.tags}
      is_popular={course.is_popular}
      is_certificate_available={course.is_certificate_available}
      institution={course.institution}
      status={course.status}
      showActions={showActions}
      showInstitution={showInstitution}
      variant="default"
    />
  )
}
