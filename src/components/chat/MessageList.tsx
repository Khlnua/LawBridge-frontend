"use client";

import React, { useRef, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { MessageBubble } from "./MessageBubble";
import { Message } from "@/app/chatroom/types/chat";

interface MessageListProps {
  messages: Message[];
}

export const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const { user, isLoaded } = useUser();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  if (!isLoaded) {
    return (
      <div className="p-4 text-center text-sm text-slate-500">
        Loading messages...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages
        .filter((msg) => msg && msg.sender)
        .map((msg) => {
          const isOwnMessage = msg.sender.id === user?.id;
          return (
            <MessageBubble
              key={msg.id}
              message={msg}
              isOwnMessage={isOwnMessage}
            />
          );
        })}
      <div ref={scrollRef} />
    </div>
  );
};
