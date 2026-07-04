import { useContext } from "react";
import { PresenceContext } from "../context/PresenceContext";

const EMPTY = { onlineUsers: [], onlineIds: new Set() };

// Safe outside the provider (returns an empty presence) so avatars that render
// on public/pre-auth screens never crash.
export function usePresence() {
  return useContext(PresenceContext) ?? EMPTY;
}
