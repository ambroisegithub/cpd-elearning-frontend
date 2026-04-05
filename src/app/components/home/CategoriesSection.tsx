"use client"

import { categories } from '../../data/mockData'
import { ArrowRight } from 'lucide-react'
import React from 'react'
import Link from 'next/link'

export function CategoriesSection() {
  const [hovered, setHovered] = React.useState<string | null>(null)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      {/* Section header */}
      <div className="text-center mb-12">
        <div className="cpd-eyebrow justify-center">Browse by Specialty</div>
        <h2 className="cpd-heading mb-3">
          Explore by{' '}
          <span className="cpd-heading-accent">Category</span>
        </h2>
        <p className="cpd-subtext mx-auto text-center">
          Find accredited CPD courses tailored to your specialty and career goals
        </p>
      </div>

      {/* Category grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((category) => {
          const isHovered = hovered === category.id
          return (
            <button
              key={category.id}
              className="group flex flex-col items-center p-5 text-center"
              style={{
                background: isHovered ? '#2D6A4F' : '#ffffff',
                border: `1px solid ${isHovered ? '#2D6A4F' : 'rgba(30,47,94,0.09)'}`,
                boxShadow: isHovered
                  ? '0 14px 32px -6px rgba(45,106,79,0.28)'
                  : '0 2px 12px -4px rgba(0,0,0,0.05)',
                transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
                transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={() => setHovered(category.id)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Top accent line */}
              <div
                style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0,
                  height: '3px',
                  background: '#2D6A4F',
                  opacity: isHovered ? 0 : 1,
                  transform: `scaleX(${isHovered ? 0 : 1})`,
                  transition: 'all 0.25s ease',
                  transformOrigin: 'left',
                }}
              />

              {/* Icon */}
              <div
                className="cpd-cat-icon"
                style={{
                  background: isHovered ? 'rgba(255,255,255,0.12)' : category.color,
                  border: isHovered ? '1.5px solid rgba(255,255,255,0.2)' : '1px solid rgba(30,47,94,0.06)',
                  transition: 'all 0.25s ease',
                }}
              >
                {category.emoji}
              </div>

              {/* Name */}
              <h3
                className="text-xs font-bold mb-1 transition-colors duration-250 leading-snug"
                style={{ color: isHovered ? '#ffffff' : '#1E2F5E' }}
              >
                {category.name}
              </h3>

              {/* Count */}
              <p
                className="text-[10px] mb-2.5 transition-colors duration-250"
                style={{ color: isHovered ? 'rgba(255,255,255,0.65)' : '#717182' }}
              >
                {category.count} courses
              </p>

              {/* Arrow */}
              <div
                className="flex items-center gap-1 transition-all duration-250"
                style={{
                  opacity: isHovered ? 1 : 0,
                  transform: isHovered ? 'translateY(0)' : 'translateY(4px)',
                }}
              >
                <span className="text-[10px] font-semibold text-white">Explore</span>
                <ArrowRight className="w-3 h-3 text-white" />
              </div>
            </button>
          )
        })}
      </div>

      {/* View all link */}
      <div className="text-center mt-8">
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 text-sm font-semibold transition-colors group"
          style={{ color: '#2D6A4F' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#1f4d37' }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#2D6A4F' }}
        >
          View all course categories
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  )
}
