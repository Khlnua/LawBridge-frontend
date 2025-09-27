"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui";
import CreatePost from "@/app/my-profile/[lawyerId]/tabs/post/CreatePost";
import { PlusCircle } from "lucide-react";

interface CreatePostModalProps {
  onPostCreated?: () => void;
}

const CreatePostModal = ({ onPostCreated }: CreatePostModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleClose = () => {
    if (!isCreating) {
      setIsOpen(false);
    }
  };

  const handlePostCreated = () => {
    setIsCreating(false);
    setIsOpen(false);
    onPostCreated?.();
  };

  const handlePostStart = () => {
    setIsCreating(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
          <PlusCircle className="h-5 w-5" />
          Шинэ нийтлэл үүсгэх
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader className="pb-4 border-b border-gray-200">
          <DialogTitle className="text-2xl font-bold text-[#091c3c] text-center">
            {isCreating ? "Нийтлэл үүсгэж байна..." : "Шинэ нийтлэл үүсгэх"}
          </DialogTitle>
        </DialogHeader>
        <div className="pt-6 bg-white">
          <CreatePost
            onPostCreated={handlePostCreated}
            onPostStart={handlePostStart}
            isModal={true}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostModal;
