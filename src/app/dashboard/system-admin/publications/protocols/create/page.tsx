"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  createProtocol,
  updateProtocol,
  adminFetchProtocolById,
  clearSelectedProtocol,
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
  Upload,
  Image,
  Loader2,
  AlertCircle,
  X,
  CheckCircle,
  Eye,
  ClipboardList,
  Hash,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const PROTOCOL_CATEGORIES = [
  { value: "Clinical Protocol", label: "Clinical Protocol" },
  { value: "Research Protocol", label: "Research Protocol" },
  { value: "Treatment Protocol", label: "Treatment Protocol" },
  { value: "Emergency Protocol", label: "Emergency Protocol" },
  { value: "Preventive Protocol", label: "Preventive Protocol" },
];

export default function CreateEditProtocolPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const protocolId = searchParams.get("id");
  const isEditMode = !!protocolId;

  const dispatch = useAppDispatch();
  const { selectedProtocol, isSubmitting, error } = useAppSelector(
    (state) => state.publications
  );

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    version: "",
    category: "",
    status: "draft" as "draft" | "published",
  });

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isEditMode && protocolId) {
      setIsLoading(true);
      dispatch(adminFetchProtocolById(protocolId))
        .unwrap()
        .then((protocol) => {
          setFormData({
            title: protocol.title || "",
            content: protocol.content || "",
            version: protocol.version || "",
            category: protocol.category || "",
            status: protocol.status || "draft",
          });
          if (protocol.cover_image_url) {
            setCoverPreview(protocol.cover_image_url);
          }
        })
        .catch(() => {
          toast.error("Failed to load protocol");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }

    return () => {
      dispatch(clearSelectedProtocol());
      dispatch(clearError());
    };
  }, [dispatch, protocolId, isEditMode]);

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
    if (!formData.content.trim()) {
      toast.error("Content is required");
      return;
    }

    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("content", formData.content);
    if (formData.version) submitData.append("version", formData.version);
    if (formData.category) submitData.append("category", formData.category);
    submitData.append("status", status);
    if (coverFile) submitData.append("cover_image", coverFile);

    try {
      if (isEditMode && protocolId) {
        await dispatch(updateProtocol({ id: protocolId, formData: submitData })).unwrap();
        toast.success("Protocol updated successfully");
      } else {
        await dispatch(createProtocol(submitData)).unwrap();
        toast.success("Protocol created successfully");
      }
      router.push("/dashboard/system-admin/publications/protocols");
    } catch (err: any) {
      toast.error(err || `Failed to ${isEditMode ? "update" : "create"} protocol`);
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
            href="/dashboard/system-admin/publications/protocols"
            className="flex items-center gap-2 text-slate-600 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Protocols</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">
            {isEditMode ? "Edit Protocol" : "Create Protocol"}
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
                placeholder="Enter protocol title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-1"
              />
            </div>

            {/* Version and Category Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="version" className="text-sm font-semibold text-slate-700">
                  Version
                </Label>
                <div className="relative mt-1">
                  <Hash className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="version"
                    placeholder="e.g., v2.1"
                    value={formData.version}
                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                    className="pl-9"
                  />
                </div>
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
                  {PROTOCOL_CATEGORIES.map((cat) => (
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

            {/* Content */}
            <div>
              <Label className="text-sm font-semibold text-slate-700 mb-2 block">
                Protocol Content <span className="text-red-500">*</span>
              </Label>
              <RichTextEditor
                value={formData.content}
                onChange={(value) => setFormData({ ...formData, content: value })}
                placeholder="Write the full protocol content here..."
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