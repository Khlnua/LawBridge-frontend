import { useEffect, useState } from "react";
import { connectSocket, getSocket } from "@/lib/socket";
import { useAuth } from "@clerk/clerk-react";

export function useChatSocket() {
  const { getToken } = useAuth();
  const [socketReady, setSocketReady] = useState(false);

  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (!token) return;

      const socket = connectSocket(token);

      socket.on("connect", () => {
        console.log("✅ Socket connected:", socket.id);
        setSocketReady(true);
      });

      socket.on("chat-message", (message) => {
        console.log("📩 New message:", message);
      });

      socket.on("connect_error", (err) => {
        console.error("❌ Socket connection error:", err.message);
      });

      return () => {
        socket.disconnect();
      };
    })();
  }, []);

  return { socket: getSocket(), socketReady };
}
