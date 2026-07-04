import { createContext, useEffect, useMemo, useState } from "react";
import { apiFetch } from "../services/api";
import { useAuth } from "../hooks/useAuth";

export const PresenceContext = createContext(null);

// How often each client announces it's still here. The backend considers a user
// online for 45s (PRESENCE_WINDOW_MS), so a ~20s beat tolerates one dropped tick.
const HEARTBEAT_MS = 20000;

// Tracks who's currently online by sending a heartbeat and reading back the
// online list in one round-trip. Heartbeat-based (not websocket) because the
// prod socket is disabled behind the Vercel proxy — see services/socket.js.
export function PresenceProvider({ children }) {
  const { user } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    // PresenceProvider only mounts inside the auth-gated Layout, so `user` is
    // set here; the guard is just defensive. No need to clear state on logout —
    // the whole provider unmounts, resetting it.
    if (!user) return;

    let cancelled = false;

    const beat = async () => {
      // Pause while the tab is backgrounded — an unfocused tab isn't "here", and
      // browsers throttle its timers past our window anyway. Focus re-beats.
      if (document.visibilityState !== "visible") return;
      try {
        const res = await apiFetch("/presence/heartbeat", { method: "POST" });
        if (!cancelled) {
          setOnlineUsers(Array.isArray(res?.online) ? res.online : []);
        }
      } catch {
        // Best-effort — the next tick retries.
      }
    };

    beat(); // announce immediately on mount / login
    const timer = setInterval(beat, HEARTBEAT_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") beat();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onVisible);

    return () => {
      cancelled = true;
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onVisible);
    };
  }, [user]);

  const onlineIds = useMemo(
    () => new Set(onlineUsers.map((u) => u._id)),
    [onlineUsers]
  );

  const value = useMemo(
    () => ({ onlineUsers, onlineIds }),
    [onlineUsers, onlineIds]
  );

  return (
    <PresenceContext.Provider value={value}>
      {children}
    </PresenceContext.Provider>
  );
}
