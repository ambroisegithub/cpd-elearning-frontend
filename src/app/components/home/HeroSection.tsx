"use client";

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="relative pt-6 pb-12 px-4 md:px-6 overflow-hidden">
      {/* Organic blob background elements */}
      <div
        className="absolute top-16 left-8 w-64 h-64 md:w-80 md:h-80 rounded-full opacity-10 pointer-events-none"
        style={{
          backgroundColor: '#74C69D',
          filter: 'blur(60px)',
        }}
      />
      <div
        className="absolute bottom-8 right-8 w-72 h-72 md:w-96 md:h-96 rounded-full opacity-10 pointer-events-none"
        style={{
          backgroundColor: '#E9C46A',
          filter: 'blur(80px)',
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* 50/50 split layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Content */}
          <div>
            <h1
              className="text-3xl md:text-4xl lg:text-5xl mb-3 leading-tight font-bold"
              style={{ color: '#1E2F5E' }}
            >
              Advance Your
              <br />
              <span className="relative inline-block mt-1">
                <span style={{ color: '#2D6A4F' }}>Medical Career</span>
                <svg
                  className="absolute -bottom-2 left-0 w-full"
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
            </h1>

            <p
              className="text-sm md:text-base mb-5 leading-relaxed max-w-md"
              style={{ color: '#6C757D' }}
            >
              Earn verified CPD certificates from expert instructors. Courses designed for healthcare professionals—anytime, anywhere.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-6 py-2 text-sm font-medium text-white transition-all duration-200 rounded-lg"
                style={{ backgroundColor: '#2D6A4F' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#1f4d37';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#2D6A4F';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Start Learning
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <a
                href="#courses"
                className="inline-flex items-center justify-center gap-2 px-6 py-2 text-sm font-medium transition-all duration-200 rounded-lg"
                style={{
                  backgroundColor: 'transparent',
                  color: '#2D6A4F',
                  border: '1.5px solid #2D6A4F',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#2D6A4F';
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#2D6A4F';
                }}
              >
                Browse Courses
              </a>
            </div>

            {/* Compact Stats */}
            <div className="flex items-center gap-8">
              {[
                { value: '187+', label: 'Courses' },
                { value: '2.8k+', label: 'Students' },
                { value: '4.5k+', label: 'Certificates' },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-lg md:text-xl font-bold" style={{ color: '#2D6A4F' }}>
                    {stat.value}
                  </div>
                  <div className="text-xs" style={{ color: '#9CA3AF' }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Clean & Balanced Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-xl">
              <div className="relative">
                {/* Main Image */}
                <div className="rounded-xl overflow-hidden shadow-xl">
                  <img
                    src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=600&fit=crop"
                    alt="Healthcare professional learning"
                    className="w-full h-auto object-cover"
                    style={{ maxHeight: '420px' }}
                  />
                </div>

                {/* Floating Card 1 - Achievement */}
                <div
                  className="absolute -bottom-4 -left-4 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg border border-gray-100"
                  style={{
                    animation: 'float 3s ease-in-out infinite',
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#2D6A4F] rounded-lg flex items-center justify-center">
                      <span className="text-sm">🏆</span>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-500">This Month</div>
                      <div className="text-xs font-semibold text-[#1E2F5E]">
                        2,456 Certificates
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Card 2 - Rating */}
                <div
                  className="absolute -top-4 -right-4 bg-[#E76F51] backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg"
                  style={{
                    animation: 'float 3s ease-in-out 1.5s infinite',
                  }}
                >
                  <div className="text-white text-center">
                    <div className="text-lg font-bold">4.9</div>
                    <div className="text-[10px]">★★★★★</div>
                    <div className="text-[9px] opacity-90">Rating</div>
                  </div>
                </div>

                {/* Floating Card 3 - Trust Badge */}
                <div
                  className="absolute bottom-6 -right-2 bg-white/95 backdrop-blur-sm px-2.5 py-1.5 rounded-lg shadow-md"
                  style={{
                    animation: 'float 2.5s ease-in-out 0.5s infinite',
                  }}
                >
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 bg-[#E9C46A] rounded-full flex items-center justify-center">
                      <span className="text-[9px]">✓</span>
                    </div>
                    <span className="text-[10px] font-medium text-[#2D6A4F]">CPD Accredited</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle curved separator */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none opacity-40">
        <svg viewBox="0 0 1200 40" className="w-full" style={{ fill: '#F8F9FA' }}>
          <path d="M0,20 Q300,5 600,20 T1200,20 L1200,40 L0,40 Z" />
        </svg>
      </div>

      {/* Animation styles */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
      `}</style>
    </section>
  );
}