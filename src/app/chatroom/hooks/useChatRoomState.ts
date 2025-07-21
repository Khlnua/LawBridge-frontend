import { useState, useEffect, useRef, useCallback } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import { useQuery, useMutation, gql } from "@apollo/client";
import { useSocket } from "@/context/SocketContext";
import { fetchLiveKitToken } from "@/lib/livekit";
import { Message, User as ChatUser } from "@/app/chatroom/types/chat";

const GET_MESSAGES = gql`
  query getMessages($chatRoomId: ID!) {
    getMessages(chatRoomId: $chatRoomId) {
      chatRoomId
      userId
      type
      content
      id
      createdAt
    }
  }
`;

const CREATE_MESSAGE = gql`
  mutation createMessage(
    $chatRoomId: ID!
    $userId: String!
    $type: MediaType!
    $content: String
  ) {
    createMessage(
      chatRoomId: $chatRoomId
      userId: $userId
      type: $type
      content: $content
    ) {
      chatRoomId
      userId
      type
      content
      id
      createdAt
    }
  }
`;

export default function useChatRoomState(chatRoomId: string) {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const { socket, isConnected, sendMessage, joinRoom, leaveRoom, emitTyping } =
    useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [typingUsers, setTypingUsers] = useState<{ [key: string]: string }>({});
  const [isTyping, setIsTyping] = useState(false);
  const [liveKitToken, setLiveKitToken] = useState<string | null>(null);
  const [isJoiningCall, setIsJoiningCall] = useState(false);
  const [isCallConnected, setIsCallConnected] = useState(false);
  const [activeCallType, setActiveCallType] = useState<
    "video" | "audio" | null
  >(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Replace with real user fetching logic
  const otherUser: ChatUser = {
    id: "user_mock_lawyer_123",
    name: "Sarah Connor, Esq.",
    avatar: "https://i.pravatar.cc/150?u=sarah_connor",
    isLawyer: true,
  };

  // Apollo: fetch previous messages for this chatroom
  const {
    data: chatData,
    loading: chatLoading,
    refetch,
  } = useQuery(GET_MESSAGES, {
    variables: { chatRoomId },
    skip: !chatRoomId,
    fetchPolicy: "cache-and-network",
  });

  // Apollo: mutation for sending messages
  const [createMessage] = useMutation(CREATE_MESSAGE);

  // Load previous messages when data is available
  useEffect(() => {
    if (chatData?.getMessages) {
      const sorted = [...chatData.getMessages].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      setMessages(sorted);
    }
  }, [chatData]);

  // Socket Effects for real-time
  useEffect(() => {
    if (!socket || !chatRoomId) return;
    joinRoom(chatRoomId);
    const handleNewMessage = (message: any) => {
      setMessages((prev) => {
        const exists = prev.some(
          (msg) =>
            msg.id === message.id ||
            (msg.content === message.content && msg.userId === message.userId)
        );
        if (!exists) {
          const merged = [
            ...prev,
            {
              chatRoomId: message.chatRoomId,
              content: message.content,
              userId: message.userId,
              type: message.type || "TEXT",
              id: message._id || message.id,
              createdAt: message.createdAt || new Date().toISOString(),
            },
          ];
          return merged.sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        }
        return prev;
      });
    };
    const handleUserTyping = ({
      userId,
      username,
      isTyping: typing,
    }: {
      userId: string;
      username: string;
      isTyping: boolean;
    }) => {
      if (userId === user?.id) return;
      setTypingUsers((prev) => {
        const updated = { ...prev };
        if (typing) {
          updated[userId] = username;
        } else {
          delete updated[userId];
        }
        return updated;
      });
    };
    socket.on("message-created", handleNewMessage);
    socket.on("user-typing", handleUserTyping);
    return () => {
      socket.off("message-created", handleNewMessage);
      socket.off("user-typing", handleUserTyping);
      leaveRoom(chatRoomId);
    };
  }, [socket, chatRoomId, user?.id, joinRoom, leaveRoom]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handlers
  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!user || !chatRoomId || isSending || !content.trim()) return;
      setIsSending(true);
      try {
        await createMessage({
          variables: {
            chatRoomId,
            userId: user.id,
            type: "TEXT",
            content: content.trim(),
          },
        });
        await refetch();
      } catch (err) {
        console.error("Failed to send message:", err);
      } finally {
        setIsSending(false);
      }
    },
    [user, chatRoomId, createMessage, isSending, refetch]
  );

  const handleSendFile = useCallback(async (file: File) => {
    // Implement file upload logic if needed
  }, []);

  const handleTyping = useCallback(
    (typing: boolean) => {
      if (!user || !chatRoomId) return;
      if (typing) {
        emitTyping({ chatRoomId, isTyping: true });
      } else {
        emitTyping({ chatRoomId, isTyping: false });
      }
    },
    [user, chatRoomId, emitTyping]
  );

  // Call logic
  const handleJoinCall = useCallback(
    async (callType: "video" | "audio") => {
      if (!user || !chatRoomId || isJoiningCall) return;
      setIsJoiningCall(true);
      try {
        const clerkToken = await getToken();
        if (!clerkToken) throw new Error("Auth token not found.");
        const token = await fetchLiveKitToken(chatRoomId, clerkToken);
        setActiveCallType(callType);
        setLiveKitToken(token);
      } catch (error) {
        setIsJoiningCall(false);
      }
    },
    [user, chatRoomId, getToken, isJoiningCall]
  );
  const handleLeaveCall = useCallback(() => {
    setLiveKitToken(null);
    setActiveCallType(null);
    setIsCallConnected(false);
    setIsJoiningCall(false);
  }, []);

  return {
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
  };
}
