export interface User {
  id: string;
  name: string;
  isLawyer: boolean;
  avatar: string;
}

export interface Message {
  id: string; // Every message MUST have a unique ID
  text: string;
  type: "text" | "image" | "video" | "document";
  fileUrl?: string;
  fileName?: string;
  timestamp: Date | string; // Can be a Date object or an ISO string
  sender: User;
  chatRoomId: string; // ID of the chat room this message belongs to
}