import React, { RefObject } from "react";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import TypingIndicator from "./TypingIndicator";
import { Message, User as ChatUser } from "@/app/chatroom/types/chat";

interface ChatRoomProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  user: any;
  otherUser: ChatUser;
  typingUsers: { [key: string]: string };
  isSending: boolean;
  isConnected: boolean;
  onSend: (content: string) => void;
  onFileChange: (file: File) => void;
  onTyping: (typing: boolean) => void;
  messagesEndRef: RefObject<HTMLDivElement | null>;
  handleJoinCall: (type: "video" | "audio") => void;
  handleLeaveCall: () => void;
  activeCallType: "video" | "audio" | null;
}

const ChatRoom: React.FC<ChatRoomProps> = ({
  messages,
  setMessages,
  user,
  otherUser,
  typingUsers,
  isSending,
  isConnected,
  onSend,
  onFileChange,
  onTyping,
  messagesEndRef,
  handleJoinCall,
  handleLeaveCall,
  activeCallType,
}) => {
  return (
    <main className="w-full h-screen bg-white md:max-w-4xl md:mx-auto md:my-6 md:h-[calc(100vh-3rem)] md:rounded-3xl md:shadow-2xl md:border md:border-slate-200 lg:max-w-5xl lg:my-8 lg:h-[calc(100vh-4rem)] xl:max-w-6xl transition-all duration-300 ease-in-out overflow-hidden">
      <div className="flex flex-col h-full">
        <div className="flex-shrink-0 border-b border-slate-200/80 bg-white/95 backdrop-blur-sm">
          <ChatHeader
            user={otherUser}
            onVideoCall={() => handleJoinCall("video")}
            onAudioCall={() => handleJoinCall("audio")}
            isCallActive={!!activeCallType}
            onEndCall={handleLeaveCall}
          />
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4 md:p-6 bg-gradient-to-b from-slate-50/50 to-slate-100/30 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent hover:scrollbar-thumb-slate-400">
          <MessageList
            messages={messages}
            setMessages={setMessages}
            currentUserId={user?.id}
          />
          <TypingIndicator typingUsers={typingUsers} />
          <div ref={messagesEndRef} />
        </div>
        <div className="flex-shrink-0 border-t border-slate-200/80 bg-white/95 backdrop-blur-sm p-3 sm:p-4 md:p-6 sticky bottom-0 z-10">
          <ChatInput
            onSend={onSend}
            onFileChange={onFileChange}
            onTyping={onTyping}
            isSending={isSending}
            disabled={!isConnected}
          />
        </div>
      </div>
    </main>
  );
};

export default ChatRoom;
