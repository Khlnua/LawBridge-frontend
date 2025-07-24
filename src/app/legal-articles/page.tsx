"use client";

import { useState } from "react";
import { Button } from "@/components";
import { useGetAdminSpecializationsQuery } from "@/generated";
import { useQuery } from "@apollo/client";
import { GET_ALL_POSTS } from "@/graphql/post";
import {
  Search,
  Filter,
  Calendar,
  User,
  Tag,
  ChevronRight,
  X,
} from "lucide-react";

const ArticlesPage = () => {
  const [selectedSpecId, setSelectedSpecId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // const { lawyerId } = useParams() as { lawyerId: string };

  const {
    data: specData,
    loading: specLoading,
    error: specError,
  } = useGetAdminSpecializationsQuery();

  const {
    data: postData,
    loading: postLoading,
    error: postError,
  } = useQuery(GET_ALL_POSTS);

  const handleFilter = (specId: string) => {
    setSelectedSpecId((prev) => (prev === specId ? null : specId));
  };

  const clearFilters = () => {
    setSelectedSpecId(null);
    setSearchTerm("");
  };

  if (specLoading || postLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 text-lg">Ачааллаж байна...</p>
        </div>
      </div>
    );
  }

  if (specError || postError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
        <div className="text-center space-y-4 p-8 bg-white rounded-xl shadow-lg max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Алдаа гарлаа</h2>
          <p className="text-gray-600">
            {specError?.message || postError?.message}
          </p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Дахин оролдох
          </Button>
        </div>
      </div>
    );
  }

  const specializations = specData?.getAdminSpecializations || [];
  const posts = postData?.getPosts || [];

  const filteredPosts = posts.filter((post: any) => {
    const matchesSearch =
      !searchTerm ||
      post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content?.text?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSpec =
      !selectedSpecId ||
      post.specialization?.some(
        (spec: any) => spec.id === selectedSpecId || spec._id === selectedSpecId
      );

    return matchesSearch && matchesSpec;
  });

  const selectedSpecName = selectedSpecId
    ? specializations.find((s) => s.id === selectedSpecId)?.categoryName
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header Section - Full Width */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Хуулийн нийтлэлүүд
            </h1>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              Хуулийн мэргэжилтнүүдийн туршлага, зөвлөгөө болон сүүлийн үеийн
              хуулийн мэдээллүүд
            </p>
          </div>
        </div>
      </div>

      {/* Main content - Full Width with responsive padding */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Search and Filter Controls */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 space-y-6 max-w-none">
          {/* Search Bar */}
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Нийтлэл хайх..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
            />
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
            >
              <Filter className="h-4 w-4" />
              Ангилал ({specializations.length})
              <ChevronRight
                className={`h-4 w-4 transition-transform duration-200 ${
                  showFilters ? "rotate-90" : ""
                }`}
              />
            </Button>

            {(selectedSpecId || searchTerm) && (
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
              >
                <X className="h-4 w-4 mr-2" />
                Цэвэрлэх
              </Button>
            )}
          </div>

          {/* Filter Buttons */}
          {showFilters && (
            <div className="space-y-4 border-t border-gray-100 pt-6">
              <div className="flex flex-wrap gap-3 justify-center">
                {specializations.map(
                  (spec: { id: string; categoryName: string }) => (
                    <Button
                      key={spec.id}
                      variant={
                        selectedSpecId === spec.id ? "default" : "outline"
                      }
                      onClick={() => handleFilter(spec.id)}
                      className={`
                      px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-105
                      ${
                        selectedSpecId === spec.id
                          ? "bg-blue-600 text-white shadow-lg border-blue-600"
                          : "bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50"
                      }
                    `}
                    >
                      <Tag className="h-4 w-4 mr-2" />
                      {spec.categoryName}
                    </Button>
                  )
                )}
              </div>
            </div>
          )}

          {/* Active Filters Display */}
          {(selectedSpecName || searchTerm) && (
            <div className="flex flex-wrap gap-3 border-t border-gray-100 pt-4 justify-center">
              <span className="text-sm text-gray-500 font-medium">
                Идэвхтэй шүүлтүүр:
              </span>
              {selectedSpecName && (
                <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  <Tag className="h-3 w-3" />
                  {selectedSpecName}
                  <button
                    onClick={() => setSelectedSpecId(null)}
                    className="hover:text-blue-900"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              {searchTerm && (
                <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  <Search className="h-3 w-3" />&quot;{searchTerm}&quot;
                  <button
                    onClick={() => setSearchTerm("")}
                    className="hover:text-green-900"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-800">
            {selectedSpecName
              ? `"${selectedSpecName}" ангилалын нийтлэлүүд`
              : searchTerm
              ? `"${searchTerm}" хайлтын үр дүн`
              : "Бүх нийтлэлүүд"}
          </h2>
          <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {filteredPosts.length} нийтлэл олдлоо
          </div>
        </div>

        {/* Articles Grid - More responsive layout */}
        <div className="space-y-6">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-600 mb-2">
                Нийтлэл олдсонгүй
              </h3>
              <p className="text-gray-500 mb-6">
                Таны хайлтын нөхцөлд тохирох нийтлэл байхгүй байна
              </p>
              {(selectedSpecId || searchTerm) && (
                <Button
                  onClick={clearFilters}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Бүх нийтлэлийг харах
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {filteredPosts.map((post: any, index: number) => (
                <article
                  key={post._id}
                  className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2 leading-tight">
                        {post.title}
                      </h3>
                      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-200 flex-shrink-0 ml-2" />
                    </div>

                    <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                      {post.content?.text}
                    </p>

                    <div className="space-y-3 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {post.createdAt
                            ? new Date(post.createdAt).toLocaleDateString(
                                "mn-MN"
                              )
                            : "Сүүлд шинэчлэгдсэн"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <User className="h-3 w-3" />
                        <span className="font-medium">
                          {post.author?.firstName && post.author?.lastName
                            ? `${post.author.firstName} ${post.author.lastName}`
                            : post.author?.name
                            ? post.author.name
                            : post.author?.username
                            ? post.author.username
                            : "Өмгөөлөгч"}
                        </span>
                      </div>
                    </div>

                    {post.specialization && post.specialization.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-2">
                        {post.specialization.slice(0, 2).map((spec: any) => (
                          <span
                            key={spec.id || spec._id}
                            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
                          >
                            {spec.categoryName}
                          </span>
                        ))}
                        {post.specialization.length > 2 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-50 text-gray-600">
                            +{post.specialization.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="px-6 pb-6">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 rounded-xl transition-all duration-200 transform group-hover:scale-105">
                      Дэлгэрэнгүй унших
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticlesPage;
