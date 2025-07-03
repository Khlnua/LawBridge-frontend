"use client";

import React, { useState, useEffect } from "react";
import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ZodErrors } from "../ZodError";
import { FormData } from "../../page";
import { useUploadAvatar } from "../../hooks/useUploadAvatar";
// import Avatar from "../Avatar";

type Props = {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  goToNextStep?: () => void;
  setValue: UseFormSetValue<FormData>;
};

const FirstCardForLawyer = ({ register, errors, goToNextStep, setValue }: Props) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  const handleUploadSuccess = (url: string) => {
    setValue("avatar", url);
  };
  const { fileInputRef, previewLink, uploading, isDragging, openBrowse, deleteImage, setIsDragging, uploadToServer } =
    useUploadAvatar({ onUpload: handleUploadSuccess });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setLocalPreview(URL.createObjectURL(file));
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
      setLocalPreview(URL.createObjectURL(file));
    }
  };

  const handleNextStep = async () => {
    if (errors.firstName?.message || errors.lastName?.message || errors.email?.message) {
      return;
    }
    if (selectedFile) await uploadToServer(selectedFile);
    if (goToNextStep) goToNextStep();
  };

  useEffect(() => {
    return () => {
      if (localPreview) {
        URL.revokeObjectURL(localPreview);
      }
    };
  }, [localPreview]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium mb-1">
            Нэр
          </label>
          <Input id="firstName" {...register("firstName")} />
          <ZodErrors error={errors.firstName?.message ? [errors.firstName.message] : undefined} />
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium mb-1">
            Овог
          </label>
          <Input id="lastName" {...register("lastName")} />
          <ZodErrors error={errors.lastName?.message ? [errors.lastName.message] : undefined} />
        </div>
      </div>
      <div>
        <label htmlFor="eMail" className="block text-sm font-medium mb-1">
          Email
        </label>
        <Input id="eMail" {...register("email")} />
        <ZodErrors error={errors.email?.message ? [errors.email.message] : undefined} />
      </div>
      {/* <Avatar errors={errors} setValue={setValue} /> */}
      <div className="grid grid-cols-2">
        <div>
          <label htmlFor="profileImage" className="block text-sm font-medium mb-1">
            Нүүр зураг оруулах
          </label>
          {(localPreview || previewLink) && (
            <button
              type="button"
              onClick={() => {
                setSelectedFile(null);
                setLocalPreview(null);
                setValue("avatar", "");
                deleteImage();
              }}
              className="mt-2 text-sm text-red-500 hover:underline cursor-pointer"
            >
              Зураг арилгах
            </button>
          )}
          {uploading && <div className="text-sm text-blue-500 mt-2">Илгээж байна...</div>}
        </div>

        <Input
          id="profileImage"
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileSelect}
          style={{ display: "none" }}
        />
        <div
          className={`flex items-center justify-center bg-[#eee] w-40 h-40 rounded-full border-dashed border-2 mb-2 ml-auto mr-20 cursor-pointer 
          ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-400"}  `}
          onClick={openBrowse}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
        >
          {localPreview ? (
            <img src={localPreview} alt="" className="size-full rounded-full" />
          ) : previewLink ? (
            <img src={previewLink} alt="" className="size-full rounded-full" />
          ) : (
            <span className="text-gray-500 text-center">Click or drag an image here</span>
          )}
        </div>
        <ZodErrors error={errors.avatar?.message ? [errors.avatar.message] : undefined} />
      </div>
      <Button onClick={handleNextStep} className="w-full bg-blue-500 hover:bg-blue-400 cursor-pointer text-white">
        Дараачийн
      </Button>
    </div>
  );
};

export default FirstCardForLawyer;
