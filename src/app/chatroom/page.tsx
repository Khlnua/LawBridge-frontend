"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery, gql } from "@apollo/client";
import { useState, useMemo, useEffect, useCallback } from "react";
import ChatRoom from "@/components/chat/ChatRoom";
import useChatRoomState from "@/app/chatroom/hooks/useChatRoomState";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  MessageCircle,
  Search,
  Loader2,
  AlertCircle,
  X,
  Menu,
  MessageSquare,
} from "lucide-react";

const GET_CHAT_ROOMS = gql`
  query GetChatRoomByUser($userId: String!) {
    getChatRoomByUser(userId: $userId) {
      _id
      participants
      appointmentId
      allowedMedia
    }
  }
`;

interface ChatRoom {
  _id: string;
  participants: string[];
  appointmentId: string;
  allowedMedia: string;
}

export default function MessengerLayout() {
  const { user } = useUser();
  const userId = user?.id;
  const [selectedRoomId, setSelectedRoomId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const { data, loading, error, refetch } = useQuery(GET_CHAT_ROOMS, {
    variables: { userId },
    skip: !userId,
    fetchPolicy: "cache-and-network",
    pollInterval: 30000,
  });

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const getProfile = useCallback(
    (id: string) => {
      if (id === userId) {
        return {
          name: user?.fullName || "Та",
          avatar: user?.imageUrl || "",
        };
      }
      return {
        name: "Хэрэглэгч " + id.slice(-4),
        avatar: "/default-avatar.png",
      };
    },
    [userId, user]
  );

  const chatRooms: ChatRoom[] = useMemo(() => data?.getChatRoomByUser || [], [data]);

  const filteredRooms: ChatRoom[] = useMemo(() => {
    if (!searchQuery.trim()) return chatRooms;
    const q = searchQuery.toLowerCase();
    return chatRooms.filter((room: ChatRoom) => {
      const otherId = room.participants.find((id: string) => id !== userId);
      const profile = getProfile(otherId || "");
      return profile.name.toLowerCase().includes(q);
    });
  }, [searchQuery, chatRooms, userId, getProfile]);

  const selectedRoom = filteredRooms.find((r) => r._id === selectedRoomId);
  const chatRoomState = useChatRoomState(selectedRoomId);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const handleSelectRoom = (roomId: string) => {
    setSelectedRoomId(roomId);
    if (isMobile) setSidebarOpen(false);
  };

  const handleRetry = () => refetch();

  return (
    <div className="flex h-screen w-screen bg-gray-50 text-gray-800">
      {/* Sidebar */}
      <div
        className={`transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } ${isMobile ? "fixed inset-y-0 left-0 z-50" : "relative"} w-[380px]`}
      >
        <aside className="w-full h-full flex flex-col shadow-lg bg-white border-r border-gray-200">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <MessageCircle className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold">Чатууд</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="p-2"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Search */}
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Хэрэглэгч хайх..."
                className="pl-10 pr-4 py-3 rounded-xl bg-gray-100 border-gray-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 h-6 w-6"
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>

          {/* Chat list */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="text-center space-y-3">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto" />
                <p className="text-sm text-gray-500">
                  Чатууд ачааллаж байна...
                </p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4 px-4">
                <div className="p-4 rounded-full bg-red-100">
                  <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <div>
                  <p className="font-semibold text-red-600 mb-1">
                    Алдаа гарлаа
                  </p>
                  <p className="text-sm text-gray-500">
                    Чатуудыг ачаалахад алдаа гарлаа
                  </p>
                </div>
                <Button onClick={handleRetry} variant="outline" size="sm">
                  <Loader2 className="w-4 h-4 mr-2" />
                  Дахин оролдох
                </Button>
              </div>
            ) : filteredRooms.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4 px-4">
                <div className="p-4 rounded-full bg-gray-100">
                  <MessageSquare className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                  <p className="font-semibold text-gray-600 mb-1">
                    Чат олдсонгүй
                  </p>
                  <p className="text-sm text-gray-500">Шинэ чат эхлүүлээрэй</p>
                </div>
              </div>
            ) : (
              <div className="space-y-1 p-2">
                {filteredRooms.map((room: ChatRoom) => {
                  const otherId = room.participants.find(
                    (id: string) => id !== userId
                  );
                  const profile = getProfile(otherId || "");
                  const selected = room._id === selectedRoomId;
                  return (
                    <div
                      key={room._id}
                      onClick={() => handleSelectRoom(room._id)}
                      className={`group relative p-4 flex gap-3 items-center cursor-pointer rounded-xl transition-all duration-200 hover:scale-[1.02] ${
                        selected
                          ? "bg-blue-50 border-l-4 border-blue-600 shadow-md"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <Avatar
                        className={`w-12 h-12 ring-2 transition-all duration-200 ${
                          selected ? "ring-blue-200" : "ring-white"
                        } shadow-sm`}
                      >
                        <AvatarImage src={profile.avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white font-semibold">
                          {profile.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3
                          className={`font-semibold truncate ${
                            selected ? "text-gray-900" : "text-gray-700"
                          }`}
                        >
                          {profile.name}
                        </h3>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Sidebar Trigger (for mobile) */}
      {!sidebarOpen && (
        <Button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-3 rounded-full shadow-lg"
          size="sm"
        >
          <Menu className="w-5 h-5" />
        </Button>
      )}

      {/* Overlay for mobile */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        />
      )}

      {/* Chat Section */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {selectedRoom && chatRoomState && chatRoomState.user ? (
          <ChatRoom
            chatRoomId={selectedRoomId}
            messages={chatRoomState.messages}
            setMessages={chatRoomState.setMessages}
            user={chatRoomState.user}
            otherUser={chatRoomState.otherUser}
            typingUsers={chatRoomState.typingUsers}
            isSending={chatRoomState.isSending}
            isConnected={chatRoomState.isConnected}
            onSend={chatRoomState.handleSendMessage}
            onFileChange={chatRoomState.handleSendFile}
            onTyping={chatRoomState.handleTyping}
            messagesEndRef={chatRoomState.messagesEndRef}
            handleJoinCall={chatRoomState.handleJoinCall}
            handleLeaveCall={chatRoomState.handleLeaveCall}
            activeCallType={chatRoomState.activeCallType}
          />
        ) : (
          <div className="flex items-center justify-center flex-1 text-gray-400">
            <div className="text-center space-y-4">
              <div className="p-6 rounded-full bg-gray-100 mx-auto w-fit">
                <MessageCircle className="w-12 h-12 text-gray-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Чат сонгогдоогүй байна
                </h3>
                <p className="text-gray-500">
                  Харилцах хүнээ сонгоод чат эхлүүлээрэй
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
