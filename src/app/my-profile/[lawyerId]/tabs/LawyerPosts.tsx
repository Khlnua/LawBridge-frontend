"use client";

import { useState } from "react";
import CreatePost from "@/components/post/CreatePost";
import { GetPost } from "@/components";

interface PostType {
  id: number;
  content: string;
  mediaUrl?: string;
  mediaType?: "image" | "video";
  comments: string[];
  createdAt: string;
}

export default function LawyerPosts() {
  const [posts, setPosts] = useState<PostType[]>([
    {
      id: 1,
      content: "Хэрэг шийдвэрлээд баяртай байна!",
      mediaUrl: "https://www.totallylegal.com/getasset/c3ee2a89-b973-445f-9337-1ca05736c950/",
      mediaType: "image",
      comments: ["Сайн байна!", "Амжилт хүсье!"],
      createdAt: "2025-07-08",
    },
    {
      id: 2,
      content: "Шинэ хууль дээр тайлбар хийлээ.",
      mediaUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      mediaType: "video",
      comments: [],
      createdAt: "2025-07-06",
    },
    {
      id: 3,
      content: "Энгийн текст пост ингэж харагдана",
      comments: [],
      createdAt: "2025-07-05",
    },
  ]);

  const handleAddPost = (post: PostType) => {
    setPosts([post, ...posts]);
  };

  return (
    <div className="space-y-6">
      <CreatePost onCreate={handleAddPost} />
     <GetPost/>
    </div>
  );
}
