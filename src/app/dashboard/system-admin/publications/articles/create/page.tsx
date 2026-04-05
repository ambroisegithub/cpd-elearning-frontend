"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  createArticle,
  updateArticle,
  adminFetchArticleById,
  clearSelectedArticle,
  clearError,
} from "@/lib/features/publications/publicationsSlice";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  ArrowLeft,
  Save,
  Upload,
  Image,
  Loader2,
  AlertCircle,
  X,
  CheckCircle,
  Eye,
  FileText,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { value: "Research", label: "Research" },
  { value: "Clinical", label: "Clinical" },
  { value: "Public Health", label: "Public Health" },
  { value: "Policy", label: "Policy" },
  { value: "Education", label: "Education" },
  { value: "Technology", label: "Technology" },
];

export default function CreateEditArticlePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const articleId = searchParams.get("id");
  const isEditMode = !!articleId;

  const dispatch = useAppDispatch();
  const { selectedArticle, isSubmitting, error } = useAppSelector(
    (state) => state.publications
  );

  const [formData, setFormData] = useState({
    title: "",
    abstract: "",
    manuscript: "",
    author_name: "",
    category: "",
    status: "draft" as "draft" | "published",
  });

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isEditMode && articleId) {
      setIsLoading(true);
      dispatch(adminFetchArticleById(articleId))
        .unwrap()
        .then((article) => {
          setFormData({
            title: article.title || "",
            abstract: article.abstract || "",
            manuscript: article.manuscript || "",
            author_name: article.author_name || "",
            category: article.category || "",
            status: article.status || "draft",
          });
          if (article.cover_image_url) {
            setCoverPreview(article.cover_image_url);
          }
        })
        .catch(() => {
          toast.error("Failed to load article");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }

    return () => {
      dispatch(clearSelectedArticle());
      dispatch(clearError());
    };
  }, [dispatch, articleId, isEditMode]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (status: "draft" | "published") => {
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!formData.abstract.trim()) {
      toast.error("Abstract is required");
      return;
    }
    if (!formData.manuscript.trim()) {
      toast.error("Manuscript content is required");
      return;
    }

    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("abstract", formData.abstract);
    submitData.append("manuscript", formData.manuscript);
    if (formData.author_name) submitData.append("author_name", formData.author_name);
    if (formData.category) submitData.append("category", formData.category);
    submitData.append("status", status);
    if (coverFile) submitData.append("cover_image", coverFile);

    try {
      if (isEditMode && articleId) {
        await dispatch(updateArticle({ id: articleId, formData: submitData })).unwrap();
        toast.success("Article updated successfully");
      } else {
        await dispatch(createArticle(submitData)).unwrap();
        toast.success("Article created successfully");
      }
      router.push("/dashboard/system-admin/publications/articles");
    } catch (err: any) {
      toast.error(err || `Failed to ${isEditMode ? "update" : "create"} article`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/dashboard/system-admin/publications/articles"
            className="flex items-center gap-2 text-slate-600 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Articles</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">
            {isEditMode ? "Edit Article" : "Create Article"}
          </h1>
          <div className="w-20" />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-center">
            <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
            <span className="text-sm text-red-800">{error}</span>
            <button
              onClick={() => dispatch(clearError())}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 space-y-6">
            {/* Title */}
            <div>
              <Label htmlFor="title" className="text-sm font-semibold text-slate-700">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder="Enter article title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-1"
              />
            </div>

            {/* Author and Category Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="author_name" className="text-sm font-semibold text-slate-700">
                  Author Name
                </Label>
                <Input
                  id="author_name"
                  placeholder="Author name"
                  value={formData.author_name}
                  onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="category" className="text-sm font-semibold text-slate-700">
                  Category
                </Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Cover Image Upload */}
            <div>
              <Label className="text-sm font-semibold text-slate-700 mb-2 block">
                Cover Image
              </Label>
              <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 text-center">
                {coverPreview ? (
                  <div className="relative inline-block">
                    <img
                      src={coverPreview}
                      alt="Cover preview"
                      className="max-h-48 rounded-lg object-cover"
                    />
                    <button
                      onClick={() => {
                        setCoverFile(null);
                        setCoverPreview(null);
                      }}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Image className="w-8 h-8 text-slate-400" />
                    <p className="text-sm text-slate-500">
                      Drag and drop or click to upload
                    </p>
                    <p className="text-xs text-slate-400">
                      Recommended: 1200x800px, JPG or PNG
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById("cover-upload")?.click()}
                    >
                      <Upload className="w-3 h-3 mr-1" />
                      Choose File
                    </Button>
                    <input
                      id="cover-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Abstract */}
            <div>
              <Label className="text-sm font-semibold text-slate-700 mb-2 block">
                Abstract <span className="text-red-500">*</span>
              </Label>
              <RichTextEditor
                value={formData.abstract}
                onChange={(value) => setFormData({ ...formData, abstract: value })}
                placeholder="Write a compelling abstract for your article..."
                className="min-h-[150px]"
              />
              <p className="text-xs text-slate-400 mt-1">
                A brief summary of your article (visible in listings)
              </p>
            </div>

            {/* Manuscript */}
            <div>
              <Label className="text-sm font-semibold text-slate-700 mb-2 block">
                Manuscript <span className="text-red-500">*</span>
              </Label>
              <RichTextEditor
                value={formData.manuscript}
                onChange={(value) => setFormData({ ...formData, manuscript: value })}
                placeholder="Write the full article content here..."
                className="min-h-[400px]"
              />
            </div>

            {/* Status Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-600">Status:</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: "draft" })}
                    className={cn(
                      "px-3 py-1.5 text-sm rounded-lg transition-colors",
                      formData.status === "draft"
                        ? "bg-amber-100 text-amber-700 border border-amber-200"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    )}
                  >
                    <XCircle className="w-3 h-3 inline mr-1" />
                    Draft
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: "published" })}
                    className={cn(
                      "px-3 py-1.5 text-sm rounded-lg transition-colors",
                      formData.status === "published"
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    )}
                  >
                    <CheckCircle className="w-3 h-3 inline mr-1" />
                    Published
                  </button>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => handleSubmit("draft")}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Save as Draft
                </Button>
                <Button
                  type="button"
                  onClick={() => handleSubmit("published")}
                  disabled={isSubmitting}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Eye className="w-4 h-4 mr-2" />
                  )}
                  Publish
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}