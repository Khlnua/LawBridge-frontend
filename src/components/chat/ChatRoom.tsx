import React, { RefObject, useState } from "react";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import TypingIndicator from "./TypingIndicator";
import { Message, User as ChatUser } from "@/app/chatroom/types/chat";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Phone, Video } from "lucide-react";
import { VideoCallModal } from "@/components/chat/VideoCallModal";
import { LiveKitRoom } from "@livekit/components-react";
import useChatRoomState from "@/app/chatroom/hooks/useChatRoomState";

interface ChatRoomProps {
  chatRoomId: string;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  user: { id: string };
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

const LIVEKIT_URL = "wss://lawbridge-livekit.onrender.com";

const ChatRoom: React.FC<ChatRoomProps> = ({
  chatRoomId,
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
  const [showUserInfo, setShowUserInfo] = useState(false);
  // const [isCallMinimized, setIsCallMinimized] = useState(false);
  // const [isMuted, setIsMuted] = useState(false);
  // const [isVideoOff, setIsVideoOff] = useState(false);
  const { liveKitToken } = useChatRoomState(chatRoomId);

  const handleCallAction = (type: "video" | "audio") => {
    if (activeCallType) {
      handleLeaveCall();
    } else {
      handleJoinCall(type);
    }
  };

  // const getConnectionStatusColor = () => {
  //   switch (connectionStatus) {
  //     case "connected":
  //       return "text-green-500";
  //     case "connecting":
  //       return "text-yellow-500";
  //     case "disconnected":
  //       return "text-red-500";
  //     default:
  //       return "text-gray-500";
  //   }
  // };

  // const getConnectionStatusText = () => {
  //   switch (connectionStatus) {
  //     case "connected":
  //       return "Онлайн";
  //     case "connecting":
  //       return "Холбогдож байна...";
  //     case "disconnected":
  //       return "Холбоо тасарсан";
  //     default:
  //       return "Тодорхойгүй";
  //   }
  // };

  // Remove custom renderCallInterface and use VideoCallModal instead

  return (
    <>
      <main className="w-full h-full flex flex-col bg-white dark:bg-gray-900 overflow-hidden relative">
        {/* Chat Header (previous version) */}
        <ChatHeader
          user={otherUser}
          onVideoCall={() => handleCallAction("video")}
          onAudioCall={() => handleCallAction("audio")}
          isCallActive={!!activeCallType}
          onEndCall={handleLeaveCall}
        />

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 bg-gray-50 dark:bg-gray-900 relative">
          <MessageList
            messages={messages}
            setMessages={setMessages}
            currentUserId={user.id}
          />
          <TypingIndicator typingUsers={typingUsers} />
          <div ref={messagesEndRef} />
        </div>

        {/* Enhanced Chat Input */}
        <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-4 z-10">
          <ChatInput
            onSend={onSend}
            onFileChange={onFileChange}
            onTyping={onTyping}
            isSending={isSending}
            disabled={!isConnected}
          />
        </div>

        {/* User Info Sidebar */}
        {showUserInfo && (
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 shadow-lg z-30 transform transition-transform duration-300">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Хэрэглэгчийн мэдээлэл
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowUserInfo(false)}
                >
                  ×
                </Button>
              </div>

              <div className="text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4 ring-4 ring-gray-200 dark:ring-gray-600">
                  <AvatarImage src={otherUser.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white text-2xl">
                    {otherUser.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {otherUser.name || "Хэрэглэгч"}
                </h4>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-4 space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleCallAction("audio")}
              >
                <Phone className="w-4 h-4 mr-3" />
                Дуудлага хийх
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleCallAction("video")}
              >
                <Video className="w-4 h-4 mr-3" />
                Видео дуудлага
              </Button>
            </div>
          </div>
        )}
      </main>

      {activeCallType && liveKitToken && (
        <LiveKitRoom
          token={liveKitToken}
          serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_SERVER_URL}
          connect
        >
          <VideoCallModal
            onEndCall={handleLeaveCall}
            callType={activeCallType}
            user={otherUser}
          />
        </LiveKitRoom>
      )}

      {/* Overlay for user info sidebar */}
      {showUserInfo && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-20 md:hidden"
          onClick={() => setShowUserInfo(false)}
        />
      )}
    </>
  );
};

export default ChatRoom;
