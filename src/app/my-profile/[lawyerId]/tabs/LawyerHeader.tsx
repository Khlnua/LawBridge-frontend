"use client";

import { useState } from "react";
import { Pencil, Save, X } from "lucide-react";
import { useUploadAvatar } from "@/app/(create-lawyer-profile)/lawyer-form/hooks";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

export const LawyerProfileHeader = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    avatar: "/lawyer-avatar.jpg",
    firstName: "Номин",
    lastName: "Батболд",
    email: "nomin@example.com",
    phone: "99112233",
    specialization: "Эрүүгийн эрх зүй, Гэр бүлийн эрх зүй",
    bio: "10 жилийн туршлагатай, хууль зүйн салбарт үр дүнтэй зөвлөгөө өгдөг өмгөөлөгч.",
  });

  const {
    fileInputRef,
    uploading,
    openBrowse,
    uploadToServer,
  } = useUploadAvatar({
    onUpload: (url) => {
      setForm((prev) => ({ ...prev, avatar: url }));
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setLocalPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (selectedFile) {
      await uploadToServer(selectedFile);
    }
    setIsEditing(false);
    setLocalPreview(null);
    console.log("Хадгалсан мэдээлэл:", form);
    // 🎯 Backend руу PATCH хийх
  };

  return (
    <Card className="w-full p-6 space-y-4 border-none bg-[#d6ebf7] ">
      <CardHeader className="flex flex-col items-center text-center gap-4">
        <div className="relative group">
          <Avatar className="w-28 h-28 border">
            <AvatarImage
              src={localPreview || form.avatar}
              alt="Avatar"
              className="object-cover border-none"
            />
            <AvatarFallback>NB</AvatarFallback>
          </Avatar>

          {isEditing && (
            <>
              <button
                type="button"
                onClick={openBrowse}
                className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow group-hover:opacity-100 opacity-0 transition"
                disabled={uploading}
              >
                <Pencil size={16} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                hidden
              />
            </>
          )}
        </div>

        <CardTitle className="text-xl font-semibold">
          {form.lastName} {form.firstName}
        </CardTitle>
        {!isEditing && (
          <>
            <p className="text-green-700">{form.specialization}</p>
            <div className="text-sm text-gray-500">
              <div>📞 {form.phone}</div>
              <div>✉️ {form.email}</div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">{form.bio}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="mt-2"
            >
              <Pencil size={14} className="mr-1" />
              Засварлах
            </Button>
          </>
        )}
      </CardHeader>

      {isEditing && (
        <>
          <Separator />
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Нэр</Label>
              <Input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                className="border-gray-200"
              />
            </div>
            <div>
              <Label>Овог</Label>
              <Input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                className="border-gray-200"
              />
            </div>
            <div>
              <Label>Имэйл</Label>
              <Input
                name="email"
                value={form.email}
                onChange={handleChange}
                className="border-gray-200"
              />
            </div>
            <div>
              <Label>Утас</Label>
              <Input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="border-gray-200"
              />
            </div>
            <div className="md:col-span-2">
              <Label>Мэргэжлийн чиглэл</Label>
              <Input
                name="specialization"
                value={form.specialization}
                onChange={handleChange}
                className="border-gray-200"
              />
            </div>
            <div className="md:col-span-2">
              <Label>Танилцуулга</Label>
              <Textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                className="border-gray-200"
              />
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-2">
            <Button
              onClick={handleSave}
              disabled={uploading}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Save size={16} className="mr-1" />
              Хадгалах
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditing(false);
                setLocalPreview(null);
              }}
            >
              <X size={16} className="mr-1" />
              Болих
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  );
};
