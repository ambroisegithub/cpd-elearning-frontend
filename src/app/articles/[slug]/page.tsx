"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchArticleBySlug, clearSelectedArticle } from "@/lib/features/publications/publicationsSlice";
import { Navbar } from "@/app/components/home/NavigationBar";
import { Footer } from "@/app/components/home/Footer";
import {
  ArrowLeft,
  Calendar,
  User,
  FolderOpen,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import DOMPurify from "dompurify";

export default function ArticleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { selectedArticle, isLoading } = useAppSelector(
    (state) => state.publications
  );

  const slug = params.slug as string;

  useEffect(() => {
    if (slug) {
      dispatch(fetchArticleBySlug(slug));
    }
    return () => {
      dispatch(clearSelectedArticle());
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

  if (!selectedArticle) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <AlertCircle className="w-12 h-12 text-slate-400" />
          <p className="text-slate-500">Article not found</p>
          <Link href="/articles" className="text-primary hover:underline">
            ← Back to Articles
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
          href="/articles"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-primary transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Articles
        </Link>
      </div>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          {/* Category Badge */}
          {selectedArticle.category && (
            <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/15">
              <FolderOpen className="w-3 h-3 mr-1" />
              {selectedArticle.category}
            </Badge>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            {selectedArticle.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
            {selectedArticle.author_name && (
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                By {selectedArticle.author_name}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(selectedArticle.published_at)}
            </span>
          </div>
        </header>

        {/* Cover Image */}
        {selectedArticle.cover_image_url && (
          <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
            <img
              src={selectedArticle.cover_image_url}
              alt={selectedArticle.title}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        {/* Abstract */}
        {selectedArticle.abstract && (
          <div className="mb-8 p-6 bg-green-50 border-l-4 border-primary rounded-r-lg">
            <h2 className="text-sm font-semibold text-primary uppercase tracking-wide mb-2">
              Abstract
            </h2>
            <div
              className="prose prose-slate max-w-none prose-p:text-slate-700 prose-p:leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(selectedArticle.abstract),
              }}
            />
          </div>
        )}

        {/* Full Article */}
        {selectedArticle.manuscript && (
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4">Full Article</h2>
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
                __html: DOMPurify.sanitize(selectedArticle.manuscript),
              }}
            />
          </div>
        )}

        {/* Footer Meta */}
        <div className="mt-12 pt-6 border-t border-slate-200 text-xs text-slate-400">
          <p>Published: {formatDate(selectedArticle.published_at)}</p>
          <p>Last updated: {new Date(selectedArticle.updated_at).toLocaleDateString()}</p>
        </div>
      </article>

      <Footer />
    </div>
  );
}