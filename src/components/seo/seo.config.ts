
export const SITE = {
  name: "CPD Academy",
  fullName: "Rwanda Health CPD eLearning Platform",
  shortName: "CPD Academy",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://healthcpds.com",
  defaultOgImage: "/og-image.jpg",
  twitterHandle: "@healthcpds",
  locale: "en_RW",
  phone: "+250 788 000 000",
  email: "info@healthcpds.com",
  address: "Kigali, Rwanda",
  founded: "2020",
} as const;

export const DEFAULT_SEO = {
  title: "CPD Academy — Rwanda Health CPD eLearning Platform | Continuing Professional Development for Healthcare Professionals",
  description:
    "Accredited CPD courses for healthcare professionals in Rwanda and Africa. Earn verified certificates, track CPD hours, and advance your clinical career with expert-led courses in nursing, medicine, midwifery, pharmacy, and public health.",
  keywords: [
    // Core CPD keywords
    "CPD eLearning",
    "continuing professional development",
    "CPD courses for healthcare professionals",
    "online CPD for doctors",
    "CPD for nurses Rwanda",
    "CPD for midwives",
    "healthcare professional development",
    "medical CPD online",
    "clinical education platform",
    "CPD credits online",
    "accredited CPD courses",
    "verifiable CPD certificates",
    "CPD hours tracking",
    "continuing medical education",
    "CME online",
    "CME credits Rwanda",
    "healthcare training online",
    "medical education platform",
    "clinical skills development",
    "professional development for clinicians",
    // Rwanda specific
    "Rwanda health CPD",
    "CPD Rwanda",
    "continuing education Rwanda health",
    "Rwanda medical association CPD",
    "Rwanda nurses CPD",
    "Rwanda midwives council CPD",
    "Rwanda pharmacy council CPD",
    "Rwanda dental association CPD",
    "Rwanda clinical officers CPD",
    "Rwanda community health workers training",
    "Rwanda health workforce development",
    "Rwanda Ministry of Health CPD",
    "Rwanda Biomedical Centre training",
    "RBC CPD courses",
    "Rwanda healthcare training platform",
    "Kigali medical education",
    // Clinical specialties
    "nursing CPD",
    "registered nurse training",
    "nurse practitioner courses",
    "clinical nursing education",
    "medical doctor CPD",
    "physician continuing education",
    "general practitioner training",
    "specialist doctor CPD",
    "midwifery CPD",
    "certified midwife training",
    "obstetric courses",
    "gynecology CPD",
    "pharmacy CPD",
    "clinical pharmacist training",
    "dental CPD",
    "dentist continuing education",
    "oral health courses",
    "clinical officer CPD",
    "medical assistant training",
    "community health worker CPD",
    "CHW training Rwanda",
    "health educator courses",
    "nutritionist CPD",
    "dietitian training",
    "physiotherapy CPD",
    "rehabilitation courses",
    "occupational therapy training",
    "speech therapy CPD",
    "audiology courses",
    "optometry CPD",
    "ophthalmology training",
    "medical laboratory CPD",
    "lab technician training",
    "radiology technician CPD",
    "ultrasound training",
    "ECG interpretation courses",
    "medical imaging CPD",
    "anesthesiology CPD",
    "critical care training",
    "intensive care courses",
    "emergency medicine CPD",
    "disaster medicine training",
    "triage courses",
    "resuscitation training",
    "BLS certification",
    "ACLS courses",
    "PALS training",
    "NALS certification",
    "ETAT+ courses",
    "IMCI training",
    // Family Planning specific (from your example)
    "family planning courses",
    "contraceptive methods training",
    "GATHER counseling approach",
    "long acting reversible contraception",
    "IUD insertion training",
    "implant insertion CPD",
    "injectable contraception courses",
    "oral contraceptives training",
    "emergency contraception CPD",
    "natural family planning",
    "fertility awareness methods",
    "reproductive health CPD",
    "adolescent sexual health",
    "youth friendly services",
    "postpartum family planning",
    "postnatal care courses",
    "antenatal care CPD",
    "safe motherhood training",
    "maternal mortality reduction",
    "obstetric emergency training",
    // Child health
    "child health courses",
    "pediatric care training",
    "newborn care CPD",
    "essential newborn care",
    "neonatal resuscitation",
    "Helping Babies Breathe",
    "breastfeeding counseling",
    "infant and young child feeding",
    "child nutrition CPD",
    "growth monitoring training",
    "child development courses",
    "immunization training",
    "vaccine safety CPD",
    "child illness management",
    "pneumonia treatment",
    "diarrhea management",
    "oral rehydration therapy",
    "child malaria treatment",
    "pediatric HIV care",
    "child protection CPD",
    // Public health
    "public health courses",
    "community health training",
    "health promotion CPD",
    "disease prevention courses",
    "health education training",
    "epidemiology courses",
    "disease surveillance training",
    "outbreak investigation CPD",
    "health statistics courses",
    "health research methods",
    "program monitoring and evaluation",
    "M&E training",
    "health policy courses",
    "health economics CPD",
    "health financing training",
    "universal health coverage",
    "health systems strengthening",
    "quality improvement CPD",
    "patient safety courses",
    "infection prevention control",
    "IPC training",
    "hand hygiene CPD",
    "sterilization techniques",
    "health facility management",
    "hospital administration CPD",
    // Infectious diseases
    "HIV management courses",
    "ART training",
    "prevention of mother to child transmission",
    "PMTCT CPD",
    "HIV testing and counseling",
    "TB management courses",
    "drug resistant TB training",
    "malaria case management",
    "severe malaria treatment",
    "malaria prevention CPD",
    "COVID-19 management",
    "pandemic response training",
    "vaccination courses",
    "immunization training",
    "EPI courses",
    "vaccine cold chain management",
    // Non-communicable diseases
    "diabetes management",
    "insulin therapy training",
    "hypertension management",
    "cardiovascular risk assessment",
    "stroke management CPD",
    "heart failure training",
    "asthma management courses",
    "COPD treatment",
    "respiratory care CPD",
    "kidney disease management",
    "dialysis training",
    "liver disease CPD",
    "hepatitis management",
    "cancer care courses",
    "oncology nursing",
    "breast cancer screening",
    "cervical cancer prevention",
    "HPV vaccination training",
    "mental health disorders",
    "depression management",
    "anxiety treatment CPD",
    "psychosis training",
    "substance abuse counseling",
    "addiction medicine CPD",
  ].join(", "),
} as const;

