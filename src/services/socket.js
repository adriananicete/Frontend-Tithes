import { io } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:7001/api";
const SOCKET_URL = API_URL.replace(/\/api\/?$/, "");

// When VITE_API_URL is relative (e.g. "/api" behind the Vercel proxy),
// SOCKET_URL is "" → connect to the current origin and use HTTP long-polling,
// which Vercel proxies to the backend (raw WebSocket upgrades aren't proxied).
// First-party cookies on the same origin keep socket auth working on all
// browsers (incl. Safari/iOS, which block cross-site cookies).
const proxied = SOCKET_URL === "";

let socket = null;

export const getSocket = () => socket;

export const connectSocket = () => {
  // In prod the API + socket run behind the Vercel proxy, which can't carry a
  // WebSocket/long-poll reliably (and a direct cross-origin socket loses the
  // auth cookie on Safari/Chrome). So skip the socket when proxied and let
  // NotificationsContext fall back to polling. Dev (absolute URL) keeps the ws.
  if (proxied) return null;
  if (socket && socket.connected) return socket;
  if (socket) socket.disconnect();
  // Auth rides the httpOnly cookie via withCredentials; the auth.token payload
  // is only a dev/legacy fallback when a token still sits in localStorage.
  const token = localStorage.getItem("token");
  socket = io(proxied ? window.location.origin : SOCKET_URL, {
    withCredentials: true,
    ...(token ? { auth: { token } } : {}),
    // Behind the Vercel proxy only long-polling works; direct (dev) keeps ws.
    transports: proxied ? ["polling"] : ["websocket", "polling"],
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
