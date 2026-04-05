"use client"

import { CPDCourseCard } from '@/app/components/Card3D'
import { CourseType, CourseLevel } from '@/types'

interface BrowseCourseCardProps {
  id: string
  title: string
  description: string
  thumbnail_url?: string
  instructor?: {
    id: string
    first_name: string
    last_name: string
    profile_picture_url?: string
  }
  course_type: CourseType
  level: CourseLevel
  language: string
  duration_minutes: number
  price: number
  enrollment_count: number
  average_rating: number
  total_reviews: number
  total_lessons: number
  category?: {
    id: string
    name: string
  }
  institution?: {
    id: string
    name: string
    logo_url?: string
  }
  is_certificate_available?: boolean
  tags?: string[]
  onLearnMoreClick?: (courseId: string) => void
}

export function BrowseCourseCard({
  id, title, description, thumbnail_url, instructor,
  course_type, level, duration_minutes, price,
  enrollment_count, average_rating, total_reviews, total_lessons,
  category, institution, is_certificate_available, tags,
  onLearnMoreClick,
}: BrowseCourseCardProps) {
  return (
    <CPDCourseCard
      id={id}
      title={title}
      description={description}
      thumbnail_url={thumbnail_url}
      instructor={instructor}
      level={level}
      course_type={course_type}
      price={price}
      average_rating={average_rating}
      total_reviews={total_reviews}
      enrollment_count={enrollment_count}
      duration_minutes={duration_minutes}
      total_lessons={total_lessons}
      category={category}
      institution={institution}
      is_certificate_available={is_certificate_available}
      tags={tags}
      variant="browse"
      showActions={true}
      showInstitution={true}
      onLearnMoreClick={onLearnMoreClick}
    />
  )
}
