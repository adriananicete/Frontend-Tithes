import { io } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:7001/api";
const SOCKET_URL = API_URL.replace(/\/api\/?$/, "");

let socket = null;

export const getSocket = () => socket;

export const connectSocket = () => {
  if (socket && socket.connected) return socket;
  const token = localStorage.getItem("token");
  if (!token) return null;
  if (socket) socket.disconnect();
  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ["websocket", "polling"],
    autoConnect: true,
  });
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
