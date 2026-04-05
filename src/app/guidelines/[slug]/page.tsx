"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchGuidelineBySlug, clearSelectedGuideline } from "@/lib/features/publications/publicationsSlice";
import { Navbar } from "@/app/components/home/NavigationBar";
import { Footer } from "@/app/components/home/Footer";
import {
  ArrowLeft,
  Calendar,
  FolderOpen,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import DOMPurify from "dompurify";

export default function GuidelineDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { selectedGuideline, isLoading } = useAppSelector(
    (state) => state.publications
  );

  const slug = params.slug as string;

  useEffect(() => {
    if (slug) {
      dispatch(fetchGuidelineBySlug(slug));
    }
    return () => {
      dispatch(clearSelectedGuideline());
    };
  }, [dispatch, slug]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!selectedGuideline) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <AlertCircle className="w-12 h-12 text-slate-400" />
          <p className="text-slate-500">Guideline not found</p>
          <Link href="/guidelines" className="text-primary hover:underline">
            ← Back to Guidelines
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-4 pt-6">
        <Link
          href="/guidelines"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-primary transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Guidelines
        </Link>
      </div>

      {/* Guideline Content */}
      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          {/* Category Badge */}
          {selectedGuideline.category && (
            <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/15">
              <FolderOpen className="w-3 h-3 mr-1" />
              {selectedGuideline.category}
            </Badge>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            {selectedGuideline.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Published: {formatDate(selectedGuideline.published_at)}
            </span>
          </div>
        </header>

        {/* Guideline Content */}
        {selectedGuideline.content && (
          <div
            className="prose prose-slate max-w-none
              prose-headings:text-slate-900 prose-headings:font-bold
              prose-p:text-slate-700 prose-p:leading-relaxed
              prose-a:text-primary prose-a:underline
              prose-blockquote:border-l-primary prose-blockquote:bg-green-50/30
              prose-strong:text-slate-900
              prose-ul:text-slate-700 prose-ol:text-slate-700
              prose-img:rounded-lg prose-img:shadow-md"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(selectedGuideline.content),
            }}
          />
        )}

        {/* Footer Meta */}
        <div className="mt-12 pt-6 border-t border-slate-200 text-xs text-slate-400">
          <p>Published: {formatDate(selectedGuideline.published_at)}</p>
          <p>Last updated: {new Date(selectedGuideline.updated_at).toLocaleDateString()}</p>
        </div>
      </article>

      <Footer />
    </div>
  );
}