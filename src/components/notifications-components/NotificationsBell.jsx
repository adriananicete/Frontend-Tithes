import { useState } from "react";
import { useNavigate } from "react-router";
import { IoNotificationsOutline } from "react-icons/io5";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/hooks/useNotifications";
import { formatRelativeTime, pathForRef, styleForType } from "./notificationsUtils";

const PREVIEW_COUNT = 5;

export function NotificationsBell() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead, loading, error } =
    useNotifications();

  const preview = notifications.slice(0, PREVIEW_COUNT);
  const badgeText = unreadCount > 9 ? "9+" : String(unreadCount);

  const handleItemClick = async (notif) => {
    setOpen(false);
    if (!notif.isRead) {
      try {
        await markAsRead(notif._id);
      } catch {
        // Optimistic update already applied; refetch will reconcile.
      }
    }
    navigate(pathForRef(notif.refModel, notif.refId));
  };

  const handleViewAll = () => {
    setOpen(false);
    navigate("/notifications");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        type="button"
        aria-label="Notifications"
        className="relative border border-gray-300 p-2 rounded-[5px] text-gray-700 hover:bg-gray-50"
      >
        <IoNotificationsOutline size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-semibold">
            {badgeText}
          </span>
        )}
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0" sideOffset={8}>
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div>
            <p className="text-sm font-semibold">Notifications</p>
            <p className="text-xs text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={() => markAllAsRead()}>
              Mark all read
            </Button>
          )}
        </div>

        <div className="max-h-80 overflow-auto divide-y">
          {loading && preview.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-muted-foreground">
              Loading…
            </p>
          ) : error ? (
            <p className="px-4 py-6 text-center text-sm text-red-600">{error}</p>
          ) : preview.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-muted-foreground">
              No notifications yet.
            </p>
          ) : (
            preview.map((n) => {
              const style = styleForType(n.type);
              return (
                <button
                  key={n._id}
                  type="button"
                  onClick={() => handleItemClick(n)}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 flex gap-3 ${
                    n.isRead ? "" : "bg-blue-50/40"
                  }`}
                >
                  <span className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${style.dot}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm leading-tight">{n.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatRelativeTime(n.createdAt)}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>

        <div className="border-t px-2 py-2">
          <Button variant="ghost" size="sm" className="w-full" onClick={handleViewAll}>
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
