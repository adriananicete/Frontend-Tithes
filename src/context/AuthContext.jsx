import { createContext, useEffect, useState } from "react";
import { apiFetch } from "../services/api";
import { clearResourceCache } from "../hooks/useCachedResource";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // The JWT now lives in an httpOnly cookie the browser manages — JS never
  // touches it. We only keep the (non-sensitive) user profile for UI/role
  // rendering; the cookie is the real source of auth truth.
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        // Refresh profile fields the JWT doesn't carry (e.g. avatarUrl) so a
        // session created before the avatar feature — or on another device —
        // picks up the latest photo. Best-effort; ignore failures.
        apiFetch("/users/me")
          .then((res) => {
            if (res?.data) updateUser(res.data);
          })
          .catch(() => {});
      } catch {
        localStorage.removeItem("user");
      }
    }
    // Clean up any token left over from the pre-cookie auth scheme.
    localStorage.removeItem("token");
    setIsLoading(false);
  }, []);

  const login = (userData) => {
    // Drop any cached page data from a previous session so a new user never
    // sees the prior user's role-scoped data.
    clearResourceCache();
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Merge profile fields (e.g. avatarUrl) into the current user without the
  // cache-clear that login() does. Used after an avatar upload/remove.
  const updateUser = (partial) => {
    setUser((prev) => {
      const next = { ...(prev ?? {}), ...partial };
      localStorage.setItem("user", JSON.stringify(next));
      return next;
    });
  };

  const logout = () => {
    clearResourceCache();
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    // Tell the server to clear the httpOnly cookies; fire-and-forget.
    apiFetch("/auth/logout", { method: "POST" }).catch(() => {});
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}
