"use client";

import { useState } from "react";
import { Button } from "@/components";
import { useGetAdminSpecializationsQuery } from "@/generated";
import { useQuery } from "@apollo/client";
import { GET_ALL_POSTS } from "@/graphql/post";
import { Search, Filter, Tag, ChevronRight, X } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import CreatePostModal from "@/components/post/CreatePostModal";
import { CommentModal } from "@/components/comment";
import { useRouter } from "next/navigation";

const ArticlesPage = () => {
  const [selectedSpecIds, setSelectedSpecIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const { user, isLoaded } = useUser();
  const role = user?.publicMetadata?.role as string | undefined;
  const isLawyer = role === "lawyer";
  const router = useRouter();

  const {
    data: specData,
    loading: specLoading,
    error: specError,
  } = useGetAdminSpecializationsQuery();
  const {
    data: postData,
    loading: postLoading,
    error: postError,
    refetch,
  } = useQuery(GET_ALL_POSTS, {
    fetchPolicy: "cache-first",
  });

  // Specializations and posts data
  const specializations = specData?.getAdminSpecializations || [];
  const posts = postData?.getPosts || [];

  // Multi-select logic
  const handleFilter = (specId: string) => {
    setSelectedSpecIds((prev) =>
      prev.includes(specId)
        ? prev.filter((id) => id !== specId)
        : [...prev, specId]
    );
  };
  const clearFilters = () => {
    setSelectedSpecIds([]);
    setSearchTerm("");
  };

  // Clean URL function to fix double https issue
  const cleanUrl = (url: string) => {
    if (!url) return url;
    // Remove double https://
    return url.replace(/^https:\/\/https:\/\//, "https://");
  };

  // Filtering logic
  const filteredPosts = posts.filter((post: any) => {
    const matchesSearch =
      !searchTerm ||
      post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content?.text?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSpec =
      selectedSpecIds.length === 0 ||
      post.specialization?.some((spec: any) =>
        selectedSpecIds.includes(spec.id || spec._id)
      );

    return matchesSearch && matchesSpec;
  });

  if (!isLoaded || specLoading || postLoading) {
    return (
      <div className="min-h-screen md:mt-100 mt-20 bg-transparent ">
        <div className="text-center space-y-4 bg-transparent">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003365] mx-auto bg-transparent"></div>
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

  return (
    <div className="min-h-screen  px-30">
      <div className="bg-transparent ">
        <div className=" px-4 sm:px-6 lg:px-8 py-8 ">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-4xl font-bold text-[#003365] bg-clip-text">
              Хуулийн нийтлэлүүд
            </h1>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              Хуулийн мэргэжилтнүүдийн туршлага, зөвлөгөө болон сүүлийн үеийн
              хуулийн мэдээллүүд
            </p>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="bg-white rounded-lg  p-5 px-15 max-w-none">
          <div className="flex flex-col md:flex-row md:items-center md:gap-6 gap-4 ">
            {/* Search */}
            <div className="relative flex-1 border border-gray-200 rounded-lg">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Нийтлэл хайх..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-2 border-0 rounded-lg focus:ring-0 focus:ring-[#003365] focus:border-[#003365] text-gray-700 placeholder-gray-400 text-sm bg-transparent"
              />
            </div>

            {/* Filter Bar */}
            <div className="flex flex-row items-center gap-3 flex-shrink-0">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 border border-gray-300 bg-white"
              >
                <Filter className="h-4 w-4" />
                Ангилал ({specializations.length})
                <ChevronRight
                  className={`h-4 w-4 transition-transform ${
                    showFilters ? "rotate-90" : ""
                  }`}
                />
              </Button>

              {(selectedSpecIds.length > 0 || searchTerm) && (
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                >
                  <X className="h-4 w-4 mr-2" />
                  Цэвэрлэх
                </Button>
              )}
            </div>
          </div>

          {/* Filter Buttons */}
          {showFilters && (
            <div className="space-y-40 pt-6">
              <div className="flex flex-wrap gap-3 justify-center">
                {specializations.map(
                  (spec: { id: string; categoryName: string }) => (
                    <Button
                      key={spec.id}
                      variant={
                        selectedSpecIds.includes(spec.id)
                          ? "default"
                          : "outline"
                      }
                      onClick={() => handleFilter(spec.id)}
                      className={`
                      px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-105
                        ${
                          selectedSpecIds.includes(spec.id)
                            ? "bg-[#003365] text-white shadow-lg border-[#003365]"
                            : "bg-white text-gray-700 border-gray-200 hover:border-[#003365] hover:text-[#003365] hover:bg-gray-50"
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
          {(selectedSpecIds.length > 0 || searchTerm) && (
            <div className="flex flex-wrap gap-3 border-t border-gray-100 pt-4 justify-center">
              <span className="text-sm text-gray-500 font-medium">
                Идэвхтэй шүүлтүүр:
              </span>
              {selectedSpecIds.map((specId) => {
                const spec = specializations.find((s) => s.id === specId);
                return (
                  <div
                    key={specId}
                    className="flex items-center gap-2 bg-gray-100 text-[#003365] px-3 py-1 rounded-full text-sm"
                  >
                    <Tag className="h-3 w-3" />
                    {spec?.categoryName}
                    <button
                      onClick={() => handleFilter(specId)}
                      className="hover:text-[#002a52]"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                );
              })}
              {searchTerm && (
                <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  <Search className="h-3 w-3" />
                  &quot;{searchTerm}&quot;
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

        {isLawyer && (
          <div className="pt-4 flex justify-center">
            <CreatePostModal />
          </div>
        )}

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-800">
            {selectedSpecIds.length > 0
              ? `Сонгогдсон ангиллууд`
              : searchTerm
              ? `"${searchTerm}" хайлтын үр дүн`
              : "Бүх нийтлэлүүд"}
          </h2>
        </div>

        {/* Facebook-style Newsfeed */}
        <div className="max-w-4xl mx-auto space-y-6">
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
              {(selectedSpecIds.length > 0 || searchTerm) && (
                <Button
                  onClick={clearFilters}
                  className="bg-[#003365] hover:bg-[#002a52]"
                >
                  Бүх нийтлэлийг харах
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredPosts.map((post: any) => (
                <article
                  key={post._id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  {/* Post Header - Author Info */}
                  <div className="p-4 border-b border-gray-100">
                    <div
                      className="flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-[#003365] focus:ring-opacity-50 rounded-lg p-1 -m-1"
                      onClick={() => router.push(`/lawyer/${post.author?._id}`)}
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#003365] focus:ring-opacity-50">
                        {post.author?.profilePicture ? (
                          <img
                            src={post.author.profilePicture}
                            alt={`${post.author?.firstName || ""} ${
                              post.author?.lastName || ""
                            }`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback to initials if image fails to load
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = `<div class="w-full h-full bg-gradient-to-br from-[#003365] to-[#002a52] rounded-full flex items-center justify-center text-white font-semibold text-sm">${
                                  (post.author?.firstName?.charAt(0) || "") +
                                    (post.author?.lastName?.charAt(0) || "") ||
                                  "Ө"
                                }</div>`;
                              }
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#003365] to-[#002a52] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {(post.author?.firstName?.charAt(0) || "") +
                              (post.author?.lastName?.charAt(0) || "") || "Ө"}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-semibold text-gray-900 truncate">
                            {post.author?.firstName && post.author?.lastName
                              ? `${post.author.firstName} ${post.author.lastName}`
                              : post.author?.name
                              ? post.author.name
                              : post.author?.username
                              ? post.author.username
                              : "Өмгөөлөгч"}
                          </h4>
                        </div>
                        <p className="text-xs text-gray-500">
                          {post.createdAt
                            ? new Date(post.createdAt).toLocaleDateString(
                                "mn-MN",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )
                            : "Сүүлд шинэчлэгдсэн"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="p-4 space-y-4">
                    {/* Post Title */}
                    <h3 className="text-xl font-bold text-gray-900 leading-tight">
                      {post.title}
                    </h3>

                    {/* Post Text Content */}
                    {post.content?.text && (
                      <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {post.content.text}
                      </div>
                    )}

                    {/* Display Image */}
                    {post.content?.image && (
                      <div className="mt-4">
                        <img
                          src={cleanUrl(post.content.image)}
                          alt="Post image"
                          className="w-full max-h-96 object-cover rounded-lg"
                          onError={(e) => {
                            console.error(
                              "Image failed to load:",
                              cleanUrl(post.content.image)
                            );
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      </div>
                    )}

                    {/* Display Video */}
                    {post.content?.video &&
                      post.content.video !==
                        "https://example.com/video.mp4" && (
                        <div className="mt-4">
                          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                            <video
                              controls
                              src={cleanUrl(post.content.video)}
                              className="w-full h-full object-cover"
                              preload="metadata"
                              onError={(e) => {
                                console.error(
                                  "Video failed to load:",
                                  cleanUrl(post.content.video)
                                );
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          </div>
                        </div>
                      )}

                    {/* Display Audio */}
                    {post.content?.audio && (
                      <div className="mt-4">
                        <div className="bg-gray-100 rounded-lg p-4">
                          <audio
                            controls
                            src={cleanUrl(post.content.audio)}
                            className="w-full"
                            onError={(e) => {
                              console.error(
                                "Audio failed to load:",
                                cleanUrl(post.content.audio)
                              );
                              e.currentTarget.style.display = "none";
                            }}
                          >
                            Your browser does not support the audio element.
                          </audio>
                        </div>
                      </div>
                    )}

                    {/* Specializations */}
                    {post.specialization && post.specialization.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {post.specialization.map((spec: any) => (
                          <span
                            key={spec.id || spec._id}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-[#003365] border border-gray-200"
                          >
                            <Tag className="h-3 w-3 mr-1" />
                            {spec.categoryName}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Post Footer - Engagement */}
                  <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
                    <div className="flex justify-end items-end space-x-6">
                      <CommentModal
                        postId={post._id}
                        comments={post.comments || []}
                        onCommentAdded={() => {
                          // Refetch posts to show new comment
                          refetch();
                        }}
                        onCommentDeleted={() => {
                          // Refetch posts to update comments
                          refetch();
                        }}
                      />
                    </div>
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
