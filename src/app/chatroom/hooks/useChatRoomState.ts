import { useState, useEffect, useRef, useCallback } from "react";
import { useUser as useClerkUser, useAuth } from "@clerk/nextjs";
import { useQuery, useMutation, gql } from "@apollo/client";
import { useSocket } from "@/context/SocketContext";
import { fetchLiveKitToken } from "@/lib/livekit";
import { User as ChatUser } from "@/app/chatroom/types/chat";

const GET_MESSAGES = gql`
  query getMessages($chatRoomId: ID!) {
    getMessages(chatRoomId: $chatRoomId) {
      chatRoomId
      ChatRoomsMessages {
        userId
        type
        content
        createdAt
      }
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
      ChatRoomsMessages {
        userId
        type
        content
        createdAt
      }
    }
  }
`;

// Update MessageType to match expected Message type
export interface MessageType {
  id: string;
  chatRoomId: string;
  userId: string;
  type: "TEXT" | "IMAGE" | "FILE";
  content: string;
  createdAt: string;
}

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
  console.log("useChatRoomState initialized for chatRoomId:", chatRoomId);
  const { user } = useClerkUser();
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
  const [otherUser, setOtherUser] = useState<ChatUser | null>(null);

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
    if (chatData?.getMessages && chatData.getMessages.length > 0) {
      // Map ChatRoomsMessages to include id from _id and chatRoomId, and cast type
      const mapped = chatData.getMessages[0].ChatRoomsMessages.map(
        (msg: any, idx: number) => ({
          id: msg._id ? msg._id : `${msg.userId}-${msg.createdAt || idx}`,
          chatRoomId: chatData.getMessages[0].chatRoomId,
          userId: msg.userId,
          type: msg.type as "TEXT" | "IMAGE" | "FILE",
          content: msg.content,
          createdAt: msg.createdAt,
        })
      );
      setMessages(mapped);
      setIsLoading(false);
      setError(null);
    }
  }, [chatData]);

  // Fetch other user info based on chatRoomId and messages
  useEffect(() => {
    if (!user || !chatRoomId || !messages.length) return;
    // Find the other participant's userId
    const otherUserId = messages.find((msg) => msg.userId !== user.id)?.userId;
    if (!otherUserId) return;
    // Try to fetch user profile from Clerk (if available)
    // If Clerk is not used for other users, fallback to minimal info
    // TODO: Replace with real user fetching logic if you have a user API
    setOtherUser({
      id: otherUserId,
      name: `User ${otherUserId.slice(-4)}`,
      avatar: "/default-avatar.png",
      isLawyer: false,
    });
  }, [user, chatRoomId, messages]);

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
        const { data: mutationData } = await createMessage({
          variables: {
            chatRoomId,
            userId: user.id,
            type: "TEXT",
            content: content.trim(),
          },
        });
        // Append the new message to the messages state
        if (
          mutationData?.createMessage?.ChatRoomsMessages &&
          mutationData.createMessage.ChatRoomsMessages.length > 0
        ) {
          const mapped = mutationData.createMessage.ChatRoomsMessages.map(
            (msg: any, idx: number) => ({
              id: msg._id ? msg._id : `${msg.userId}-${msg.createdAt || idx}`,
              chatRoomId,
              userId: msg.userId,
              type: msg.type as "TEXT" | "IMAGE" | "FILE",
              content: msg.content,
              createdAt: msg.createdAt,
            })
          );
          setMessages((prev) => [...prev, ...mapped]);
        }
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
        console.log("Fetching LiveKit token...");
        const clerkToken = await getToken();
        if (!chatRoomId || !clerkToken)
          throw new Error("Missing chatRoomId or Clerk token");
        const token = await fetchLiveKitToken(chatRoomId, clerkToken);
        console.log("Token received, connecting to LiveKit...");
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
    otherUser: otherUser || { id: "", name: "", avatar: "", isLawyer: false },
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
