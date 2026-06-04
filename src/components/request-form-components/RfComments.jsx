import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRfComments } from "@/hooks/useRfComments";
import { formatRelativeTime } from "@/components/notifications-components/notificationsUtils";

const roleStyles = {
  admin:     "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400",
  pastor:    "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  validator: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-400",
  auditor:   "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-400",
  do:        "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400",
  member:    "bg-gray-100 text-gray-700 dark:bg-muted dark:text-muted-foreground",
};

export function RfComments({ rfId, open, canPost }) {
  const { comments, loading, error, posting, addComment } = useRfComments(rfId, open);
  const [text, setText] = useState("");

  const submit = async () => {
    const t = text.trim();
    if (!t) return;
    await addComment(t);
    setText("");
  };

  return (
    <div>
      <div className="text-xs text-muted-foreground mb-3">Comments</div>

      <div className="space-y-3">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading comments…</p>
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : comments.length === 0 ? (
          <p className="text-sm text-muted-foreground">No comments yet.</p>
        ) : (
          comments.map((c) => (
            <div key={c._id} className="text-sm">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium">{c.authorId?.name ?? "—"}</span>
                {c.authorId?.role && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${roleStyles[c.authorId.role] ?? roleStyles.member}`}>
                    {c.authorId.role}
                  </span>
                )}
                <span className="text-xs text-muted-foreground">
                  {formatRelativeTime(c.createdAt)}
                </span>
              </div>
              <div className="mt-0.5 whitespace-pre-wrap break-words">{c.text}</div>
            </div>
          ))
        )}
      </div>

      {canPost && (
        <div className="mt-3 flex flex-col gap-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={2}
            placeholder="Add a comment…"
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
          />
          <div className="flex justify-end">
            <Button type="button" size="sm" onClick={submit} disabled={posting || !text.trim()}>
              {posting ? "Posting…" : "Post"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
