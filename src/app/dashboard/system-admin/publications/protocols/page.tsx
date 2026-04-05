"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  adminFetchProtocols,
  deleteProtocol,
  clearError,
} from "@/lib/features/publications/publicationsSlice";
import { useRouter } from "next/navigation";
import {
  ClipboardList,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  X,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Calendar,
  User,
  ImageIcon,
  Hash,
} from "lucide-react";
import Link from "next/link";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const PROTOCOL_CATEGORIES = [
  { value: "Clinical Protocol", label: "Clinical Protocol" },
  { value: "Research Protocol", label: "Research Protocol" },
  { value: "Treatment Protocol", label: "Treatment Protocol" },
  { value: "Emergency Protocol", label: "Emergency Protocol" },
  { value: "Preventive Protocol", label: "Preventive Protocol" },
];

export default function ProtocolsManagementPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { protocols, protocolsPagination, isLoading, error } = useAppSelector(
    (state) => state.publications
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProtocol, setSelectedProtocol] = useState<any>(null);

  useEffect(() => {
    loadProtocols();
  }, [dispatch, currentPage, itemsPerPage, statusFilter]);

  const loadProtocols = () => {
    dispatch(
      adminFetchProtocols({
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
      })
    );
  };

  const handleSearch = () => {
    setCurrentPage(1);
    loadProtocols();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleDeleteClick = (protocol: any) => {
    setSelectedProtocol(protocol);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (selectedProtocol) {
      try {
        await dispatch(deleteProtocol(selectedProtocol.id)).unwrap();
        toast.success("Protocol deleted successfully");
        loadProtocols();
      } catch (err: any) {
        toast.error(err || "Failed to delete protocol");
      } finally {
        setShowDeleteModal(false);
        setSelectedProtocol(null);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === "published") {
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Published
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200">
        <XCircle className="w-3 h-3 mr-1" />
        Draft
      </Badge>
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const stripHtml = (html: string) => {
    return html?.replace(/<[^>]*>/g, "").slice(0, 100) || "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <ClipboardList className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Manage Protocols</h1>
                <p className="text-xs text-slate-500">
                  {protocolsPagination.total} total protocols
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/system-admin/publications/protocols/create"
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Create Protocol
            </Link>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search protocols by title, category, or version..."
                className="pl-9"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
            <Button
              onClick={handleSearch}
              variant="default"
              size="sm"
              className="bg-primary hover:bg-primary/90"
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
            <Button
              onClick={loadProtocols}
              variant="outline"
              size="sm"
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
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

        {/* Protocols Table */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : protocols.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
            <ClipboardList className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">
              No Protocols Found
            </h3>
            <p className="text-slate-500 mb-4">
              {searchQuery ? "Try adjusting your search" : "Get started by creating your first protocol"}
            </p>
            {!searchQuery && (
              <Link
                href="/dashboard/system-admin/publications/protocols/create"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                <Plus className="w-4 h-4" />
                Create First Protocol
              </Link>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-primary text-white">
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Cover</th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Title</th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Version</th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Published</th>
                    <th className="px-4 py-3 text-center text-xs font-bold uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {protocols.map((protocol, index) => (
                    <tr key={protocol.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-4 py-3">
                        {protocol.cover_image_url ? (
                          <img
                            src={protocol.cover_image_url}
                            alt={protocol.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                            <ClipboardList className="w-5 h-5 text-slate-400" />
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-slate-900 line-clamp-1">
                            {protocol.title}
                          </p>
                          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                            {stripHtml(protocol.content)}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {protocol.version ? (
                          <Badge variant="outline" className="text-xs">
                            <Hash className="w-3 h-3 mr-1" />
                            {protocol.version}
                          </Badge>
                        ) : (
                          <span className="text-slate-400 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {protocol.category ? (
                          <Badge variant="outline" className="text-xs">
                            {protocol.category}
                          </Badge>
                        ) : (
                          <span className="text-slate-400 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {getStatusBadge(protocol.status)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <Calendar className="w-3 h-3" />
                          {formatDate(protocol.published_at || protocol.created_at)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() =>
                              router.push(`/dashboard/system-admin/publications/protocols/${protocol.id}`)
                            }
                            className="p-1.5 bg-slate-100 text-slate-600 rounded hover:bg-slate-200 transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() =>
                              router.push(`/dashboard/system-admin/publications/protocols/create?id=${protocol.id}`)
                            }
                            className="p-1.5 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                            title="Edit Protocol"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(protocol)}
                            className="p-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                            title="Delete Protocol"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {protocolsPagination.totalPages > 1 && (
              <div className="bg-slate-50 px-4 py-3 border-t border-slate-200">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="text-xs text-slate-600">
                    Showing {(protocolsPagination.page - 1) * itemsPerPage + 1} to{" "}
                    {Math.min(protocolsPagination.page * itemsPerPage, protocolsPagination.total)} of{" "}
                    {protocolsPagination.total}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-1.5 border border-slate-300 rounded hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(protocolsPagination.totalPages, 5) }, (_, i) => {
                        let pageNum;
                        if (protocolsPagination.totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= protocolsPagination.totalPages - 2) {
                          pageNum = protocolsPagination.totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={cn(
                              "px-3 py-1 rounded text-xs font-medium transition-colors",
                              currentPage === pageNum
                                ? "bg-primary text-white"
                                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-300"
                            )}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === protocolsPagination.totalPages}
                      className="p-1.5 border border-slate-300 rounded hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="px-2 py-1 text-xs border border-slate-300 rounded bg-white"
                    >
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AlertDialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Protocol</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedProtocol?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}