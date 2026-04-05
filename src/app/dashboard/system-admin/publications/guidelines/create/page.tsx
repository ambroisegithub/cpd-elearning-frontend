// src/app/dashboard/system-admin/publications/guidelines/create/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  createGuideline,
  updateGuideline,
  adminFetchGuidelineById,
  clearSelectedGuideline,
  clearError,
} from "@/lib/features/publications/publicationsSlice";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  ArrowLeft,
  Save,
  Loader2,
  AlertCircle,
  X,
  CheckCircle,
  Eye,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const GUIDELINE_CATEGORIES = [
  { value: "Clinical Practice", label: "Clinical Practice" },
  { value: "Public Health", label: "Public Health" },
  { value: "Infection Control", label: "Infection Control" },
  { value: "Medication Safety", label: "Medication Safety" },
  { value: "Patient Care", label: "Patient Care" },
  { value: "Administrative", label: "Administrative" },
];

export default function CreateEditGuidelinePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const guidelineId = searchParams.get("id");
  const isEditMode = !!guidelineId;

  const dispatch = useAppDispatch();
  const { selectedGuideline, isSubmitting, error } = useAppSelector(
    (state) => state.publications
  );

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    status: "draft" as "draft" | "published",
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isEditMode && guidelineId) {
      setIsLoading(true);
      dispatch(adminFetchGuidelineById(guidelineId))
        .unwrap()
        .then((guideline) => {
          setFormData({
            title: guideline.title || "",
            content: guideline.content || "",
            category: guideline.category || "",
            status: guideline.status || "draft",
          });
        })
        .catch(() => {
          toast.error("Failed to load guideline");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }

    return () => {
      dispatch(clearSelectedGuideline());
      dispatch(clearError());
    };
  }, [dispatch, guidelineId, isEditMode]);

  const handleSubmit = async (status: "draft" | "published") => {
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!formData.content.trim()) {
      toast.error("Content is required");
      return;
    }

    const submitData = {
      title: formData.title,
      content: formData.content,
      category: formData.category,
      status,
    };

    try {
      if (isEditMode && guidelineId) {
        await dispatch(updateGuideline({ id: guidelineId, data: submitData })).unwrap();
        toast.success("Guideline updated successfully");
      } else {
        await dispatch(createGuideline(submitData)).unwrap();
        toast.success("Guideline created successfully");
      }
      router.push("/dashboard/system-admin/publications/guidelines");
    } catch (err: any) {
      toast.error(err || `Failed to ${isEditMode ? "update" : "create"} guideline`);
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
            href="/dashboard/system-admin/publications/guidelines"
            className="flex items-center gap-2 text-slate-600 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Guidelines</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">
            {isEditMode ? "Edit Guideline" : "Create Guideline"}
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
                placeholder="Enter guideline title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-1"
              />
            </div>

            {/* Category */}
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
                {GUIDELINE_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Content */}
            <div>
              <Label className="text-sm font-semibold text-slate-700 mb-2 block">
                Guideline Content <span className="text-red-500">*</span>
              </Label>
              <RichTextEditor
                value={formData.content}
                onChange={(value) => setFormData({ ...formData, content: value })}
                placeholder="Write the full guideline content here..."
                className="min-h-[500px]"
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
                    <X className="w-3 h-3 inline mr-1" />
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