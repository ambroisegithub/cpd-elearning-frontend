// CPD Academy — Mock Data

export interface FeaturedCourse {
  id: string
  title: string
  category: string
  difficulty: string
  description: string
  instructor: string
  cpdHours: number
  enrolled: number
  rating: number
  imageUrl: string
}

export interface Category {
  id: string
  name: string
  count: number
  color: string
  emoji: string
}

export interface Testimonial {
  id: string
  name: string
  role: string
  content: string
  color: string
  rating: number
}

export const featuredCourses: FeaturedCourse[] = [
  {
    id: '1',
    title: 'Advanced Clinical Pharmacology for Nurses',
    category: 'Nursing',
    difficulty: 'Advanced',
    description: 'Master drug interactions, dosage calculations, and patient safety in this comprehensive pharmacology course.',
    instructor: 'Dr. Amina Uwase',
    cpdHours: 8,
    enrolled: 3245,
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=250&fit=crop',
  },
  {
    id: '2',
    title: 'Emergency Medicine & Trauma Care',
    category: 'Medicine',
    difficulty: 'Intermediate',
    description: 'Evidence-based protocols for managing acute emergencies and traumatic injuries in clinical settings.',
    instructor: 'Dr. Jean-Paul Bizimana',
    cpdHours: 12,
    enrolled: 2189,
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop',
  },
  {
    id: '3',
    title: 'Palliative Care Essentials',
    category: 'Healthcare',
    difficulty: 'Beginner',
    description: 'Holistic approaches to comfort care, pain management, and patient dignity in end-of-life situations.',
    instructor: 'Dr. Claire Mukamana',
    cpdHours: 6,
    enrolled: 1876,
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=400&h=250&fit=crop',
  },
  {
    id: '4',
    title: 'Infection Control & Hospital Hygiene',
    category: 'Public Health',
    difficulty: 'Beginner',
    description: 'WHO-aligned infection prevention and control strategies for healthcare workers across all settings.',
    instructor: 'Dr. Patrick Nkurunziza',
    cpdHours: 4,
    enrolled: 4512,
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1576671081837-49000212a370?w=400&h=250&fit=crop',
  },
  {
    id: '5',
    title: 'Mental Health First Aid for Clinicians',
    category: 'Mental Health',
    difficulty: 'Intermediate',
    description: 'Recognise and respond to mental health crises. Practical skills for frontline healthcare professionals.',
    instructor: 'Dr. Solange Uwimbabazi',
    cpdHours: 10,
    enrolled: 2934,
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=400&h=250&fit=crop',
  },
  {
    id: '6',
    title: 'Maternal & Child Health Nutrition',
    category: 'Nutrition',
    difficulty: 'Intermediate',
    description: 'Evidence-based nutritional guidelines for mothers and children from pregnancy through early childhood.',
    instructor: 'Dr. Diane Iradukunda',
    cpdHours: 7,
    enrolled: 1654,
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=400&h=250&fit=crop',
  },
]

export const categories: Category[] = [
  { id: '1', name: 'Nursing',       count: 42, color: 'rgba(116,198,157,0.15)', emoji: '🩺' },
  { id: '2', name: 'Medicine',      count: 38, color: 'rgba(45,106,79,0.12)',   emoji: '💊' },
  { id: '3', name: 'Public Health', count: 27, color: 'rgba(231,111,81,0.12)',  emoji: '🏥' },
  { id: '4', name: 'Mental Health', count: 19, color: 'rgba(233,196,106,0.15)', emoji: '🧠' },
  { id: '5', name: 'Nutrition',     count: 16, color: 'rgba(116,198,157,0.15)', emoji: '🥗' },
  { id: '6', name: 'Pharmacy',      count: 24, color: 'rgba(30,47,94,0.08)',    emoji: '⚕️' },
]

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Nurse Grace Mukankusi',
    role: 'Senior Nurse, CHUK Hospital',
    content: 'The pharmacology course transformed how I manage medication safety in my ward. Practical, clinically relevant, and beautifully organised.',
    color: '#74C69D',
    rating: 5,
  },
  {
    id: '2',
    name: 'Dr. Emmanuel Habimana',
    role: 'General Practitioner, Kigali',
    content: 'CPD Academy helped me earn my annual CPD points without disrupting my practice. The content quality is outstanding.',
    color: '#2D6A4F',
    rating: 5,
  },
  {
    id: '3',
    name: 'Pharmacist Yvette Nsanzimana',
    role: 'Community Pharmacist',
    content: 'Accredited, flexible, and genuinely relevant to daily pharmacy practice. I\'ve already recommended it to my entire team.',
    color: '#E76F51',
    rating: 5,
  },
  {
    id: '4',
    name: 'Midwife Angelique Uwera',
    role: 'Midwife, Butaro Hospital',
    content: 'The maternal health courses are exceptional. Real-world scenarios and evidence-based protocols I use every single day.',
    color: '#E9C46A',
    rating: 5,
  },
  {
    id: '5',
    name: 'Dr. Robert Ntirenganya',
    role: 'Surgeon, RBC Medical School',
    content: 'Impressive depth of content. CPD Academy bridges the gap between theory and practice in a way few platforms achieve.',
    color: '#74C69D',
    rating: 5,
  },
  {
    id: '6',
    name: 'Nurse Felix Nkurunziza',
    role: 'ICU Nurse, King Faisal Hospital',
    content: 'I completed the Emergency Medicine course in two weekends. Certificates were instant and fully verifiable. Excellent platform.',
    color: '#2D6A4F',
    rating: 5,
  },
]
