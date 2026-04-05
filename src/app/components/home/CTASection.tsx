
import { CurvedUnderline } from '../CurvedUnderline';
import { SmartButton } from '../SmartButton';
import { ArrowRight } from 'lucide-react';
import Link from "next/link"
export function CTASection() {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Ambient Background */}
      <div
        className="absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle at 20% 80%, rgba(231, 111, 81, 0.3) 0%, rgba(255, 255, 255, 0) 70%)',
          filter: 'blur(60px)',
        }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="text-3xl md:text-5xl font-semibold text-[#1E2F5E] mb-6 leading-tight">
          Start your{' '}
          <CurvedUnderline color="#E76F51">
            healing journey
          </CurvedUnderline>
        </h2>

        <p className="text-lg text-[#6C757D] mb-8 max-w-2xl mx-auto">
          Join thousands of healthcare professionals who trust CPD Academy for their continuing education. 
          Your next breakthrough in patient care starts here.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/dashboard">
            <SmartButton variant="primary" size="lg">
              Create Free Account
              <ArrowRight className="inline-block ml-2 w-5 h-5" />
            </SmartButton>
          </Link>

          <SmartButton variant="secondary" size="lg">
            Talk to Sales
          </SmartButton>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-[#6C757D]">
          <div>✓ No credit card required</div>
          <div>✓ 14-day free trial</div>
          <div>✓ Cancel anytime</div>
        </div>
      </div>
    </section>
  );
}
