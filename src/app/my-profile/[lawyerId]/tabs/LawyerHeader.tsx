"use client";

import { useState, useEffect } from "react";
import { MailIcon, Pencil, Save, University, X } from "lucide-react";
import { useUploadAvatar } from "@/app/(create-lawyer-profile)/lawyer-form/hooks";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
  GET_LAWYER_BY_ID_QUERY,
  UPDATE_LAWYER_MUTATION,
} from "@/graphql/lawyer";
import { useQuery, useMutation } from "@apollo/client";

type LawyerProfileHeaderProps = {
  lawyerId: string;
};

export const LawyerProfileHeader = ({ lawyerId }: LawyerProfileHeaderProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  const { data, loading } = useQuery(GET_LAWYER_BY_ID_QUERY, {
    variables: { lawyerId: "688034a4021434498c5dca18" },
  });

  const lawyer = data?.getLawyerById;

  console.log("Lawyer data:", lawyer);

  const [form, setForm] = useState({
    avatar: "",
    firstName: "",
    lastName: "",
    email: "",
    university: "",
    specialization: "",
    bio: "",
  });

  useEffect(() => {
    if (lawyer) {
      setForm({
        avatar: lawyer.profilePicture,
        firstName: lawyer.firstName || "",
        lastName: lawyer.lastName || "",
        email: lawyer.email || "",
        university: lawyer.university || "",
        specialization: lawyer.specialization || [],
        bio: lawyer.bio || "",
      });
    }
  }, [lawyer]);

  const [updateLawyer, { loading: updating }] = useMutation(
    UPDATE_LAWYER_MUTATION
  );

  const { fileInputRef, uploading, openBrowse, uploadToServer } =
    useUploadAvatar({
      onUpload: () => {},
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
    try {
      let uploadedUrl = form.avatar;

      if (selectedFile) {
        const result = await uploadToServer(selectedFile);
        if (typeof result === "string") {
          uploadedUrl = result;
        } else {
          throw new Error("Зургийн хаяг алга байна.");
        }
      }

      const variables = {
        updateLawyerLawyerId2: lawyer._id,
        input: {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          bio: form.bio,
          profilePicture: uploadedUrl,
        },
      };

      const { data } = await updateLawyer({ variables });

      console.log("Амжилттай шинэчлэгдлээ:", data);
      setIsEditing(false);
      setLocalPreview(null);
    } catch (error) {
      console.error("Шинэчлэх үед алдаа гарлаа:", error);
    }
  };

  if (loading) return <p className="text-center py-8">Ачааллаж байна...</p>;

  return (
    <Card className="w-full p-6 space-y-4 border-none bg-[#d6ebf7]">
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
              <div className="flex gap-1 justify-start items-center">
                <University /> {form.university}
              </div>
              <div className="flex gap-1 justify-start items-center">
                <MailIcon /> {form.email}
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">{form.bio}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="mt-2 border-none bg-[#83bce5] text-[#0b1536]"
            >
              <Pencil size={14} className="mr-1" />
              Шинэчлэх
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
              />
            </div>
            <div>
              <Label>Овог</Label>
              <Input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Имэйл</Label>
              <Input name="email" value={form.email} onChange={handleChange} />
            </div>
            <div>
              <Label>Утас</Label>
              <Input
                name="phone"
                value={form.university}
                onChange={handleChange}
              />
            </div>
            <div className="md:col-span-2">
              <Label>Мэргэжлийн чиглэл</Label>
              <Input
                name="specialization"
                value={form.specialization}
                onChange={handleChange}
              />
            </div>
            <div className="md:col-span-2">
              <Label>Танилцуулга</Label>
              <Textarea name="bio" value={form.bio} onChange={handleChange} />
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-2">
            <Button
              onClick={handleSave}
              disabled={uploading || updating}
              className="bg-[#0b1536] hover:bg-[#0b1536b6] text-white rounded-4xl"
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
              className="text-[#0b1536] border-[#0b1536] rounded-4xl"
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
