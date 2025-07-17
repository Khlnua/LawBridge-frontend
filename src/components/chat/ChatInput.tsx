"use client";

import React, { useState, useRef } from "react";
import { Paperclip, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (msg: string) => void;
  onFileChange: (file: File) => void;
  isSending: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  onFileChange,
  isSending,
}) => {
  const [msg, setMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msg.trim()) return;
    onSend(msg.trim());
    setMsg("");
  };

  const handleFileIconClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      onFileChange(e.target.files[0]);
    }
    e.target.value = ""; // Reset the input so the same file can be chosen again
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 md:gap-4 p-2 md:p-3"
    >
      <input
        type="file"
        ref={fileInputRef}
        hidden
        onChange={handleFileSelected}
      />
      <button
        type="button"
        onClick={handleFileIconClick}
        title="Attach file"
        className="p-2 text-slate-500 hover:text-blue-600 transition"
      >
        <Paperclip size={22} />
      </button>
      <input
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        className="flex-1 rounded-full border border-slate-300 bg-slate-100 px-4 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Type a message..."
        disabled={isSending}
      />
      <button
        type="submit"
        disabled={!msg.trim() || isSending}
        className={cn(
          "p-2.5 rounded-full text-white transition",
          "bg-blue-600 hover:bg-blue-700",
          "disabled:opacity-50 disabled:bg-blue-400"
        )}
      >
        <Send size={20} />
      </button>
    </form>
  );
};
