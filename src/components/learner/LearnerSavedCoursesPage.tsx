"use client";

import { useState, useEffect } from "react";
import { useAppSelector } from "@/lib/hooks";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Loader2,
  Bookmark,
  BookmarkCheck,
  BookOpen,
  Clock,
  Users,
  Star,
  Target,
  Trophy,
  Crown,
  Filter,
  Search,
  RefreshCw,
  Trash2,
  PlayCircle,
  AlertCircle,
  Calendar,
  GraduationCap,
  Sparkles,
  Globe,
  Building2,
  ArrowRight,
  Lock,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface SavedCourse {
  id: string;
  saved_id: string;
  title: string;
  description: string;
  thumbnail_url: string | null;
  course_type: "PUBLIC" | "PRIVATE";
  level: string;
  price: number;
  average_rating: number;
  total_reviews: number;
  enrollment_count: number;
  duration_minutes: number;
  language: string;
  is_certificate_available: boolean;
  instructor: {
    id: string;
    name: string;
    avatar: string | null;
  };
  institution?: {
    id: string;
    name: string;
    logo: string | null;
  };
  saved_at: string;
  notes?: string;
  tags?: string[];
}

interface SavedCoursesStats {
  total_saved: number;
  mooc_count: number;
  spoc_count: number;
  by_level: {
    level: string;
    count: number;
  }[];
  recently_saved: number;
}

// ─── Saved Courses Page Skeleton ─────────────────────────────────────────────────
const SavedCoursesPageSkeleton = () => (
  <div className="container mx-auto p-4 md:p-6 space-y-6">
    {/* Header Skeleton */}
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <Skeleton className="h-8 w-48 mb-2 bg-gray-200/70" />
        <Skeleton className="h-4 w-64 bg-gray-200/70" />
      </div>
      <Skeleton className="h-9 w-24 rounded-md bg-gray-200/70" />
    </div>

    {/* Stats Cards Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-3 w-24 bg-gray-200/70" />
                <Skeleton className="h-8 w-12 bg-gray-200/70" />
              </div>
              <Skeleton className="w-12 h-12 rounded-full bg-gray-200/70" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

    {/* Filters Skeleton */}
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <Skeleton className="h-10 w-full rounded-md bg-gray-200/70" />
      </div>
      <Skeleton className="h-10 w-full md:w-40 rounded-md bg-gray-200/70" />
      <Skeleton className="h-10 w-full md:w-40 rounded-md bg-gray-200/70" />
      <Skeleton className="h-10 w-full md:w-40 rounded-md bg-gray-200/70" />
    </div>

    {/* Course Cards Grid Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div 
          key={i} 
          className="bg-white rounded-lg overflow-hidden border border-gray-200"
        >
          {/* Thumbnail Skeleton */}
          <div className="relative h-44 bg-gray-100">
            <Skeleton className="w-full h-full bg-gray-200/70" />
            {/* Remove button skeleton */}
            <div className="absolute top-3 right-3">
              <Skeleton className="w-7 h-7 rounded-full bg-gray-300/70" />
            </div>
            {/* Level Badge */}
            <div className="absolute top-3 left-3">
              <Skeleton className="h-5 w-20 rounded bg-gray-300/70" />
            </div>
            {/* Course Type Badge */}
            <div className="absolute bottom-3 right-3">
              <Skeleton className="h-5 w-20 rounded bg-gray-300/70" />
            </div>
            {/* Price Badge */}
            <div className="absolute bottom-3 left-3">
              <Skeleton className="h-5 w-16 rounded bg-gray-300/70" />
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="p-4 space-y-3">
            {/* Rating and Date */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Skeleton key={s} className="w-3 h-3 rounded bg-gray-200/70" />
                ))}
                <Skeleton className="h-3 w-12 ml-1 bg-gray-200/70" />
              </div>
              <Skeleton className="h-3 w-16 bg-gray-200/70" />
            </div>

            {/* Title */}
            <Skeleton className="h-5 w-full bg-gray-200/70" />
            <Skeleton className="h-5 w-3/4 bg-gray-200/70" />

            {/* Instructor */}
            <div className="flex items-center gap-1.5">
              <Skeleton className="w-5 h-5 rounded-full bg-gray-200/70" />
              <Skeleton className="h-3 w-24 bg-gray-200/70" />
            </div>

            {/* Description */}
            <Skeleton className="h-3 w-full bg-gray-200/70" />
            <Skeleton className="h-3 w-5/6 bg-gray-200/70" />

            {/* Notes (optional - sometimes shown) */}
            <Skeleton className="h-8 w-full rounded bg-gray-200/70" />

            {/* Stats Row */}
            <div className="flex items-center gap-3 py-2.5 border-y border-gray-200">
              <Skeleton className="h-3 w-16 bg-gray-200/70" />
              <Skeleton className="h-3 w-16 bg-gray-200/70" />
              <Skeleton className="h-3 w-20 ml-auto bg-gray-200/70" />
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1">
              <Skeleton className="h-5 w-12 rounded bg-gray-200/70" />
              <Skeleton className="h-5 w-16 rounded bg-gray-200/70" />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
              <Skeleton className="h-8 flex-1 rounded bg-gray-200/70" />
              <Skeleton className="h-8 w-20 rounded bg-gray-200/70" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Helper functions with proper type safety
