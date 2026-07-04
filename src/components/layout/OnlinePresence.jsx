import { UserAvatar } from "@/components/shared/UserAvatar";
import { usePresence } from "@/hooks/usePresence";
import { useAuth } from "@/hooks/useAuth";

// Max avatars before collapsing into a "+N" chip.
const MAX_SHOWN = 5;

// Header facepile of who else is online right now — small overlapping avatars,
// each with a green presence dot. Desktop only (mirrors the date label's
// `hidden lg:*`), and hidden entirely when nobody else is online.
export function OnlinePresence() {
  const { onlineUsers } = usePresence();
  const { user } = useAuth();

  const others = onlineUsers.filter(
    (u) => u._id !== user?._id && u._id !== user?.id
  );
  if (others.length === 0) return null;

  const shown = others.slice(0, MAX_SHOWN);
  const extra = others.length - shown.length;

  return (
    <div
      className="hidden lg:flex items-center -space-x-2"
      aria-label={`${others.length} other ${others.length === 1 ? "person" : "people"} online`}
    >
      {shown.map((u) => (
        <div key={u._id} title={`${u.name} · online`}>
          <UserAvatar
            name={u.name}
            src={u.avatarUrl}
            size="sm"
            online
            className="ring-2 ring-white dark:ring-card"
          />
        </div>
      ))}
      {extra > 0 && (
        <div className="h-8 w-8 rounded-full ring-2 ring-white dark:ring-card bg-gray-200 dark:bg-muted text-gray-700 dark:text-foreground flex items-center justify-center text-xs font-semibold shrink-0">
          +{extra}
        </div>
      )}
    </div>
  );
}
