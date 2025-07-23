import { useState, useEffect, useRef, useCallback } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import { useQuery, useMutation, gql } from "@apollo/client";
import { useSocket } from "@/context/SocketContext";
import { fetchLiveKitToken } from "@/lib/livekit";
import {
  Message as MessageType,
  User as ChatUser,
} from "@/app/chatroom/types/chat";

const GET_MESSAGES = gql`
  query getMessages($chatRoomId: ID!) {
    getMessages(chatRoomId: $chatRoomId) {
      chatRoomId
      userId
      type
      content
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
    }
  }
`;

export interface UseChatRoomState {
  user: ChatUser | null;
  messages: MessageType[];
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
  typingUsers: Record<string, string>;
  isSending: boolean;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  handleSendMessage: (content: string) => Promise<void>;
  handleSendFile: (file: File) => Promise<void>;
  handleTyping: (typing: boolean) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  otherUser: ChatUser;
  handleJoinCall: (type: "video" | "audio") => Promise<void>;
  handleLeaveCall: () => void;
  activeCallType: "video" | "audio" | null;
  isJoiningCall: boolean;
  isCallConnected: boolean;
  liveKitToken: string | null;
  setIsCallConnected: React.Dispatch<React.SetStateAction<boolean>>;
  setIsJoiningCall: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function useChatRoomState(chatRoomId: string): UseChatRoomState {
  const { user } = useUser();
  const { getToken } = useAuth();
  const { socket, isConnected, joinRoom, leaveRoom, emitTyping } = useSocket();
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Record<string, string>>({});
  const [liveKitToken, setLiveKitToken] = useState<string | null>(null);
  const [isJoiningCall, setIsJoiningCall] = useState(false);
  const [isCallConnected, setIsCallConnected] = useState(false);
  const [activeCallType, setActiveCallType] = useState<
    "video" | "audio" | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    error: apolloError,
    refetch,
  } = useQuery(GET_MESSAGES, {
    variables: { chatRoomId },
    skip: !chatRoomId,
    fetchPolicy: "cache-and-network",
    onCompleted: () => setIsLoading(false),
    onError: (err) => setError(err.message),
  });

  // Apollo: mutation for sending messages
  const [createMessage] = useMutation(CREATE_MESSAGE);

  // Load previous messages when data is available
  useEffect(() => {
    if (chatData?.getMessages) {
      setMessages(chatData.getMessages as MessageType[]);
      setIsLoading(false);
      setError(null);
    }
  }, [chatData]);

  // Socket Effects for real-time
  useEffect(() => {
    if (!socket || !chatRoomId) return;
    joinRoom(chatRoomId);
    const handleNewMessage = (message: MessageType) => {
      setMessages((prev) => {
        const exists = prev.some(
          (msg) =>
            msg.content === message.content && msg.userId === message.userId
        );
        if (!exists) {
          return [...prev, message];
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
            chatRoomId: "685a1b9dff6157ee051ccaaa",
            userId: user.id,
            type: "TEXT",
            content: content.trim(),
          },
        });
        await refetch();
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setIsSending(false);
      }
    },
    [user, chatRoomId, createMessage, isSending, refetch]
  );

  const handleSendFile = useCallback(async () => {
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
        setError(error instanceof Error ? error.message : String(error));
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
    user: user as ChatUser | null,
    messages,
    setMessages,
    typingUsers,
    isSending,
    isConnected,
    isLoading: isLoading || chatLoading,
    error: error || (apolloError ? apolloError.message : null),
    handleSendMessage,
    handleSendFile,
    handleTyping,
    messagesEndRef: messagesEndRef as React.RefObject<HTMLDivElement>,
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