// ── Per-page SEO metadata ────────────────────────────────────────────────────

export const PAGE_SEO = {
  home: {
    title: "CPD Academy — Rwanda Health CPD eLearning Platform | Continuing Professional Development",
    description:
      "Accredited CPD courses for healthcare professionals in Rwanda and Africa. Earn verified certificates, track CPD hours, and advance your clinical career.",
    keywords: "CPD eLearning, continuing professional development, healthcare training Rwanda, medical education",
  },
  login: {
    title: "Login | CPD Academy Rwanda Health eLearning Platform",
    description: "Sign in to access your CPD courses, track progress, and download verified certificates.",
    keywords: "CPD login, healthcare eLearning login, CPD Academy sign in",
  },
  register: {
    title: "Register | CPD Academy Rwanda Health eLearning Platform",
    description: "Create your account to start earning CPD credits with accredited courses for healthcare professionals.",
    keywords: "CPD registration, healthcare professional sign up, create CPD account",
  },
  courses: {
    title: "CPD Courses | Healthcare Professional Development | CPD Academy",
    description: "Browse our library of accredited CPD courses for healthcare professionals. Family planning, maternal health, infectious diseases, clinical skills, and more.",
    keywords: "CPD courses, healthcare training, medical education, nursing CPD, clinical courses Rwanda",
  },
  institutions: {
    title: "Partner Institutions | CPD Academy Rwanda",
    description: "CPD courses trusted by leading healthcare institutions across Rwanda and Africa.",
    keywords: "healthcare institutions Rwanda, CPD partners, hospital training, clinic education",
  },
  about: {
    title: "About Us | CPD Academy Rwanda Health eLearning",
    description: "Learn about CPD Academy - Rwanda's leading platform for healthcare professional development.",
    keywords: "about CPD Academy, healthcare eLearning platform, medical education Rwanda",
  },
  contact: {
    title: "Contact Us | CPD Academy Rwanda",
    description: "Get in touch with CPD Academy for course inquiries, institutional partnerships, and support.",
    keywords: "contact CPD Academy, healthcare training support, CPD help center",
  },
  faq: {
    title: "FAQ | CPD Academy Rwanda Health eLearning",
    description: "Frequently asked questions about CPD Academy courses, certificates, pricing, and platform features.",
    keywords: "CPD FAQ, healthcare eLearning questions, CPD platform help",
  },
} as const;

// ── Structured data helpers ──────────────────────────────────────────────────

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: SITE.fullName,
    alternateName: SITE.shortName,
    url: SITE.url,
    logo: `${SITE.url}/icon-512x512.png`,
    image: `${SITE.url}/og-image.jpg`,
    description: DEFAULT_SEO.description,
    foundingDate: SITE.founded,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kigali",
      addressCountry: "RW",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: SITE.phone,
        contactType: "customer service",
        areaServed: ["RW", "Africa"],
        availableLanguage: ["English", "French", "Kinyarwanda"],
      },
    ],
    sameAs: ["https://twitter.com/healthcpds", "https://linkedin.com/company/cpd-academy"],
  };
}

export function buildWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE.url}/courses?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildCourseSchema(course: {
  name: string;
  description: string;
  url: string;
  image?: string;
  provider?: string;
  cpdHours?: number;
  price?: number;
  currency?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.name,
    description: course.description,
    url: course.url,
    image: course.image ?? `${SITE.url}/og-image.jpg`,
    provider: {
      "@type": "EducationalOrganization",
      name: course.provider ?? SITE.fullName,
      url: SITE.url,
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
        priceCurrency: course.currency ?? "RWF",
        availability: "https://schema.org/OnlineOnly",
      },
    }),
  };
}

export function buildBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE.url}${item.url}`,
    })),
  };
}

export function buildFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
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
}

// ── Helper function for SEO metadata ─────────────────────────────────────────
export type SeoProps = {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: "website" | "article" | "product";
  noIndex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
};

export const getSeoMetadata = (props: SeoProps = {}) => {
  const {
    title,
    description,
    canonicalUrl,
    ogImage,
    ogType = "website",
    noIndex = false,
    publishedTime,
    modifiedTime,
    author,
  } = props;

  const finalTitle = title ? `${title} | ${SITE.name}` : DEFAULT_SEO.title;
  const finalDescription = description || DEFAULT_SEO.description;
  const finalOgImage = ogImage || SITE.defaultOgImage;
  const finalCanonical = canonicalUrl
    ? canonicalUrl.startsWith("http")
      ? canonicalUrl
      : `${SITE.url}${canonicalUrl}`
    : SITE.url;

  return {
    title: finalTitle,
    description: finalDescription,
    canonical: finalCanonical,
    ogImage: finalOgImage,
    ogType,
    noIndex,
    publishedTime,
    modifiedTime,
    author,
  };
};