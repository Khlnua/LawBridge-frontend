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
        <Button className="bg-[#003365] hover:bg-[#002a52] text-white font-semibold py-3 px-6 rounded-lg flex items-center gap-2 shadow-sm hover:shadow-md transition-all duration-200">
          <PlusCircle className="h-5 w-5" />
          Шинэ нийтлэл үүсгэх
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto bg-white rounded-2xl border border-gray-200">
        <DialogHeader className="pb-6 border-b border-gray-100">
          <DialogTitle className="text-2xl font-bold text-gray-900 text-center">
            {isCreating ? "Нийтлэл үүсгэж байна..." : "Шинэ нийтлэл үүсгэх"}
          </DialogTitle>
        </DialogHeader>
        <div className="pt-8 bg-white">
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
