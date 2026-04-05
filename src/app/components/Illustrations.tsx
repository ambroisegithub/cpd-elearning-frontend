// SVG Illustrations for E-Learning Platform
// Simple, 2-color SVGs that match the solid color palette

export function BrainWithLeaf({ className = "w-24 h-24" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Brain outline */}
      <path
        d="M50 20 C30 20 20 30 20 45 C20 50 22 54 25 57 C23 60 22 64 22 68 C22 78 30 85 40 85 C42 85 44 84.5 46 84 C48 86 51 87 54 87 C57 87 60 86 62 84 C64 84.5 66 85 68 85 C78 85 86 78 86 68 C86 64 85 60 83 57 C86 54 88 50 88 45 C88 30 78 20 58 20 C55 20 52 20.5 50 21 C50 20.5 50 20 50 20 Z"
        fill="#2D6A4F"
      />
      {/* Leaf */}
      <path
        d="M70 40 Q75 35 80 40 Q85 45 80 50 Q75 55 70 50 Q70 45 70 40 Z"
        fill="#74C69D"
      />
      {/* Brain details */}
      <path
        d="M35 40 Q40 35 45 40 M55 35 Q60 30 65 35 M30 55 Q35 50 40 55 M50 60 Q55 55 60 60"
        stroke="#F8F9FA"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function HeartRateLine({ className = "w-32 h-24" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Heart shape */}
      <path
        d="M30 25 C25 20 18 20 15 25 C12 30 12 35 15 38 L30 53 L45 38 C48 35 48 30 45 25 C42 20 35 20 30 25 Z"
        fill="#E76F51"
      />
      {/* Heart rate line */}
      <path
        d="M5 60 L25 60 L30 45 L35 75 L40 50 L45 60 L115 60"
        stroke="#2D6A4F"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export function CertificateBadge({ className = "w-24 h-24" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Badge circle */}
      <circle cx="50" cy="40" r="25" fill="#E9C46A" />
      {/* Ribbon */}
      <path d="M40 60 L40 90 L50 85 L60 90 L60 60 Z" fill="#E76F51" />
      {/* Star */}
      <path
        d="M50 30 L52 36 L58 36 L53 40 L55 46 L50 42 L45 46 L47 40 L42 36 L48 36 Z"
        fill="#FFF"
      />
    </svg>
  );
}

export function BookStack({ className = "w-24 h-24" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Bottom book */}
      <rect x="20" y="70" width="60" height="15" rx="2" fill="#1E2F5E" />
      {/* Middle book */}
      <rect x="25" y="50" width="50" height="15" rx="2" fill="#2D6A4F" />
      {/* Top book */}
      <rect x="30" y="30" width="40" height="15" rx="2" fill="#74C69D" />
      {/* Book spines */}
      <line x1="23" y1="72" x2="23" y2="83" stroke="#F8F9FA" strokeWidth="1" />
      <line x1="28" y1="52" x2="28" y2="63" stroke="#F8F9FA" strokeWidth="1" />
      <line x1="33" y1="32" x2="33" y2="43" stroke="#1E2F5E" strokeWidth="1" />
    </svg>
  );
}

export function MedicalCross({ className = "w-24 h-24" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Circle background */}
      <circle cx="50" cy="50" r="40" fill="#E9F5EF" />
      {/* Cross */}
      <path
        d="M50 25 L50 75 M25 50 L75 50"
        stroke="#2D6A4F"
        strokeWidth="12"
        strokeLinecap="round"
      />
      {/* Heart on cross */}
      <path
        d="M50 45 C48 43 45 43 44 45 C43 47 43 49 44 50 L50 56 L56 50 C57 49 57 47 56 45 C55 43 52 43 50 45 Z"
        fill="#E76F51"
      />
    </svg>
  );
}

export function ProgressPath({ className = "w-32 h-24" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Curved path */}
      <path
        d="M10 60 Q30 40 50 50 T90 30"
        stroke="#2D6A4F"
        strokeWidth="4"
        strokeDasharray="8 4"
        strokeLinecap="round"
        fill="none"
      />
      {/* Progress dots */}
      <circle cx="10" cy="60" r="6" fill="#2D6A4F" />
      <circle cx="50" cy="50" r="6" fill="#74C69D" />
      <circle cx="90" cy="30" r="6" fill="#E9C46A" />
      {/* Flag at end */}
      <path d="M110 20 L110 35 M110 20 L100 23 L110 26 Z" fill="#E76F51" stroke="#E76F51" strokeWidth="2" />
    </svg>
  );
}
