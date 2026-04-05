"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  adminFetchArticleById,
  deleteArticle,
  clearSelectedArticle,
} from "@/lib/features/publications/publicationsSlice";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  User,
  FolderOpen,
  Eye,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import DOMPurify from "dompurify";

export default function ArticleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { selectedArticle, isLoading } = useAppSelector(
    (state) => state.publications
  );

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (params.id) {
      dispatch(adminFetchArticleById(params.id as string));
    }
    return () => {
      dispatch(clearSelectedArticle());
    };
  }, [dispatch, params.id]);

  const handleDelete = async () => {
    if (selectedArticle) {
      try {
        await dispatch(deleteArticle(selectedArticle.id)).unwrap();
        toast.success("Article deleted successfully");
        router.push("/dashboard/system-admin/publications/articles");
      } catch (err: any) {
        toast.error(err || "Failed to delete article");
      } finally {
        setShowDeleteModal(false);
      }
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not published";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!selectedArticle) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <AlertCircle className="w-12 h-12 text-slate-400" />
        <p className="text-slate-500">Article not found</p>
        <Link href="/dashboard/system-admin/publications/articles">
          <Button variant="outline">Back to Articles</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/dashboard/system-admin/publications/articles"
            className="flex items-center gap-2 text-slate-600 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Articles</span>
          </Link>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() =>
                router.push(`/dashboard/system-admin/publications/articles/create?id=${selectedArticle.id}`)
              }
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="destructive"
              onClick={() => setShowDeleteModal(true)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        {/* Article Content */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Cover Image */}
          {selectedArticle.cover_image_url && (
            <div className="relative h-64 md:h-80 overflow-hidden">
              <img
                src={selectedArticle.cover_image_url}
                alt={selectedArticle.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content Body */}
          <div className="p-6 md:p-8">
            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-slate-500">
              {selectedArticle.category && (
                <Badge variant="outline" className="text-xs">
                  <FolderOpen className="w-3 h-3 mr-1" />
                  {selectedArticle.category}
                </Badge>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  Published: {formatDate(selectedArticle.published_at)}
                </span>
              </div>
              {selectedArticle.author_name && (
                <div className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  <span>By {selectedArticle.author_name}</span>
                </div>
              )}
              <Badge
                className={selectedArticle.status === "published" 
                  ? "bg-green-100 text-green-700" 
                  : "bg-amber-100 text-amber-700"
                }
              >
                {selectedArticle.status === "published" ? "Published" : "Draft"}
              </Badge>
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
              {selectedArticle.title}
            </h1>

            {/* Abstract */}
            {selectedArticle.abstract && (
              <div className="mb-8 p-4 bg-green-50 border-l-4 border-primary rounded-r-lg">
                <h2 className="text-sm font-semibold text-primary uppercase tracking-wide mb-2">
                  Abstract
                </h2>
                <div
                  className="prose prose-sm max-w-none prose-p:text-slate-700"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(selectedArticle.abstract),
                  }}
                />
              </div>
            )}

            {/* Manuscript */}
            {selectedArticle.manuscript && (
              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-4">
                  Full Article
                </h2>
                <div
                  className="prose prose-slate max-w-none
                    prose-headings:text-slate-900 prose-headings:font-bold
                    prose-p:text-slate-700 prose-p:leading-relaxed
                    prose-a:text-primary prose-a:underline
                    prose-blockquote:border-l-primary prose-blockquote:bg-green-50/30
                    prose-strong:text-slate-900"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(selectedArticle.manuscript),
                  }}
                />
              </div>
            )}

            {/* Footer Meta */}
            <div className="mt-8 pt-6 border-t border-slate-200 text-xs text-slate-400">
              <p>Created: {new Date(selectedArticle.created_at).toLocaleString()}</p>
              <p>Last updated: {new Date(selectedArticle.updated_at).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AlertDialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Article</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedArticle.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}