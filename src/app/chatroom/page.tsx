"use client";
import { useParams } from "next/navigation";
import useChatRoomState from "@/app/chatroom/hooks/useChatRoomState";
import ChatRoom from "@/components/chat/ChatRoom";
import ConnectionStatus from "@/components/chat/ConnectionStatus";
import CallConnectingModal from "@/components/chat/CallConnectingModal";
import LoadingSpinner from "@/components/chat/LoadingSpinner";
import CallInitializer from "@/components/chat/CallInitializer";
import { LiveKitRoom } from "@livekit/components-react";
import { VideoCallModal } from "@/components/chat/VideoCallModal";

export default function ChatPage() {
  const params = useParams();
  const chatRoomId = (params?.chatRoomId as string) || "default";
  const {
    user,
    messages,
    setMessages,
    typingUsers,
    isSending,
    isConnected,
    handleSendMessage,
    handleSendFile,
    handleTyping,
    messagesEndRef,
    otherUser,
    handleJoinCall,
    handleLeaveCall,
    activeCallType,
    isJoiningCall,
    isCallConnected,
    liveKitToken,
    setIsCallConnected,
    setIsJoiningCall,
  } = useChatRoomState(chatRoomId);

  if (!user) return <LoadingSpinner />;

  return (
    <>
      <ConnectionStatus isConnected={isConnected} isJoining={isJoiningCall} />
      <ChatRoom
        messages={messages}
        setMessages={setMessages}
        user={user}
        otherUser={otherUser}
        typingUsers={typingUsers}
        isSending={isSending}
        isConnected={isConnected}
        onSend={handleSendMessage}
        onFileChange={handleSendFile}
        onTyping={handleTyping}
        messagesEndRef={messagesEndRef}
        handleJoinCall={handleJoinCall}
        handleLeaveCall={handleLeaveCall}
        activeCallType={activeCallType}
      />
      {isJoiningCall && !isCallConnected && activeCallType && (
        <CallConnectingModal callType={activeCallType} />
      )}
      {liveKitToken && activeCallType && (
        <LiveKitRoom
          token={liveKitToken}
          serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_SERVER_URL}
          connect={true}
          video={false}
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
