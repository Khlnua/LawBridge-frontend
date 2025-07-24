"use client";
import { useState, useRef } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_POST } from "@/graphql/post";
import { useGetAdminSpecializationsQuery } from "@/generated";
import { Button, Input, Textarea, Label } from "@/components/ui";
import { Loader2, } from "lucide-react";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [specialization, setSpecialization] = useState<string[]>([]);
  const [image, setImage] = useState<string | null>(null);
  const [video, setVideo] = useState<string | null>(null);
  const [audio, setAudio] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const { data: specData } = useGetAdminSpecializationsQuery();

  const [createPost, { loading }] = useMutation(CREATE_POST, {
    onCompleted: () => {
      setSuccess("Нийтлэл амжилттай үүслээ!");
      setTitle("");
      setContent("");
      setSpecialization([]);
      setImage(null);
      setVideo(null);
      setAudio(null);
      setTimeout(() => setSuccess(null), 1500);
      if (imageInputRef.current) imageInputRef.current.value = "";
      if (videoInputRef.current) videoInputRef.current.value = "";
      if (audioInputRef.current) audioInputRef.current.value = "";
    },
    onError: (error) => {
      setError(error.message || "Нийтлэл үүсгэхэд алдаа гарлаа.");
      setTimeout(() => setError(null), 3000);
    },
  });

  const uploadToCloudflare = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    setUploading(true);
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setUploading(false);
      if (data?.url) return data.url;
      setError("Файл илгээхэд алдаа гарлаа.");
      return null;
    } catch {
      setError("Файл илгээхэд алдаа гарлаа.");
      setUploading(false);
      return null;
    }
  };

  // const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "video" | "audio") => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;
  //   if (file.size > 15 * 1024 * 1024) {
  //     setError("Файл хэтэрхий том байна. 15MB-аас бага файл сонгоно уу.");
  //     if (type === "image" && imageInputRef.current) imageInputRef.current.value = "";
  //     if (type === "video" && videoInputRef.current) videoInputRef.current.value = "";
  //     if (type === "audio" && audioInputRef.current) audioInputRef.current.value = "";
  //     return;
  //   }
  //   setError(null);
  //   setSuccess(null);
  //   const url = await uploadToCloudflare(file);
  //   if (!url) return;
  //   if (type === "image") setImage(url);
  //   if (type === "video") setVideo(url);
  //   if (type === "audio") setAudio(url);
  // };

  // const removeFile = (type: "image" | "video" | "audio") => {
  //   if (type === "image") {
  //     setImage(null);
  //     if (imageInputRef.current) imageInputRef.current.value = "";
  //   }
  //   if (type === "video") {
  //     setVideo(null);
  //     if (videoInputRef.current) videoInputRef.current.value = "";
  //   }
  //   if (type === "audio") {
  //     setAudio(null);
  //     if (audioInputRef.current) audioInputRef.current.value = "";
  //   }
  // };

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) {
      setError("Гарчиг болон агуулгыг бөглөнө үү.");
      setTimeout(() => setError(null), 1500);
      return;
    }
    createPost({
      variables: {
        input: {
          title,
          specialization,
          content: {
            text: content,
            image: image || undefined,
            video: video || undefined,
            audio: audio || undefined,
          },
        },
      },
    });
  };

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4 border shadow rounded-xl bg-white">
      <h2 className="text-2xl font-semibold">Шинэ нийтлэл үүсгэх</h2>

      {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded">{error}</div>}
      {success && <div className="bg-green-100 text-green-700 px-4 py-2 rounded">{success}</div>}

      <div className="space-y-2">
        <Label>Гарчиг</Label>
        <Input placeholder="Жишээ: Хүүхдийн эрх зүйн тухай" value={title} maxLength={80} onChange={(e) => setTitle(e.target.value)} />
        <div className="text-right text-xs text-gray-400">{title.length}/80</div>
      </div>

      <div className="space-y-2">
        <Label>Агуулга</Label>
        <Textarea
          placeholder="Агуулгаа энд бичнэ үү..."
          rows={6}
          value={content}
          maxLength={3000}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="text-right text-xs text-gray-400">{content.length}/3000</div>
      </div>

      <div>
        <Label className="mb-2">Салбар</Label>
        <div className="flex flex-wrap gap-2">
          {specData?.getAdminSpecializations?.map((spec: { id: string; categoryName: string }) => (
            <Button
              type="button"
              key={spec.id}
              className={`rounded-full border text-[12px] ${
                specialization.includes(spec.id) ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"
              }`}
              onClick={() =>
                setSpecialization((prev) => (prev.includes(spec.id) ? prev.filter((id) => id !== spec.id) : [...prev, spec.id]))
              }
            >
              {spec.categoryName}
            </Button>
          ))}
        </div>
      </div>

      {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="hover:bg-green-50 p-2 rounded flex flex-col items-center justify-center relative min-h-[140px]">
          <Label onClick={() => imageInputRef.current?.click()} className="cursor-pointer flex gap-2 items-center">
            <ImagePlus /> Зураг
          </Label>
          <Input type="file" accept="image/*" hidden ref={imageInputRef} onChange={(e) => handleFileUpload(e, "image")} />
          {image && (
            <div className="relative mt-2">
              <img src={image} alt="preview" className="max-h-24 rounded" />
              <button
                type="button"
                className="absolute -top-2 -right-2 bg-white border border-gray-300 rounded-full p-1 hover:bg-red-100"
                onClick={() => removeFile("image")}
              >
                <XCircle size={16} className="text-red-500" />
              </button>
            </div>
          )}
        </div>

        <div className="hover:bg-orange-50 p-2 rounded flex flex-col items-center justify-center relative min-h-[140px]">
          <Label onClick={() => videoInputRef.current?.click()} className="cursor-pointer flex gap-2 items-center">
            <FileVideo /> Видео
          </Label>
          <Input type="file" accept="video/*" hidden ref={videoInputRef} onChange={(e) => handleFileUpload(e, "video")} />
          {video && (
            <div className="relative mt-2">
              <video src={video} controls className="max-h-24 rounded" />
              <Button
                type="button"
                className="absolute -top-2 -right-2 bg-white border border-gray-300 rounded-full p-1 hover:bg-red-100"
                onClick={() => removeFile("video")}
              >
                <XCircle size={16} className="text-red-500" />
              </Button>
            </div>
          )}
        </div>

        <div className="hover:bg-blue-50 p-2 rounded flex flex-col items-center justify-center relative min-h-[140px]">
          <Label onClick={() => audioInputRef.current?.click()} className="cursor-pointer flex gap-2 items-center">
            <AudioLinesIcon /> Аудио
          </Label>
          <Input type="file" accept="audio/*" hidden ref={audioInputRef} onChange={(e) => handleFileUpload(e, "audio")} />
          {audio && (
            <div className="relative mt-2">
              <audio src={audio} controls className="w-full" />
              <Button
                type="button"
                className="absolute -top-2 -right-2 bg-white border border-gray-300 rounded-full p-1 hover:bg-red-100"
                onClick={() => removeFile("audio")}
              >
                <XCircle size={16} className="text-red-500" />
              </Button>
            </div>
          )}
        </div>
      </div> */}

      <Button
        onClick={handleSubmit}
        disabled={loading || uploading || !title.trim() || !content.trim()}
        className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
      >
        {(loading || uploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Нийтлэх
      </Button>
    </div>
  );
};

export default CreatePost;
