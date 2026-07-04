import { getInitials, colorFromName } from "@/lib/avatar";
import { usePresence } from "@/hooks/usePresence";

// Single reusable avatar: shows the uploaded photo when `src` is set, otherwise
// a deterministic colored initials circle. Used in the header, sidebar/drawer,
// Users table, RF comments, and the Profile page.
const SIZES = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-24 w-24 text-2xl",
};

export function UserAvatar({ name = "", src, size = "md", className = "", online, userId }) {
  const { onlineIds } = usePresence();
  const dim = SIZES[size] ?? SIZES.md;
  const base = `${dim} ${className} rounded-full shrink-0 overflow-hidden flex items-center justify-center font-semibold`;

  const circle = src ? (
    <div className={base}>
      <img src={src} alt={name} className="w-full h-full object-cover" />
    </div>
  ) : (
    <div className={`${base} ${colorFromName(name)}`}>{getInitials(name)}</div>
  );

  // Presence: an explicit `online` prop wins (e.g. the facepile); otherwise
  // derive it from `userId` against the live online set. Callers that pass
  // neither get the original markup unchanged — no wrapper, no dot.
  const isOnline =
    online !== undefined ? online : userId ? onlineIds.has(userId) : undefined;

  if (isOnline === undefined) return circle;

  return (
    <div className="relative inline-flex shrink-0">
      {circle}
      {isOnline && (
        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white dark:ring-card" />
      )}
    </div>
  );
}

export default UserAvatar;
