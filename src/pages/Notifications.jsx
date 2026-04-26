import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { CheckCheck, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNotifications } from "@/hooks/useNotifications";
import {
  formatAbsoluteTime,
  formatRelativeTime,
  pathForRef,
  styleForType,
} from "@/components/notifications-components/notificationsUtils";

const PAGE_SIZE = 10;

const REF_LABEL = {
  Tithes: "Tithes",
  RequestForm: "Request Form",
  Voucher: "Voucher",
};

function Notifications() {
  const navigate = useNavigate();
  const { notifications, loading, error, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (filter === "unread") return notifications.filter((n) => !n.isRead);
    return notifications;
  }, [notifications, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  const handleClick = async (notif) => {
    if (!notif.isRead) {
      try {
        await markAsRead(notif._id);
      } catch {
        // Optimistic update already applied; refetch will reconcile.
      }
    }
    navigate(pathForRef(notif.refModel));
  };

  const setFilterAndReset = (next) => {
    setFilter(next);
    setPage(1);
  };

  const emptyText = loading
    ? "Loading notifications…"
    : error
    ? error
    : filter === "unread"
    ? "No unread notifications."
    : "No notifications yet.";

  return (
    <div className="w-full flex-1 min-h-0 flex flex-col gap-5 overflow-auto px-1">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold">Notifications</h1>
          <p className="text-sm text-muted-foreground">
            {unreadCount > 0
              ? `You have ${unreadCount} unread ${unreadCount === 1 ? "notification" : "notifications"}.`
              : "You're all caught up."}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          disabled={unreadCount === 0}
          onClick={() => markAllAsRead()}
          className="w-full sm:w-auto"
        >
          <CheckCheck className="h-4 w-4" /> Mark all as read
        </Button>
      </div>

      <div className="shrink-0 flex rounded-md border bg-background p-1 w-fit">
        <Button
          type="button"
          variant={filter === "all" ? "default" : "ghost"}
          size="sm"
          onClick={() => setFilterAndReset("all")}
        >
          All
          <Badge variant="secondary" className="ml-2">
            {notifications.length}
          </Badge>
        </Button>
        <Button
          type="button"
          variant={filter === "unread" ? "default" : "ghost"}
          size="sm"
          onClick={() => setFilterAndReset("unread")}
        >
          Unread
          <Badge variant="secondary" className="ml-2">
            {unreadCount}
          </Badge>
        </Button>
      </div>

      <Card className="w-full flex-1 min-h-0 flex flex-col">
        <CardHeader className="border-b py-3">
          <p className="text-xs text-muted-foreground">
            Click a notification to mark it as read and jump to the related record.
          </p>
        </CardHeader>
        <CardContent className="flex-1 min-h-0 overflow-auto p-0">
          {pageItems.length === 0 ? (
            <div className="py-16 flex flex-col items-center gap-2 text-sm text-muted-foreground">
              <Inbox className="h-8 w-8 opacity-50" />
              <p>{emptyText}</p>
            </div>
          ) : (
            <ul className="divide-y">
              {pageItems.map((n) => {
                const style = styleForType(n.type);
                return (
                  <li key={n._id}>
                    <button
                      type="button"
                      onClick={() => handleClick(n)}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-50 flex gap-3 ${
                        n.isRead ? "" : "bg-blue-50/40"
                      }`}
                    >
                      <span
                        className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${style.dot}`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm leading-tight">{n.message}</p>
                          {!n.isRead && (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                              new
                            </Badge>
                          )}
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                          <span>{REF_LABEL[n.refModel] ?? n.refModel}</span>
                          <span>·</span>
                          <Badge variant="secondary" className={style.chip}>
                            {n.type}
                          </Badge>
                          <span>·</span>
                          <span title={formatAbsoluteTime(n.createdAt)}>
                            {formatRelativeTime(n.createdAt)}
                          </span>
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
        <CardFooter className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2 border-t py-3">
          <p className="hidden sm:block text-xs text-muted-foreground">
            Showing {filtered.length === 0 ? 0 : pageStart + 1}–
            {Math.min(pageStart + PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-xs text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Notifications;
