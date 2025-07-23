"use client";

import React, { useEffect, useState } from "react";
import { LiveKitRoom } from "@livekit/components-react";
import { VideoCallModal } from "./VideoCallModal";
import { ChatHeader } from "./ChatHeader";
// import { Chat } from "./Chat";

import "@livekit/components-styles";

interface ChatInterfaceProps {
  currentUserId: string;
  roomName: string;
  otherUser: {
    id: string;
    name: string;
    avatar: string;
    isLawyer: boolean;
  };
}

const ChatInterface = ({
  currentUserId,
  roomName,
  otherUser,
}: ChatInterfaceProps) => {
  const [token, setToken] = useState<string | null>(null);
  const [activeCall, setActiveCall] = useState<"video" | "audio" | null>(null);
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);

  // 🔗 Backend-ээс токен fetch хийх
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const res = await fetch(
          `/api/livekit-token?userId=${currentUserId}&room=${roomName}`
        );

        const data = await res.json();

        if (!res.ok || !data.token) {
          throw new Error(data.error || "Failed to fetch token");
        }

        setToken(data.token);
      } catch (err) {
        console.error("❌ Failed to fetch LiveKit token:", err);
      }
    };

    fetchToken();
  }, [currentUserId, roomName]);

  const handleVideoCall = () => {
    setActiveCall("video");
    setIsVideoCallOpen(true);
  };

  const handleAudioCall = () => {
    setActiveCall("audio");
    setIsVideoCallOpen(true);
  };

  const handleEndCall = () => {
    setActiveCall(null);
    setIsVideoCallOpen(false);
  };

  if (!token) return <div>🔄 Connecting to room...</div>;

  return (
    <LiveKitRoom
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      connect
      data-lk-theme="default"
      style={{ height: "100vh" }}
    >
      <div className="flex flex-col h-full bg-slate-50">
        <ChatHeader
          user={otherUser}
          onVideoCall={handleVideoCall}
          onAudioCall={handleAudioCall}
          isCallActive={activeCall !== null}
          onEndCall={handleEndCall}
        />

        <div className="flex-1 flex overflow-hidden flex-col md:flex-row transition-all duration-300">
          {isVideoCallOpen && activeCall && (
            <VideoCallModal
              user={otherUser}
              callType={activeCall}
              onEndCall={handleEndCall}
            />
          )}

          <div
            className={`transition-all ${
              isVideoCallOpen ? "w-full md:w-1/3 h-1/2 md:h-auto" : "w-full"
            }`}
          >
            {/* <Chat
              currentUserId={currentUserId}
              targetUserId={otherUser.id}
              chatRoomId={roomName}
            /> */}
          </div>
        </div>
      </div>
    </LiveKitRoom>
  );
};

export default ChatInterface;
