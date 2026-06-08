import { Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  formatAbsoluteTime,
  formatRelativeTime,
} from "@/components/notifications-components/notificationsUtils";
import { useAuditLog } from "@/hooks/useAuditLog";

const TARGET_MODELS = ["Tithes", "RequestForm", "Voucher", "Expense", "User", "Category"];
const ACTIONS = [
  "tithes.submit", "tithes.update", "tithes.approve", "tithes.reject",
  "rf.create", "rf.update", "rf.delete", "rf.submit", "rf.validate",
  "rf.approve", "rf.reject", "rf.disburse", "rf.receive",
  "voucher.create", "voucher.cancel",
  "expense.create",
  "user.create", "user.update", "user.deactivate", "user.delete", "user.change_password",
  "category.create", "category.update", "category.delete",
  "auth.forgot_password", "auth.reset_password",
];

const roleStyles = {
  admin:     "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400",
  pastor:    "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  validator: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-400",
  auditor:   "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-400",
  do:        "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400",
  member:    "bg-gray-100 text-gray-700 dark:bg-muted dark:text-muted-foreground",
};

function RoleBadge({ role }) {
  if (!role) return null;
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${roleStyles[role] ?? roleStyles.member}`}>
      {role}
    </span>
  );
}

function AuditLog() {
  const { data, total, page, limit, setPage, filters, setFilter, loading, error } =
    useAuditLog();

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const pageStart = (page - 1) * limit;

  const emptyText = loading
    ? "Loading audit log…"
    : error
    ? error
    : "No audit entries found.";

  return (
    <div className="w-full flex-1 min-h-0 flex flex-col gap-5 overflow-auto px-1 pb-[calc(6rem+env(safe-area-inset-bottom))] md:pb-0">
      <div>
        <h1 className="text-xl md:text-2xl font-semibold">Audit Log</h1>
        <p className="text-sm text-muted-foreground">
          Every recorded action across the system — who did what, and when.
        </p>
      </div>

      <div className="shrink-0 flex flex-wrap gap-2">
        <Select
          value={filters.targetModel || "all"}
          onValueChange={(v) => setFilter({ targetModel: v === "all" ? "" : v })}
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="All resources" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All resources</SelectItem>
            {TARGET_MODELS.map((m) => (
              <SelectItem key={m} value={m}>{m}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.action || "all"}
          onValueChange={(v) => setFilter({ action: v === "all" ? "" : v })}
        >
          <SelectTrigger className="w-52">
            <SelectValue placeholder="All actions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All actions</SelectItem>
            {ACTIONS.map((a) => (
              <SelectItem key={a} value={a}>{a}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card className="w-full flex-1 min-h-0 flex flex-col">
        <CardHeader className="border-b py-3">
          <p className="text-xs text-muted-foreground">
            Read-only trail. Entries are recorded automatically and cannot be edited.
          </p>
        </CardHeader>

        <CardContent className="flex-1 min-h-0 overflow-auto p-0">
          {data.length === 0 ? (
            <div className="py-16 flex flex-col items-center gap-2 text-sm text-muted-foreground">
              <Inbox className="h-8 w-8 opacity-50" />
              <p>{emptyText}</p>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader className="sticky top-0 bg-background z-10">
                    <TableRow>
                      <TableHead>When</TableHead>
                      <TableHead>Who</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Target</TableHead>
                      <TableHead>Summary</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.map((r) => (
                      <TableRow key={r._id}>
                        <TableCell className="text-muted-foreground whitespace-nowrap" title={formatAbsoluteTime(r.createdAt)}>
                          {formatRelativeTime(r.createdAt)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{r.actorName ?? "—"}</span>
                            <RoleBadge role={r.actorRole} />
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-xs">{r.action}</TableCell>
                        <TableCell className="text-muted-foreground">{r.targetRef ?? "—"}</TableCell>
                        <TableCell>{r.summary ?? "—"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile list */}
              <ul className="md:hidden divide-y">
                {data.map((r) => (
                  <li key={r._id} className="px-4 py-3 space-y-1">
                    <p className="text-sm">{r.summary ?? r.action}</p>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">{r.actorName ?? "—"}</span>
                      <RoleBadge role={r.actorRole} />
                      <span>·</span>
                      <span title={formatAbsoluteTime(r.createdAt)}>{formatRelativeTime(r.createdAt)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </CardContent>

        <CardFooter className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2 border-t py-3">
          <p className="hidden sm:block text-xs text-muted-foreground">
            Showing {total === 0 ? 0 : pageStart + 1}–{Math.min(pageStart + limit, total)} of {total}
          </p>
          <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="text-xs text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page >= totalPages}
            >
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default AuditLog;
