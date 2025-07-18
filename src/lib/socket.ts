import { io } from "socket.io-client";

const socket = io("http://localhost:4000", {
  path: "/socket.io",
  transports: ["websocket", "polling"],
  auth: {
    token: "YOUR_AUTH_TOKEN", // replace dynamically if needed
  },
});

export const getSocket = () => socket;
