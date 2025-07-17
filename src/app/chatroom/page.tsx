"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import { useSocket } from "@/context/SocketContext";
import { LiveKitRoom, useRoomContext } from "@livekit/components-react";
import "@livekit/components-styles";

// Custom Components
import { ChatHeader } from "@/components/chat/ChatHeader";
import { MessageList } from "@/components/chat/MessageList";
import { ChatInput } from "@/components/chat/ChatInput";
import { VideoCallModal } from "@/components/chat/VideoCallModal";
import { Message, User as ChatUser } from "@/app/chatroom/types/chat";
import { fetchLiveKitToken } from "@/lib/livekit";

// Helper component to initialize media after a connection is live
const CallInitializer = ({
  callType,
  onConnected,
}: {
  callType: "video" | "audio";
  onConnected: () => void;
}) => {
  const room = useRoomContext();
  useEffect(() => {
    const enableMedia = async () => {
      if (room.state === "connected") {
        await room.localParticipant.setMicrophoneEnabled(true);
        if (callType === "video") {
          await room.localParticipant.setCameraEnabled(true);
        }
        onConnected();
      }
    };
    enableMedia();
  }, [room, callType, onConnected]);
  return null;
};

// Loading Component
const LoadingSpinner = () => (
  <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-blue-400 rounded-full animate-spin animate-reverse"></div>
      </div>
      <p className="text-slate-600 font-medium animate-pulse">
        Authenticating...
      </p>
    </div>
  </div>
);

// Connection Status Component
const ConnectionStatus = ({
  isConnected,
  isJoining,
}: {
  isConnected: boolean;
  isJoining: boolean;
}) => (
  <div className="fixed top-4 right-4 z-40 transition-all duration-300 ease-in-out">
    <div
      className={`
      px-3 py-2 rounded-full text-sm font-medium shadow-lg backdrop-blur-sm
      ${
        isJoining
          ? "bg-yellow-100/90 text-yellow-800 border border-yellow-200"
          : isConnected
          ? "bg-green-100/90 text-green-800 border border-green-200"
          : "bg-red-100/90 text-red-800 border border-red-200"
      }
    `}
    >
      <div className="flex items-center space-x-2">
        <div
          className={`
          w-2 h-2 rounded-full animate-pulse
          ${
            isJoining
              ? "bg-yellow-500"
              : isConnected
              ? "bg-green-500"
              : "bg-red-500"
          }
        `}
        ></div>
        <span>
          {isJoining
            ? "Connecting..."
            : isConnected
            ? "Connected"
            : "Disconnected"}
        </span>
      </div>
    </div>
  </div>
);

