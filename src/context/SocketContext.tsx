// src/context/SocketContext.tsx - CORRECTED VERSION

"use client"
import React, { createContext, useContext, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import { useAuth } from "@clerk/nextjs";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { getToken, isSignedIn } = useAuth(); // Get isSignedIn status as well

  useEffect(() => {
    // Only attempt to connect if the user is signed in
    if (!isSignedIn) {
      return;
    }

    let s: Socket; // Define socket instance variable

    const setupSocket = async () => {
      const token = await getToken();

      // Prevent connection if token is not available
      if (!token) {
          console.log("Waiting for auth token...");
          return;
      }
      
      s = io("https://lawbridge-server.onrender.com/", {
        path: "/socket.io",
        auth: { token },
        transports: ["websocket"], // Forcing websocket is fine for modern browsers
      });

      setSocket(s);

      s.on("connect", () => {
        console.log("✅ Socket connected:", s.id);
        setIsConnected(true);
      });

      s.on("disconnect", () => {
        console.log("❌ Socket disconnected");
        setIsConnected(false);
      });

      s.on("connect_error", (err) => {
        console.error("❌ Socket connect error:", err.message);
        // This will now properly show "Authentication error: ..." from your server
      });
    };

    setupSocket();

    // --- CRITICAL CLEANUP FUNCTION ---
    // This function will run when the component unmounts
    return () => {
      if (s) {
        s.disconnect();
        setSocket(null);
        setIsConnected(false);
        console.log("🧹 Socket cleaned up.");
      }
    };
  }, [isSignedIn, getToken]); // Rerun effect if signed-in status or getToken function changes

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};