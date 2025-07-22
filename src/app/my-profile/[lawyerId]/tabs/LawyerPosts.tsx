"use client";

import { useState } from "react";
import CreatePost from "@/components/post/CreatePost";
import { PostCard } from "./post";

interface CommentType {
  _id: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface PostType {
  id: number;
  title: string;
  content: string;
  specialization: string;
  mediaUrl?: string;
  mediaType?: "image" | "video";
  createdAt: string;
  comments: CommentType[];
}

export const LawyerPosts = () => {
  const [posts, setPosts] = useState<PostType[]>([
    {
      id: 1,
      title: "Автомашин хураалгах үед юу хийх вэ?",
      content: "Цагдаагийн зогсоосон нөхцөлд та дараах эрхүүдтэй байдаг...",
      specialization: "Эрүүгийн хууль",
      mediaUrl: "https://www.totallylegal.com/getasset/c3ee2a89.jpg",
      mediaType: "image",
      createdAt: "2025-07-08",
      comments: [
        {
          _id: "c1",
          author: "Н.Бат",
          content: "Сайн байна!",
          createdAt: "2025-07-09T10:00:00Z",
        },
        {
          _id: "c2",
          author: "Д.Мөнх",
          content: "Амжилт хүсье!",
          createdAt: "2025-07-10T08:30:00Z",
        },
      ],
    },
    {
      id: 2,
      title: "Гэр бүлийн маргааныг эвлэрүүлэн зуучлах аргууд",
      content:
        "Эвлэрүүлэн зуучлалаар гэр бүлийн асуудлыг шийдвэрлэх нь шүүхээс илүү үр дүнтэй...",
      specialization: "Гэр бүлийн хууль",
      mediaUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      mediaType: "video",
      createdAt: "2025-07-07",
      comments: [],
    },
  ]);

  // const handleAddPost = (newPost: PostType) => {
  //   const postToAdd: PostType = {
  //     ...newPost,
  //     id: posts.length + 1,
  //     createdAt: new Date().toISOString().split("T")[0],
  //     comments: [],
  //   };
  //   setPosts([newPost, ...posts]);
  // };

  return (
    <div className="space-y-6 border-none">
      {/* <CreatePost onCreate={handleAddPost} /> */}
      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};
