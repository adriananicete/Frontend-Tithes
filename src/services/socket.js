import { io } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:7001/api";
const SOCKET_URL = API_URL.replace(/\/api\/?$/, "");

let socket = null;

export const getSocket = () => socket;

export const connectSocket = () => {
  if (socket && socket.connected) return socket;
  if (socket) socket.disconnect();
  // Auth rides the httpOnly cookie via withCredentials; the auth.token payload
  // is only a dev/legacy fallback when a token still sits in localStorage.
  const token = localStorage.getItem("token");
  socket = io(SOCKET_URL, {
    withCredentials: true,
    ...(token ? { auth: { token } } : {}),
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
