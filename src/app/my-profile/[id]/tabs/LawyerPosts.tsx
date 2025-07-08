"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

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
      {/* Post Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Шинэ нийтлэл бичих</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="content">Юу бичих вэ?</Label>
            <Textarea
              id="content"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Юу бичих вэ?"
            />
          </div>
          <div>
            <Label htmlFor="mediaUrl">Image эсвэл YouTube линк</Label>
            <Input
              id="mediaUrl"
              value={newMediaUrl}
              onChange={(e) => setNewMediaUrl(e.target.value)}
              placeholder="https://example.com/media.jpg"
            />
          </div>
          <div>
            <Label htmlFor="mediaType">Media төрөл сонгоно уу</Label>
            <select
              id="mediaType"
              className="w-full border rounded-md p-2 text-sm"
              value={newMediaType}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewMediaType(e.target.value as "image" | "video" | "")}
            >
              <option value="">Сонгох</option>
              <option value="image">Зураг</option>
              <option value="video">Видео</option>
            </select>
          </div>
        </CardContent>
        <CardFooter className="justify-end">
          <Button onClick={handlePostSubmit} className="bg-green-600 text-white hover:bg-green-700">
            Нийтлэх
          </Button>
        </CardFooter>
      </Card>

      <Separator />

      {/* Post List */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-center">Таны нийтлэлүүд</h2>
        {posts.map((post) => (
          <Card key={post.id}>
            <CardHeader className="flex items-center justify-between text-sm text-muted-foreground">
              {post.createdAt}
            </CardHeader>
            <CardContent className="space-y-2">
              <p>{post.content}</p>

              {post.mediaUrl && post.mediaType === "image" && (
                <img src={post.mediaUrl} alt="post" className="rounded-lg w-full max-h-96 object-cover" />
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

              <div className="pt-2">
                <h4 className="text-sm font-semibold">Сэтгэгдлүүд</h4>
                {post.comments.length > 0 ? (
                  post.comments.map((comment, i) => (
                    <p key={i} className="text-sm text-gray-600 pl-2">
                      • {comment}
                    </p>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">Сэтгэгдэл алга</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
