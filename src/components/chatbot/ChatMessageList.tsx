import React, { useRef, useEffect } from "react";
import ChatMessageBubble from "./ChatMessageBubble";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  isError?: boolean;
}

interface ChatMessageListProps {
  messages: Message[];
  userId: string;
  userAvatarUrl?: string;
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  userId,
  userAvatarUrl,
}) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  if (!messages.length) return null;
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {messages.map((msg, index) => (
        <ChatMessageBubble
          key={`${msg.sender}-${msg.timestamp.getTime()}-${index}`}
          message={msg}
          isOwnMessage={msg.sender === "user" && userId !== undefined}
          userAvatarUrl={msg.sender === "user" ? userAvatarUrl : undefined}
        />
      ))}
      <div ref={endRef} />
    </div>
  );
};

export default ChatMessageList;
