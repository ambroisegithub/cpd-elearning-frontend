"use client"

import { testimonials } from '../../data/mockData'
import React from 'react'

export function TestimonialsSection() {
  const col1 = testimonials.filter((_, i) => i % 3 === 0)
  const col2 = testimonials.filter((_, i) => i % 3 === 1)
  const col3 = testimonials.filter((_, i) => i % 3 === 2)

  const TestCard = ({ t }: { t: typeof testimonials[0] }) => (
    <div className="cpd-testimonial mb-5">
      {/* Stars */}
      <div className="flex gap-0.5 mb-3">
        {[...Array(t.rating)].map((_, i) => (
          <span key={i} style={{ color: '#E9C46A', fontSize: '0.875rem' }}>★</span>
        ))}
      </div>

      {/* Quote text */}
      <p
        className="leading-relaxed mb-5"
        style={{ color: '#717182', fontSize: '0.875rem' }}
      >
        "{t.content}"
      </p>

      {/* Separator */}
      <div
        className="mb-4"
        style={{ height: '1px', background: 'rgba(30,47,94,0.06)' }}
      />

      {/* Author */}
      <div className="flex items-center gap-3">
        <div
          className="cpd-avatar flex-shrink-0"
          style={{
            width: '2.25rem',
            height: '2.25rem',
            background: t.color,
            fontSize: '0.6875rem',
          }}
        >
          {t.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
        </div>
        <div>
          <div className="text-xs font-bold" style={{ color: '#1E2F5E' }}>{t.name}</div>
          <div className="text-[10px] mt-0.5" style={{ color: '#717182' }}>{t.role}</div>
        </div>
        {/* Verified badge */}
        <div
          className="ml-auto cpd-badge cpd-badge-green text-[9px]"
          style={{ padding: '0.15rem 0.5rem' }}
        >
          Verified
        </div>
      </div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section header */}
      <div className="text-center mb-12">
        <div className="cpd-eyebrow justify-center">Real Stories</div>
        <h2 className="cpd-heading mb-3">
          Trusted by{' '}
          <span className="cpd-heading-accent">Healthcare Professionals</span>
        </h2>
        <p className="cpd-subtext mx-auto text-center">
          Nurses, doctors, and pharmacists advancing their careers with CPD Academy
        </p>
      </div>

      {/* Masonry columns — desktop */}
      <div className="hidden md:grid md:grid-cols-3 gap-5">
        <div>{col1.map(t => <TestCard key={t.id} t={t} />)}</div>
        <div className="mt-8">{col2.map(t => <TestCard key={t.id} t={t} />)}</div>
        <div>{col3.map(t => <TestCard key={t.id} t={t} />)}</div>
      </div>

      {/* Single column — mobile */}
      <div className="md:hidden space-y-4">
        {testimonials.map(t => <TestCard key={t.id} t={t} />)}
      </div>
    </div>
  )
}