// Enhanced Loading Modal
const CallConnectingModal = ({ callType }: { callType: "video" | "audio" }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20 max-w-sm w-full">
      <div className="text-center space-y-4">
        <div className="relative mx-auto w-16 h-16">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-spin opacity-20"></div>
          <div className="absolute inset-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-spin"></div>
          <div className="absolute inset-4 rounded-full bg-white flex items-center justify-center">
            {callType === "video" ? "📹" : "🎤"}
          </div>
        </div>
        <div>
          <p className="font-semibold text-gray-800 text-lg">
            Starting {callType} call...
          </p>
          <p className="text-gray-600 text-sm mt-1">
            Please wait while we connect you
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default function ChatPage() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const { socket, isConnected } = useSocket();

  const [messages, setMessages] = useState<Message[]>([]);
  const [liveKitToken, setLiveKitToken] = useState<string | null>(null);
  const [isJoiningCall, setIsJoiningCall] = useState(false);
  const [isCallConnected, setIsCallConnected] = useState(false);
  const [activeCallType, setActiveCallType] = useState<
    "video" | "audio" | null
  >(null);
  const [isSending, setIsSending] = useState(false);

  // MOCK DATA: In a real app, this would come from page props or an API call.
  const otherUser: ChatUser = {
    id: "user_mock_lawyer_123",
    name: "Sarah Connor, Esq.",
    avatar: "https://i.pravatar.cc/150?u=sarah_connor",
    isLawyer: true,
  };
  const roomName = user
    ? `chat_${[user.id, otherUser.id].sort().join("_")}`
    : null;

  // --- Callbacks and Socket Effects ---
  const handleJoinCall = useCallback(
    async (callType: "video" | "audio") => {
      if (!user || !roomName || isJoiningCall) return;
      setIsJoiningCall(true);
      try {
        const clerkToken = await getToken();
        if (!clerkToken) throw new Error("Auth token not found.");
        const token = await fetchLiveKitToken(roomName, clerkToken);
        setActiveCallType(callType);
        setLiveKitToken(token);
      } catch (error) {
        console.error("Failed to get token:", error);
        setIsJoiningCall(false);
        // Could add error toast here
      }
    },
    [user, roomName, getToken, isJoiningCall]
  );

  const handleLeaveCall = useCallback(() => {
    setLiveKitToken(null);
    setActiveCallType(null);
    setIsCallConnected(false);
    setIsJoiningCall(false);
  }, []);

  useEffect(() => {
    if (!socket || !isConnected || !roomName) return;
    const handleNewMessage = (newMessage: Message) => {
      if (newMessage.chatRoomId === roomName) {
        setMessages((prev) => [...prev, newMessage]);
      }
    };
    socket.on("chat-message", handleNewMessage);
    return () => {
      socket.off("chat-message", handleNewMessage);
    };
  }, [socket, isConnected, roomName]);

  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!socket || !user || !roomName || isSending) return;

      setIsSending(true);
      try {
        const messagePayload = {
          chatRoomId: roomName,
          text: content,
          type: "text" as const,
          sender: {
            id: user.id,
            name: user.fullName ?? "Me",
            avatar: user.imageUrl,
            isLawyer: !!user.publicMetadata?.isLawyer,
          },
          timestamp: new Date(),
        };

        // Optimistically add message
        setMessages((prev) => [
          ...prev,
          { ...messagePayload, id: `temp_${Date.now()}` },
        ]);

        socket.emit("chat-message", {
          toUserId: otherUser.id,
          ...messagePayload,
        });
      } catch (error) {
        console.error("Failed to send message:", error);
        // Could add error handling here
      } finally {
        setIsSending(false);
      }
    },
    [socket, user, roomName, otherUser.id, isSending]
  );

  const handleSendFile = useCallback((file: File) => {
    // Show a more user-friendly notification
    alert(`File uploads are not yet implemented. File: ${file.name}`);
  }, []);

  if (!isLoaded || !user) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <ConnectionStatus isConnected={isConnected} isJoining={isJoiningCall} />

      {/* Main Chat Container with improved responsive design */}
      <main
        className="
        w-full h-screen bg-white
        md:max-w-4xl md:mx-auto md:my-6 md:h-[calc(100vh-3rem)] 
        md:rounded-3xl md:shadow-2xl md:border md:border-slate-200
        lg:max-w-5xl lg:my-8 lg:h-[calc(100vh-4rem)]
        xl:max-w-6xl
        transition-all duration-300 ease-in-out
        overflow-hidden
      "
      >
        <div className="flex flex-col h-full">
          {/* Enhanced Header with better spacing */}
          <div className="flex-shrink-0 border-b border-slate-200/80 bg-white/95 backdrop-blur-sm">
            <ChatHeader
              user={otherUser}
              onVideoCall={() => handleJoinCall("video")}
              onAudioCall={() => handleJoinCall("audio")}
              isCallActive={!!activeCallType}
              onEndCall={handleLeaveCall}
            />
          </div>

          {/* Message Area with improved scrolling - ensure it takes available space */}
          <div
            className="
            flex-1 min-h-0 overflow-y-auto 
            p-3 sm:p-4 md:p-6 
            bg-gradient-to-b from-slate-50/50 to-slate-100/30
            scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent
            hover:scrollbar-thumb-slate-400
          "
          >
            <MessageList messages={messages} />
          </div>

          {/* Enhanced Input Area - fixed at bottom */}
          <div
            className="
            flex-shrink-0 border-t border-slate-200/80 
            bg-white/95 backdrop-blur-sm
            p-3 sm:p-4 md:p-6
            sticky bottom-0 z-10
          "
          >
            <ChatInput
              onSend={handleSendMessage}
              onFileChange={handleSendFile}
              isSending={isSending}
            />
          </div>
        </div>
      </main>

      {/* Enhanced Connection Modal */}
      {isJoiningCall && !isCallConnected && activeCallType && (
        <CallConnectingModal callType={activeCallType} />
      )}

      {/* LiveKit Room */}
      {liveKitToken && activeCallType && (
        <LiveKitRoom
          token={liveKitToken}
          serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_SERVER_URL}
          connect={true}
          video={false} // Start with media off to prevent race conditions
          audio={false}
          onDisconnected={handleLeaveCall}
        >
          <CallInitializer
            callType={activeCallType}
            onConnected={() => {
              setIsCallConnected(true);
              setIsJoiningCall(false);
            }}
          />
          {isCallConnected && (
            <VideoCallModal
              user={otherUser}
              onEndCall={handleLeaveCall}
              callType={activeCallType}
            />
          )}
        </LiveKitRoom>
      )}
    </>
  );
}
