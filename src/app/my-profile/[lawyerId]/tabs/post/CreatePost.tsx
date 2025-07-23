"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_POST } from "@/graphql/post";
import { useGetAdminSpecializationsQuery } from "@/generated";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { PostType } from "../LawyerPosts";

type CreatePostProps = {
  onCreate: (post: PostType) => void;
};

const CreatePost = ({ onCreate }: CreatePostProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [specialization, setSpecialization] = useState<string[]>([]);
  const [image, setImage] = useState<string | null>(null);
  const [video, setVideo] = useState<string | null>(null);
  const [audio, setAudio] = useState<string | null>(null);

  const { data: specData } = useGetAdminSpecializationsQuery()

  const [createPost, { loading }] = useMutation(CREATE_POST, {
    onCompleted: (data) => {
      alert("Нийтлэл амжилттай үүслээ!");

      const post: PostType = {
        id: data.createPost._id,
        title,
        content,
        specialization: specialization.join(", "),
        mediaUrl: image || video || audio || undefined,
        mediaType: image ? "image" : video ? "video" : undefined,
        createdAt: new Date().toISOString(),
        comments: [],
      };

      onCreate(post);

      setTitle("");
      setContent("");
      setSpecialization([]);
      setImage(null);
      setVideo(null);
      setAudio(null);
    },
    onError: (error) => {
      console.error("Нийтлэл үүсгэхэд алдаа гарлаа:", error.message);
    },
  });

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "image" | "video" | "audio"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (type === "image") setImage(data.url);
    if (type === "video") setVideo(data.url);
    if (type === "audio") setAudio(data.url);
  };

  const handleSubmit = () => {
    createPost({
      variables: {
        input: {
          title,
          specialization,
          content: {
            text: content,
            image: image || undefined,
            video: video || undefined,
          },
        },
      },
    });
  };

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4 border shadow rounded-xl">
      <h2 className="text-2xl font-semibold">Шинэ нийтлэл үүсгэх</h2>

      <div className="space-y-2">
        <Label>Гарчиг</Label>
        <Input
          placeholder="Жишээ: Хүүхдийн эрх зүйн тухай"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Агуулга</Label>
        <Textarea
          placeholder="Агуулгаа энд бичнэ үү..."
          rows={6}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Мэргэшил</Label>
        <select
          multiple
          className="border rounded p-2 w-full"
          value={specialization}
          onChange={(e) =>
            setSpecialization(
              Array.from(e.target.selectedOptions, (opt) => opt.value)
            )
          }
        >
          {specData?.getAdminSpecializations?.map((spec: { id: string; categoryName: string }) => (
            <option key={spec.id} value={spec.id}>
              {spec.categoryName}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1">
          <Label>Зураг</Label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileUpload(e, "image")}
          />
        </div>
        <div className="space-y-1">
          <Label>Видео</Label>
          <Input
            type="file"
            accept="video/*"
            onChange={(e) => handleFileUpload(e, "video")}
          />
        </div>
        <div className="space-y-1">
          <Label>Аудио</Label>
          <Input
            type="file"
            accept="audio/*"
            onChange={(e) => handleFileUpload(e, "audio")}
          />
        </div>
      </div>

      <Button onClick={handleSubmit} disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Нийтлэх
      </Button>
    </div>
  );
};

export default CreatePost;
