"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchPublicProtocols } from "@/lib/features/publications/publicationsSlice";
import Link from "next/link";
import { Navbar } from "@/app/components/home/NavigationBar";
import { Footer } from "@/app/components/home/Footer";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Calendar,
  FolderOpen,
  Loader2,
  Hash,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const PROTOCOL_CATEGORIES = [
  "All",
  "Clinical Protocol",
  "Research Protocol",
  "Treatment Protocol",
  "Emergency Protocol",
  "Preventive Protocol",
];

export default function ProtocolsPage() {
  const dispatch = useAppDispatch();
  const { protocols, protocolsPagination, isLoading } = useAppSelector(
    (state) => state.publications
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(
      fetchPublicProtocols({
        page: currentPage,
        limit: 12,
        search: searchQuery || undefined,
        category: selectedCategory !== "All" ? selectedCategory : undefined,
      })
    );
  }, [dispatch, currentPage, searchQuery, selectedCategory]);

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const stripHtml = (html: string) => {
    return html?.replace(/<[^>]*>/g, "").slice(0, 120) + "...";
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-16 px-4 bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Health{" "}
            <span className="text-primary">Protocols</span>
          </h1>
          <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto">
            Evidence-based clinical and research protocols for healthcare professionals
          </p>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="sticky top-16 z-20 bg-white border-b border-slate-200 py-4 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
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
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {PROTOCOL_CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-1.5 text-sm font-medium rounded-full whitespace-nowrap transition-colors ${
                    selectedCategory === category
                      ? "bg-primary text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Protocols Grid */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : protocols.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-500">No protocols found.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {protocols.map((protocol) => (
                  <Link
                    key={protocol.id}
                    href={`/protocols/${protocol.slug}`}
                    className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    {/* Cover Image */}
                    <div className="relative h-48 overflow-hidden bg-slate-100">
                      {protocol.cover_image_url ? (
                        <img
                          src={protocol.cover_image_url}
                          alt={protocol.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                          <span className="text-primary/30 text-4xl">📋</span>
                        </div>
                      )}
                      <div className="absolute top-3 left-3 flex gap-2">
                        {protocol.category && (
                          <Badge className="bg-white/90 text-slate-700 hover:bg-white/90">
                            <FolderOpen className="w-3 h-3 mr-1" />
                            {protocol.category}
                          </Badge>
                        )}
                        {protocol.version && (
                          <Badge className="bg-white/90 text-slate-700 hover:bg-white/90">
                            <Hash className="w-3 h-3 mr-1" />
                            {protocol.version}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {protocol.title}
                      </h3>
                      <p className="text-sm text-slate-600 line-clamp-3 mb-3">
                        {stripHtml(protocol.content)}
                      </p>
                      <div className="flex items-center text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(protocol.published_at)}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {protocolsPagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div className="flex gap-1">
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
                          className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                            currentPage === pageNum
                              ? "bg-primary text-white"
                              : "text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === protocolsPagination.totalPages}
                    className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}