const formatDuration = (mins?: number): string => {
  if (!mins || isNaN(mins)) return '—';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h > 0) return `${h}h${m > 0 ? ` ${m}m` : ''}`;
  return `${m}m`;
};

const getLevelColor = (level: string): string => {
  switch (level?.toUpperCase()) {
    case 'BEGINNER': return '#22c55e';
    case 'INTERMEDIATE': return '#3b82f6';
    case 'ADVANCED': return '#8b5cf6';
    case 'EXPERT': return '#ec4899';
    default: return '#64748b';
  }
};

const getLevelLabel = (level: string): string => {
  if (!level) return 'Course';
  return level.charAt(0).toUpperCase() + level.slice(1).toLowerCase();
};

// Safe rating getter
const getNumericRating = (rating: number | string | undefined | null): number => {
  if (rating === undefined || rating === null) return 0;
  if (typeof rating === 'number') return isNaN(rating) ? 0 : rating;
  if (typeof rating === 'string') {
    const parsed = parseFloat(rating);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

// Safe rating formatter
const formatRating = (rating: number | string | undefined | null): string => {
  const numRating = getNumericRating(rating);
  return numRating > 0 ? numRating.toFixed(1) : '—';
};

const DEFAULT_THUMBNAIL = 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=240&fit=crop';

// Clean Saved Course Card (CuratedPathCarousel style)
const CleanSavedCourseCard = ({ 
  course, 
  isHovered, 
  onHover,
  onRemove,
  isRemoving 
}: { 
  course: SavedCourse;
  isHovered: boolean;
  onHover: (id: string | null) => void;
  onRemove: (course: SavedCourse) => void;
  isRemoving: boolean;
}) => {
  const levelColor = getLevelColor(course.level);
  const numRating = getNumericRating(course.average_rating);
  const formattedRating = formatRating(course.average_rating);
  const totalReviews = course.total_reviews || 0;
  const enrollmentCount = course.enrollment_count || 0;

  return (
    <div
      className="relative bg-white flex flex-col h-full transition-all duration-300 cursor-pointer overflow-hidden"
      style={{
        border: `1px solid ${isHovered ? 'rgba(45,106,79,0.22)' : 'rgba(30,47,94,0.08)'}`,
        boxShadow: isHovered
          ? '0 20px 40px -8px rgba(45,106,79,0.18)'
          : '0 4px 16px -4px rgba(0,0,0,0.06)',
        transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
      }}
      onMouseEnter={() => onHover(course.saved_id)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Accent top bar */}
      <div
        className="absolute top-0 left-0 h-[3px] z-10 transition-all duration-500"
        style={{
          width: isHovered ? '100%' : '32px',
          background: `linear-gradient(90deg, #2D6A4F, #74C69D)`,
        }}
      />

      {/* Thumbnail */}
      <div className="relative h-44 overflow-hidden bg-[#F8F9FA] flex-shrink-0">
        <img
          src={course.thumbnail_url || DEFAULT_THUMBNAIL}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-500"
          style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
          onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_THUMBNAIL; }}
        />

        {/* Play overlay */}
        <div
          className="absolute inset-0 flex items-center justify-center transition-all duration-300"
          style={{
            backgroundColor: isHovered ? 'rgba(0,0,0,0.28)' : 'rgba(0,0,0,0)',
          }}
        >
          <Link href={`/courses/${course.id}`} onClick={(e) => e.stopPropagation()}>
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300"
              style={{
                backgroundColor: '#fff',
                boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                opacity: isHovered ? 1 : 0,
                transform: isHovered ? 'scale(1)' : 'scale(0.8)',
              }}
            >
              <PlayCircle className="w-4 h-4" style={{ color: '#2D6A4F' }} />
            </div>
          </Link>
        </div>

        {/* Remove button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(course);
          }}
          className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 bg-white/90 hover:bg-white shadow-md z-20"
          disabled={isRemoving}
        >
          {isRemoving ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" style={{ color: '#ef4444' }} />
          ) : (
            <BookmarkCheck className="w-3.5 h-3.5" style={{ color: '#2D6A4F' }} />
          )}
        </button>

        {/* Level Badge */}
        <div className="absolute top-3 left-3">
          <span
            className="px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider"
            style={{ backgroundColor: levelColor }}
          >
            {getLevelLabel(course.level)}
          </span>
        </div>

        {/* Course Type Badge */}
        <div className="absolute bottom-3 right-3">
          <span
            className="px-2 py-0.5 text-[10px] font-semibold text-white flex items-center gap-1 uppercase"
            style={{ 
              backgroundColor: course.course_type === 'PRIVATE' ? '#8b5cf6' : '#2D6A4F' 
            }}
          >
            {course.course_type === 'PRIVATE' ? 
              <Lock className="w-2.5 h-2.5" /> : 
              <Globe className="w-2.5 h-2.5" />
            }
            {course.course_type}
          </span>
        </div>

        {/* Price Badge */}
        <div className="absolute bottom-3 left-3">
          <span
            className="px-2 py-0.5 text-[10px] font-bold text-white"
            style={{ backgroundColor: course.price === 0 ? '#22c55e' : '#2D6A4F' }}
          >
            {course.price === 0 ? 'Free' : `$${course.price}`}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Rating + Saved Date */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.round(numRating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="text-[10px] ml-1" style={{ color: '#717182' }}>
              {formattedRating} {totalReviews > 0 && `(${totalReviews})`}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[10px]" style={{ color: '#717182' }}>
            <Calendar className="w-2.5 h-2.5" />
            {format(new Date(course.saved_at), "MMM d")}
          </div>
        </div>

        {/* Title */}
        <Link href={`/courses/${course.id}`} onClick={(e) => e.stopPropagation()}>
          <h3
            className="text-[13px] font-bold leading-snug line-clamp-2 mb-1.5 transition-colors duration-200 hover:underline"
            style={{ color: isHovered ? '#2D6A4F' : '#1E2F5E' }}
          >
            {course.title}
          </h3>
        </Link>

        {/* Instructor */}
        <div className="flex items-center gap-1.5 mb-2">
          {course.instructor?.avatar ? (
            <img
              src={course.instructor.avatar}
              alt={course.instructor.name}
              className="w-5 h-5 rounded-full object-cover"
            />
          ) : (
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
              style={{ backgroundColor: '#2D6A4F' }}
            >
              {course.instructor?.name?.charAt(0) || 'I'}
            </div>
          )}
          <span className="text-[11px]" style={{ color: '#717182' }}>
            {course.instructor?.name || 'Unknown Instructor'}
          </span>
        </div>

        {/* Description */}
        <p className="text-[11px] leading-relaxed line-clamp-2 mb-3 flex-1" style={{ color: '#717182' }}>
          {course.description}
        </p>

        {/* Notes (if any) */}
        {course.notes && (
          <div 
            className="mb-3 p-2 rounded text-[10px] italic"
            style={{ backgroundColor: 'rgba(45,106,79,0.06)', color: '#2D6A4F' }}
          >
            "{course.notes.length > 60 ? course.notes.slice(0, 60) + '...' : course.notes}"
          </div>
        )}

        {/* Stats row */}
        <div
          className="flex items-center gap-3 py-2.5 mb-3"
          style={{ borderTop: '1px solid rgba(30,47,94,0.06)', borderBottom: '1px solid rgba(30,47,94,0.06)' }}
        >
          <div className="flex items-center gap-1 text-[10px]" style={{ color: '#717182' }}>
            <Users className="w-3 h-3" style={{ color: '#74C69D' }} />
            {enrollmentCount.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-[10px]" style={{ color: '#717182' }}>
            <Clock className="w-3 h-3" style={{ color: '#74C69D' }} />
            {formatDuration(course.duration_minutes)}
          </div>
          <div className="flex items-center gap-1 text-[10px] ml-auto" style={{ color: '#717182' }}>
            <BookOpen className="w-3 h-3" style={{ color: '#74C69D' }} />
            {course.language || "English"}
          </div>
        </div>

        {/* Tags */}
        {course.tags && course.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {course.tags.slice(0, 2).map((tag, i) => (
              <span
                key={i}
                className="text-[10px] px-2 py-0.5 font-medium"
                style={{
                  backgroundColor: 'rgba(45,106,79,0.06)',
                  color: '#2D6A4F',
                }}
              >
                {tag}
              </span>
            ))}
            {course.tags.length > 2 && (
              <span className="text-[10px]" style={{ color: '#717182' }}>+{course.tags.length - 2}</span>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-2 pt-2 mt-auto" style={{ borderTop: '1px solid rgba(30,47,94,0.06)' }}>
          <Link
            href={`/courses/${course.id}`}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 flex items-center justify-center gap-1 text-[11px] font-semibold px-3 py-1.5 transition-all duration-200"
            style={{
              backgroundColor: isHovered ? '#2D6A4F' : 'transparent',
              color: isHovered ? '#fff' : '#2D6A4F',
              border: '1.5px solid #2D6A4F',
            }}
          >
            View Details
            <ArrowRight className="w-3 h-3" />
          </Link>
          <Link
            href={`/courses/${course.id}/enroll`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-center gap-1 text-[11px] font-semibold px-3 py-1.5 transition-all duration-200"
            style={{
              backgroundColor: 'transparent',
              color: '#717182',
              border: '1.5px solid rgba(30,47,94,0.15)',
            }}
          >
            Enroll
          </Link>
        </div>
      </div>
    </div>
  );
};

export default function LearnerSavedCoursesPage() {
  const { user } = useAppSelector((state) => state.cpdAuth);
  
  const [loading, setLoading] = useState(true);
  const [savedCourses, setSavedCourses] = useState<SavedCourse[]>([]);
  const [stats, setStats] = useState<SavedCoursesStats | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterLevel, setFilterLevel] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<SavedCourse | null>(null);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchSavedCourses();
    }
  }, [user]);

  const fetchSavedCourses = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("cpd_token");
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/saved-courses/user/${user?.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSavedCourses(data.data || []);
        
        const stats = calculateSavedStats(data.data || []);
        setStats(stats);
      } else {
        toast.error("Failed to load saved courses");
      }
    } catch (error) {
      toast.error("Failed to load saved courses");
    } finally {
      setLoading(false);
    }
  };

  const calculateSavedStats = (courses: SavedCourse[]): SavedCoursesStats => {
    const moocCount = courses.filter(c => c.course_type === "PUBLIC").length;
    const spocCount = courses.filter(c => c.course_type === "PRIVATE").length;

    const levelCounts: Record<string, number> = {};
    courses.forEach(c => {
      levelCounts[c.level] = (levelCounts[c.level] || 0) + 1;
    });
    const byLevel = Object.entries(levelCounts).map(([level, count]) => ({ level, count }));

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentlySaved = courses.filter(
      c => new Date(c.saved_at) >= sevenDaysAgo
    ).length;

    return {
      total_saved: courses.length,
      mooc_count: moocCount,
      spoc_count: spocCount,
      by_level: byLevel,
      recently_saved: recentlySaved,
    };
  };

  const handleRemoveSaved = async (savedId: string) => {
    setRemovingId(savedId);
    try {
      const token = localStorage.getItem("cpd_token");
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/saved-courses/${savedId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setSavedCourses(prev => prev.filter(c => c.saved_id !== savedId));
        toast.success("Course removed from saved");
      } else {
        toast.error("Failed to remove course");
      }
    } catch (error) {
      toast.error("Failed to remove course");
    } finally {
      setRemovingId(null);
      setShowRemoveDialog(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchSavedCourses();
    setRefreshing(false);
    toast.success("Saved courses refreshed");
  };

  const filteredCourses = savedCourses
    .filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.instructor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (course.notes?.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesType = filterType === "all" || course.course_type === filterType;
      
      const matchesLevel = filterLevel === "all" || course.level === filterLevel;
      
      return matchesSearch && matchesType && matchesLevel;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return new Date(b.saved_at).getTime() - new Date(a.saved_at).getTime();
        case "title":
          return a.title.localeCompare(b.title);
        case "rating":
          return (b.average_rating || 0) - (a.average_rating || 0);
        default:
          return 0;
      }
    });

  // Loading state with skeleton
  if (loading) {
    return <SavedCoursesPageSkeleton />;
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Saved Courses
          </h1>
          <p className="text-gray-600">
            Courses you've bookmarked for later
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && stats.total_saved > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Saved Courses</p>
                  <p className="text-3xl font-bold">{stats.total_saved}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Bookmark className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Public Courses</p>
                  <p className="text-3xl font-bold">{stats.mooc_count}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Globe className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Private Courses</p>
                  <p className="text-3xl font-bold">{stats.spoc_count}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Recently Saved</p>
                  <p className="text-3xl font-bold">{stats.recently_saved}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search saved courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full md:w-40">
            <BookOpen className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Course Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="PUBLIC">Public Course</SelectItem>
            <SelectItem value="PRIVATE">Private Course</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterLevel} onValueChange={setFilterLevel}>
          <SelectTrigger className="w-full md:w-40">
            <Target className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="BEGINNER">Beginner</SelectItem>
            <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
            <SelectItem value="ADVANCED">Advanced</SelectItem>
            <SelectItem value="EXPERT">Expert</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-40">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Recently Saved</SelectItem>
            <SelectItem value="title">Course Title</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Saved Courses Grid */}
      {filteredCourses.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Bookmark className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              No Saved Courses
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm
                ? "No courses match your search criteria"
                : "You haven't saved any courses yet. Browse courses and click the bookmark icon to save them for later."}
            </p>
            <Button asChild>
              <Link href="/dashboard/learner/browse/all">
                Browse Courses
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CleanSavedCourseCard
              key={course.saved_id}
              course={course}
              isHovered={hoveredCardId === course.saved_id}
              onHover={setHoveredCardId}
              onRemove={(c) => {
                setSelectedCourse(c);
                setShowRemoveDialog(true);
              }}
              isRemoving={removingId === course.saved_id}
            />
          ))}
        </div>
      )}

      {/* Remove Confirmation Dialog */}
      <Dialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove from Saved</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this course from your saved list?
            </DialogDescription>
          </DialogHeader>

          {selectedCourse && (
            <div className="py-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                {selectedCourse.thumbnail_url ? (
                  <img
                    src={selectedCourse.thumbnail_url}
                    alt={selectedCourse.title}
                    className="w-12 h-12 rounded object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                )}
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{selectedCourse.title}</h4>
                  <p className="text-xs text-gray-500">
                    Saved on {format(new Date(selectedCourse.saved_at), "MMM d, yyyy")}
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowRemoveDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedCourse && handleRemoveSaved(selectedCourse.saved_id)}
              disabled={removingId === selectedCourse?.saved_id}
            >
              {removingId === selectedCourse?.saved_id ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}