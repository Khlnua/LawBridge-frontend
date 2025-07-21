"use client";

import React, { useState, useEffect, useRef } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import { useMutation, useQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import {
  Send,
  MessageCircle,
  Scale,
  FileText,
  Clock,
  User,
  Bot,
  Trash2,
  BarChart3,
  Loader2,
  AlertCircle,
} from "lucide-react";

// GraphQL Queries and Mutations
const SAVE_CHAT_HISTORY = gql`
  mutation SaveChatHistory($input: ChatHistoryInput!) {
    saveChatHistory(input: $input) {
      _id
      userId
      sessionId
      userMessage
      botResponse
      createdAt
    }
  }
`;

const GET_CHAT_HISTORY_BY_USER = gql`
  query GetChatHistoryByUser($userId: String!) {
    getChatHistoryByUser(userId: $userId) {
      _id
      userId
      sessionId
      userMessage
      botResponse
      createdAt
    }
  }
`;

interface Message {
  id: number;
  text: string | Object;
  sender: "user" | "bot";
  timestamp: Date;
  sourceDocuments?: any[];
  metadata?: any;
  isError?: boolean;
}

interface ChatOptions {
  maxTokens?: number;
  temperature?: number;
  includeSourceDocs?: boolean;
  maxHistoryLength?: number;
}

interface ChatStats {
  messageCount: number;
  lastMessageTime?: string;
}

const LawBridgeChat = () => {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(
    () => `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  );
  const [stats, setStats] = useState<ChatStats>({ messageCount: 0 });
  const [showWelcome, setShowWelcome] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // GraphQL hooks
  const [saveChatHistory] = useMutation(SAVE_CHAT_HISTORY, {
    onError: (error) => {
      console.error("Error saving chat history:", error);
    },
  });

  const {
    data: chatHistoryData,
    loading: historyLoading,
    error: historyError,
    refetch: refetchHistory,
  } = useQuery(GET_CHAT_HISTORY_BY_USER, {
    variables: { userId: user?.id || "" },
    skip: !user?.id,
    fetchPolicy: "cache-and-network",
  });

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Load chat history when data is available
  useEffect(() => {
    if (chatHistoryData?.getChatHistoryByUser) {
      // Ensure messages are sorted oldest-to-newest
      const history = [...chatHistoryData.getChatHistoryByUser].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      const loadedMessages: Message[] = [];

      history.forEach((item: any, index: number) => {
        // Add user message
        loadedMessages.push({
          id: index * 2,
          text: item.userMessage,
          sender: "user",
          timestamp: new Date(item.createdAt),
        });

        // Add bot response (parse JSON if needed)
        let botText = item.botResponse;
        try {
          const parsed = JSON.parse(botText);
          botText = parsed.answer || JSON.stringify(parsed);
        } catch {
          // Not JSON, use as is
        }
        loadedMessages.push({
          id: index * 2 + 1,
          text: botText,
          sender: "bot",
          timestamp: new Date(item.createdAt),
        });
      });

      setMessages(loadedMessages);
      setStats({ messageCount: history.length });

      if (loadedMessages.length > 0) {
        setShowWelcome(false);
      }
    }
  }, [chatHistoryData]);

  // Handle history loading error
  useEffect(() => {
    if (historyError) {
      console.error("Failed to load chat history:", historyError);
      setConnectionError("Unable to load chat history");
    }
  }, [historyError]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !user) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputMessage.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);
    setShowWelcome(false);
    setConnectionError(null);

    try {
      const token = await getToken();
      const chatOptions: ChatOptions = {
        maxTokens: 600,
        temperature: 0.3,
        includeSourceDocs: true,
        maxHistoryLength: 10,
      };

      const requestBody = {
        message: userMessage.text,
        userId: user.id,
        options: chatOptions,
      };

      console.log("Sending request:", requestBody);

      // Send to your existing chat API endpoint
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"
        }/api/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      console.log("Received response:", data);

      const botMessage: Message = {
        id: Date.now() + 1,
        text:
          data.answer ||
          "I received your message but couldn't generate a response.",
        sender: "bot",
        timestamp: new Date(),
        sourceDocuments: data.sourceDocuments || [],
        metadata: data.metadata || {},
      };

      setMessages((prev) => [...prev, botMessage]);

      // Save chat history using GraphQL mutation
      try {
        // Ensure we're only saving string values
        const chatHistoryInput = {
          userId: String(user.id),
          sessionId: String(sessionId),
          userMessage: String(userMessage.text).trim(),
          botResponse: JSON.stringify(botMessage.text),
        };

        console.log("Saving chat history:", chatHistoryInput);

        await saveChatHistory({
          variables: {
            input: chatHistoryInput,
          },
        });

        // Update stats
        setStats((prev) => ({
          ...prev,
          messageCount: prev.messageCount + 1,
          lastMessageTime: new Date().toISOString(),
        }));
      } catch (saveError) {
        console.error("Failed to save chat history:", saveError);

        // Log the actual data being sent for debugging
        console.log("User message:", userMessage.text);
        console.log("Bot response:", botMessage.text);
        console.log("Data types:", {
          userMessageType: typeof userMessage.text,
          botResponseType: typeof botMessage.text,
        });

        // Don't show error to user for history saving failures
      }
    } catch (error) {
      console.error("Error sending message:", error);

      let errorText =
        "I apologize, but I encountered an error processing your request. Please try again.";

      if (error instanceof Error) {
        if (error.message.includes("fetch")) {
          errorText =
            "Unable to connect to the server. Please check your connection and try again.";
          setConnectionError("Connection failed");
        } else if (error.message.includes("rate limit")) {
          errorText =
            "Service is temporarily busy. Please try again in a moment.";
        } else if (error.message.includes("timeout")) {
          errorText = "Request timeout. Please try with a shorter message.";
        }
      }

      const errorMessage: Message = {
        id: Date.now() + 1,
        text: errorText,
        sender: "bot",
        timestamp: new Date(),
        isError: true,
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = async () => {
    if (isLoading || !user) return;

    try {
      // Clear local state immediately
      setMessages([]);
      setShowWelcome(true);
      setStats({ messageCount: 0 });
      setConnectionError(null);

      // Optional: You might want to add a GraphQL mutation to clear chat history
      // For now, we'll just refetch to get the latest state
      await refetchHistory();
    } catch (error) {
      console.error("Error clearing chat:", error);
      setConnectionError("Failed to clear chat");

      // Restore previous state on error
      if (chatHistoryData?.getChatHistoryByUser) {
        const history = chatHistoryData.getChatHistoryByUser;
        const loadedMessages: Message[] = [];

        history.forEach((item: any, index: number) => {
          loadedMessages.push({
            id: index * 2,
            text: item.userMessage,
            sender: "user",
            timestamp: new Date(item.createdAt),
          });

          loadedMessages.push({
            id: index * 2 + 1,
            text: item.botResponse,
            sender: "bot",
            timestamp: new Date(item.createdAt),
          });
        });

        setMessages(loadedMessages);
        setShowWelcome(loadedMessages.length === 0);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Show loading while user data or history is loading
  if (!isLoaded || historyLoading) {
    return <LoadingSpinner />;
  }

  // Show authentication required if user is not logged in
  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Scale className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Authentication Required
          </h1>
          <p className="text-gray-600 mb-6">
            Please sign in to use the LawBridge AI assistant.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl flex items-center justify-center">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">LawBridge</h1>
              <p className="text-sm text-gray-500">Legal AI Assistant</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {connectionError && (
              <div className="flex items-center space-x-2 text-red-500 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>Connection Issue</span>
              </div>
            )}

            {stats.messageCount > 0 && !connectionError && (
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <BarChart3 className="w-4 h-4" />
                <span>{stats.messageCount} messages</span>
              </div>
            )}

            {messages.length > 0 && (
              <button
                onClick={clearChat}
                disabled={isLoading}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear Chat</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {showWelcome && messages.length === 0 ? (
          <WelcomeScreen />
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-3 ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.sender === "bot" && (
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.isError
                        ? "bg-red-100"
                        : "bg-gradient-to-br from-blue-600 to-purple-700"
                    }`}
                  >
                    {message.isError ? (
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>
                )}

                <div
                  className={`max-w-3xl rounded-2xl px-4 py-3 ${
                    message.sender === "user"
                      ? "bg-gradient-to-r from-blue-600 to-purple-700 text-white"
                      : message.isError
                      ? "bg-red-50 border border-red-200 text-red-800"
                      : "bg-white shadow-sm border border-gray-200 text-gray-800"
                  }`}
                >
                  <div className="whitespace-pre-wrap leading-relaxed">
                    {typeof message.text === "object"
                      ? (message.text as any).answer ||
                        JSON.stringify(message.text)
                      : message.text.toString()}
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100/20">
                    <div
                      className={`text-xs ${
                        message.sender === "user"
                          ? "text-blue-100"
                          : message.isError
                          ? "text-red-600"
                          : "text-gray-500"
                      }`}
                    >
                      {formatTimestamp(message.timestamp)}
                    </div>

                    {message.metadata && message.metadata.responseTime && (
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{message.metadata.responseTime}ms</span>
                      </div>
                    )}
                  </div>

                  {message.sourceDocuments &&
                    message.sourceDocuments.length > 0 && (
                      <div className="mt-3 pt-2 border-t border-gray-100">
                        <div className="text-xs text-gray-500 mb-1">
                          Sources: {message.sourceDocuments.length} documents
                          referenced
                        </div>
                      </div>
                    )}
                </div>

                {message.sender === "user" && (
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-700 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white px-4 py-3 rounded-2xl shadow-sm border border-gray-200 text-gray-800">
                  <Loader2 className="animate-spin w-4 h-4 text-gray-500" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-4">
          <textarea
            ref={inputRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your legal question here..."
            rows={1}
            className="flex-1 resize-none border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className="bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white px-4 py-2 rounded-xl flex items-center space-x-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            <span>Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Loading Component
const LoadingSpinner = () => (
  <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-blue-400 rounded-full animate-spin animate-reverse"></div>
      </div>
      <p className="text-slate-600 font-medium animate-pulse">Loading...</p>
    </div>
  </div>
);

// Welcome Screen Component
const WelcomeScreen = () => (
  <div className="flex-1 flex items-center justify-center p-8">
    <div className="text-center max-w-2xl">
      <div className="mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Scale className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to{" "}
          <span className="bg-gradient-to-r from-blue-600 to-purple-700 bg-clip-text text-transparent">
            LawBridge
          </span>
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Your professional legal AI assistant for document analysis and
          consultation
        </p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
        <p className="text-sm text-amber-800">
          <strong>Important:</strong> This is for informational purposes only
          and does not constitute legal advice.
        </p>
      </div>

      <div className="text-sm text-gray-500">
        Start by typing your legal question below
      </div>
    </div>
  </div>
);

export default LawBridgeChat;
