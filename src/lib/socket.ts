import { io } from "socket.io-client";

const socket = io("http://localhost:4000", {
  path: "/socket.io",  // Үүнийг сервертэй ижил тохируул
  transports: ["websocket", "polling"], // polling-ийг бичих нь WebSocket-р fallback-д тустай
  auth: {
    token: "YOUR_AUTH_TOKEN",
  },
});


export const getSocket = () => socket;
