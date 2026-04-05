import { GraduationCap, Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

const platformLinks = [
  { label: 'Browse Courses', href: '#courses' },
  { label: 'Categories', href: '#categories' },
  { label: 'Institutions', href: '#institutions' },
  { label: 'Become Instructor', href: '#' },
  { label: 'Enterprise', href: '#' },
]

const supportLinks = [
  { label: 'Help Center', href: '#' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'Terms of Service', href: '#' },
  { label: 'Privacy Policy', href: '#' },
  { label: 'Cookie Policy', href: '#' },
]

const socials = [
  { Icon: Facebook,  href: '#', label: 'Facebook' },
  { Icon: Twitter,   href: '#', label: 'Twitter' },
  { Icon: Linkedin,  href: '#', label: 'LinkedIn' },
  { Icon: Instagram, href: '#', label: 'Instagram' },
]

const contactItems = [
  { Icon: Mail,    text: 'contact@cpdacademy.com' },
  { Icon: Phone,   text: '+1 (800) CPD-LEARN' },
  { Icon: MapPin,  text: 'Kigali, Rwanda' },
]

export function Footer() {
  return (
    <footer className="cpd-footer">
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* ── Brand ── */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-5 group">
              <div
                className="w-10 h-10 flex items-center justify-center flex-shrink-0 transition-colors group-hover:bg-[#1f4d37]"
                style={{ background: '#2D6A4F' }}
              >
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-white font-bold text-base leading-tight">
                  CPD<span style={{ color: '#74C69D' }}>Academy</span>
                </div>
                <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  eLearning Platform
                </div>
              </div>
            </Link>

            <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Professional development for healthcare workers, by healthcare experts. Accredited,
              verified, and trusted by 12,000+ clinicians.
            </p>

            {/* Social icons */}
            <div className="flex gap-2.5">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 flex items-center justify-center transition-all duration-200"
                  style={{
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#2D6A4F'
                    e.currentTarget.style.borderColor = '#2D6A4F'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.07)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  <Icon className="w-4 h-4 text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* ── Platform ── */}
          <div>
            <h4 className="text-sm font-bold text-white mb-5 uppercase tracking-wider">Platform</h4>
            <ul className="space-y-3">
              {platformLinks.map(({ label, href }) => (
                <li key={label}>
                  <a href={href} className="cpd-footer-link flex items-center gap-1 group">
                    <span className="group-hover:translate-x-0.5 transition-transform">{label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Support ── */}
          <div>
            <h4 className="text-sm font-bold text-white mb-5 uppercase tracking-wider">Support</h4>
            <ul className="space-y-3">
              {supportLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="cpd-footer-link flex items-center gap-1 group">
                    <span className="group-hover:translate-x-0.5 transition-transform">{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact ── */}
          <div>
            <h4 className="text-sm font-bold text-white mb-5 uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3.5">
              {contactItems.map(({ Icon, text }) => (
                <li key={text} className="flex items-start gap-2.5">
                  <Icon className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#74C69D' }} />
                  <span className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>{text}</span>
                </li>
              ))}
            </ul>

            {/* Newsletter mini CTA */}
            <div
              className="mt-6 p-4"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <p className="text-xs font-semibold text-white mb-2">Stay updated</p>
              <p className="text-[11px] mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Get CPD tips and new course alerts
              </p>
              <Link
                href="/register"
                className="inline-flex items-center gap-1.5 text-xs font-semibold transition-colors"
                style={{ color: '#74C69D' }}
              >
                Subscribe free
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6"
          style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
        >
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
            © 2026 CPD Academy. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: '#74C69D' }} />
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Made with care for healthcare professionals
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
