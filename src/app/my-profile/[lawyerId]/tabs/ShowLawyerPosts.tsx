"use client";

import { PostCard } from "./post";
import { useQuery } from "@apollo/client";
import { GET_LAWYER_POSTS_BY_ID } from "@/graphql/post";

interface CommentType {
  _id: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface PostType {
  id: string;
  title: string;
  lawyerId: string;
  content: {
    text: string;
  };

  mediaUrl?: string;
  mediaType?: "image" | "video";
  createdAt: string;
  comments: CommentType[];
}

type Props = {
  lawyerId: string;
};

export const ShowLawyerPosts = ({ lawyerId }: Props) => {
  const {
    data: postsData,
    loading,
    error,
  } = useQuery(GET_LAWYER_POSTS_BY_ID, {
    variables: { lawyerId: lawyerId },
  });

  if (loading) {
    return (
      <div className="p-8 space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600 font-medium">Алдаа гарлаа: {error.message}</p>
        </div>
      </div>
    );
  }

  const posts: PostType[] = postsData?.getPostsByLawyer || [];

  if (posts.length === 0) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-gray-400 text-2xl">📝</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Нийтлэл байхгүй байна</h3>
          <p className="text-gray-500">Та анхны нийтлэлээ бичээрэй.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Миний нийтлэлүүд</h2>
          <span className="text-sm text-gray-500">{posts.length} нийтлэл</span>
        </div>

        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
};
