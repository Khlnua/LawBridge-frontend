"use client";

import { useState } from "react";

interface Post {
  id: number;
  content: string;
  mediaUrl?: string;
  mediaType?: "image" | "video";
  comments: string[];
  createdAt: string;
}

export const LawyerPosts = () => {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      content: "Өнөөдөр нэгэн амжилттай гэр бүлийн хэрэг шийдвэрлэлээ.",
      mediaUrl: "/success.jpg",
      mediaType: "image",
      comments: ["Сайхан мэдээ байна!", "Баяр хүргэе!"],
      createdAt: "2025-07-01",
    },
    {
      id: 2,
      content: "Эрүүгийн хэрэгтэй холбоотой нийтлэл:",
      mediaUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      mediaType: "video",
      comments: [],
      createdAt: "2025-06-28",
    },
  ]);

  const [newContent, setNewContent] = useState("");
  const [newMediaUrl, setNewMediaUrl] = useState("");
  const [newMediaType, setNewMediaType] = useState<"image" | "video" | "">("");

  const handlePostSubmit = () => {
    if (!newContent.trim()) return;

    const newPost: Post = {
      id: posts.length + 1,
      content: newContent,
      mediaUrl: newMediaUrl || undefined,
      mediaType: newMediaType || undefined,
      comments: [],
      createdAt: new Date().toISOString().slice(0, 10),
    };

    setPosts([newPost, ...posts]);
    setNewContent("");
    setNewMediaUrl("");
    setNewMediaType("");
  };

  return (
    <div className="space-y-6">
      {/* New Post Form */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-center">Шинэ нийтлэл бичих</h2>
        <textarea
          className="w-full border rounded-md p-3 text-sm"
          placeholder="Юу бичих вэ?"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
        />
        <input
          type="text"
          className="w-full border rounded-md p-2 text-sm"
          placeholder="Image эсвэл YouTube линк (заавал биш)"
          value={newMediaUrl}
          onChange={(e) => setNewMediaUrl(e.target.value)}
        />
        <select
          className="w-full border rounded-md p-2 text-sm"
          value={newMediaType}
          onChange={(e) =>
            setNewMediaType(e.target.value as "image" | "video" | "")
          }
        >
          <option value="">Media төрөл сонгоно уу</option>
          <option value="image">Зураг</option>
          <option value="video">Видео (YouTube embed)</option>
        </select>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
          onClick={handlePostSubmit}
        >
          Нийтлэх
        </button>
      </div>

      <hr />

      {/* Existing Posts */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-center">Таны нийтлэлүүд</h2>
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-gray-50 border rounded-lg p-4 space-y-2"
          >
            <div className="text-sm text-gray-500 text-right">
              {post.createdAt}
            </div>
            <p>{post.content}</p>

            {post.mediaUrl && post.mediaType === "image" && (
              <img
                src={post.mediaUrl}
                alt="post-media"
                className="rounded-lg max-h-96 object-cover mx-auto"
              />
            )}
            {post.mediaUrl && post.mediaType === "video" && (
              <div className="aspect-video w-full">
                <iframe
                  className="w-full h-full rounded-lg"
                  src={post.mediaUrl}
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              </div>
            )}

            {/* Comments */}
            <div className="pt-2 space-y-1">
              <h4 className="text-sm font-medium">Сэтгэгдлүүд</h4>
              {post.comments.length > 0 ? (
                post.comments.map((comment, idx) => (
                  <div key={idx} className="text-sm text-gray-600 pl-2">
                    - {comment}
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-400">Сэтгэгдэл алга</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
