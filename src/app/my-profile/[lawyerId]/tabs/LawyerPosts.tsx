"use client";

import { useState } from "react";
import CreatePost from "@/components/post/CreatePost";
import { PostCard } from "./post";

import { gql, useQuery } from "@apollo/client";

const GET_ADMIN_SPECIALIZATIONS = gql`
  query GetAdminSpecializations {
    getAdminSpecializations {
      id
      categoryName
    }
  }
`;

interface CommentType {
  _id: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface PostType {
  id: string;
  title: string;
  content: string;
  specialization: string;
  mediaUrl?: string;
  mediaType?: "image" | "video";
  createdAt: string;
  comments: CommentType[];
}

export default function AdminSpecializations() {
  const { data, loading, error } = useQuery(GET_ADMIN_SPECIALIZATIONS);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  console.log("🎯 Admin Specializations:", data.getAdminSpecializations);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Admin Specializations</h2>
      <ul className="list-disc list-inside">
        {data.getAdminSpecializations.map((spec: any) => (
          <li key={spec.id}>
            {spec.categoryName} (ID: {spec.id})
          </li>
        ))}
      </ul>
      {/* <NotificationBell/> */}
    </div>
  );
}

export const LawyerPosts = () => {
  const handleAddPost = (newPost: PostType) => {
    const postToAdd: PostType = {
      ...newPost,
      id: posts.length + 1,
      createdAt: new Date().toISOString().split("T")[0],
      comments: [],
    };
    setPosts([newPost, ...posts]);
  };

  return (
    <div></div>
    // <div className="space-y-6 border-none">
    //   <CreatePost onCreate={handleAddPost} />
    //   <div className="space-y-4">
    //     {posts.map((post) => (
    //       <PostCard key={post.id} post={post} />
    //     ))}
    //   </div>
    // </div>
  );
};
