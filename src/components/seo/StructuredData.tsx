"use client";

import React from "react";
import Script from "next/script";

interface StructuredDataProps {
  data: Record<string, any>;
  id?: string;
}

export default function StructuredData({ data, id }: StructuredDataProps) {
  const scriptId = id || `structured-data-${Date.now()}`;
  
  return (
    <Script
      id={scriptId}
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// ── Pre-built structured data components ─────────────────────────────────────

export function OrganizationStructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "CPD Academy",
    alternateName: "Rwanda Health CPD eLearning Platform",
    url: "https://healthcpds.com",
    logo: "https://healthcpds.com/icon-512x512.png",
    description: "Accredited CPD courses for healthcare professionals in Rwanda and Africa. Earn verified certificates and advance your clinical career.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kigali",
      addressCountry: "RW",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+250 788 000 000",
      contactType: "customer service",
      availableLanguage: ["English", "French", "Kinyarwanda"],
    },
    sameAs: [
      "https://twitter.com/healthcpds",
      "https://linkedin.com/company/cpd-academy",
    ],
  };
  return <StructuredData data={data} id="organization-structured-data" />;
}

export function WebsiteStructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "CPD Academy",
    url: "https://healthcpds.com",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://healthcpds.com/courses?search={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };
  return <StructuredData data={data} id="website-structured-data" />;
}

export function CourseStructuredData({ course }: { course: {
  name: string;
  description: string;
  url: string;
  image?: string;
  provider?: string;
  cpdHours?: number;
  price?: number;
  currency?: string;
} }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.name,
    description: course.description,
    url: course.url,
    image: course.image || "https://healthcpds.com/og-image.jpg",
    provider: {
      "@type": "EducationalOrganization",
      name: course.provider || "CPD Academy",
      url: "https://healthcpds.com",
    },
    ...(course.cpdHours && {
      educationalCredentialAwarded: {
        "@type": "EducationalOccupationalCredential",
        name: "CPD Certificate",
        credentialCategory: "ContinuingProfessionalDevelopment",
      },
    }),
    ...(course.price && {
      offers: {
        "@type": "Offer",
        price: course.price,
        priceCurrency: course.currency || "RWF",
        availability: "https://schema.org/OnlineOnly",
      },
    }),
  };
  return <StructuredData data={data} id={`course-structured-data-${course.name}`} />;
}

export function BreadcrumbStructuredData({ items }: { items: { name: string; url: string }[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `https://healthcpds.com${item.url}`,
    })),
  };
  return <StructuredData data={data} id="breadcrumb-structured-data" />;
}

export function FAQStructuredData({ faqs }: { faqs: { question: string; answer: string }[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
  return <StructuredData data={data} id="faq-structured-data" />;
}

export function ReviewStructuredData({ reviews }: { reviews: {
  author: string;
  rating: number;
  reviewBody: string;
  datePublished?: string;
}[] }) {
  const aggregateRating = {
    "@type": "AggregateRating",
    ratingValue: reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length,
    reviewCount: reviews.length,
  };

  const reviewList = reviews.map((review, index) => ({
    "@type": "Review",
    author: {
      "@type": "Person",
      name: review.author,
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: review.rating,
    },
    reviewBody: review.reviewBody,
    ...(review.datePublished && { datePublished: review.datePublished }),
  }));

  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "CPD Academy Courses",
    aggregateRating,
    review: reviewList,
  };
  return <StructuredData data={data} id="review-structured-data" />;
}

export function LocalBusinessStructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "CPD Academy",
    description: "Continuing Professional Development for Healthcare Professionals in Rwanda",
    url: "https://healthcpds.com",
    logo: "https://healthcpds.com/icon-512x512.png",
    address: {
      "@type": "PostalAddress",
      streetAddress: "KG 11 Ave",
      addressLocality: "Kigali",
      addressRegion: "Kigali City",
      postalCode: "0000",
      addressCountry: "RW",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "-1.9441",
      longitude: "30.0619",
    },
    telephone: "+250 788 000 000",
    email: "info@healthcpds.com",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "17:00",
      },
    ],
    sameAs: [
      "https://twitter.com/healthcpds",
      "https://linkedin.com/company/cpd-academy",
    ],
  };
  return <StructuredData data={data} id="local-business-structured-data" />;
}

export function MedicalWebPageStructuredData({ pageTitle, pageDescription, lastReviewed }: {
  pageTitle: string;
  pageDescription: string;
  lastReviewed?: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: pageTitle,
    description: pageDescription,
    url: "https://healthcpds.com",
    inLanguage: "en",
    ...(lastReviewed && { lastReviewed }),
    audience: {
      "@type": "MedicalAudience",
      name: "Healthcare Professionals",
      audienceType: "Clinicians, Nurses, Midwives, Pharmacists, Dentists",
    },
    medicalAudience: {
      "@type": "MedicalAudience",
      name: "Continuing Medical Education",
    },
  };
  return <StructuredData data={data} id="medical-webpage-structured-data" />;
}