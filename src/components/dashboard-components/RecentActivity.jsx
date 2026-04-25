import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
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
import { formatActivityAmount, formatActivityDate } from "./dashboardUtils";

const actionStyles = {
  Created:   "bg-blue-100 text-blue-700",
  Approved:  "bg-green-100 text-green-700",
  Validated: "bg-indigo-100 text-indigo-700",
  Submitted: "bg-yellow-100 text-yellow-700",
  Rejected:  "bg-red-100 text-red-700",
  Received:  "bg-emerald-100 text-emerald-700",
};

const roleStyles = {
  admin:     "bg-purple-100 text-purple-700",
  pastor:    "bg-amber-100 text-amber-700",
  validator: "bg-indigo-100 text-indigo-700",
  auditor:   "bg-sky-100 text-sky-700",
  do:        "bg-orange-100 text-orange-700",
  member:    "bg-gray-100 text-gray-700",
};

// Backend has no audit log, so we can only surface activity from the
// records we actually fetch (tithes + RF + voucher). Category/User/Reports
// activity would need a real audit-log endpoint.
const typeOptions = ["All", "Tithes", "Voucher", "Request Form"];
const PAGE_SIZE = 10;

export function RecentActivity({
  activity = [],
  loading = false,
  error = "",
  className,
}) {
  const [typeFilter, setTypeFilter] = useState("All");
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () =>
      typeFilter === "All"
        ? activity
        : activity.filter((r) => r.type === typeFilter),
    [activity, typeFilter]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  const handleFilterChange = (value) => {
    setTypeFilter(value);
    setPage(1);
  };

  const emptyText = loading
    ? "Loading activity…"
    : error
    ? error
    : "No activity found.";

  return (
    <Card className={`w-full h-full flex flex-col ${className ?? ""}`}>
      <CardHeader className="gap-3">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-1">
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions across all accounts</CardDescription>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2">
          <Select value={typeFilter} onValueChange={handleFilterChange}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              {typeOptions.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="flex-1 min-h-0 overflow-auto">
        <div className="hidden md:block">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-6">
                    {emptyText}
                  </TableCell>
                </TableRow>
              ) : (
                pageItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.user}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${roleStyles[item.role] ?? "bg-gray-100 text-gray-700"}`}>
                        {item.role}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${actionStyles[item.action] ?? "bg-gray-100 text-gray-700"}`}>
                        {item.action}
                      </span>
                    </TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell className="text-muted-foreground">{item.ref}</TableCell>
                    <TableCell className="text-right font-medium">{formatActivityAmount(item.amount)}</TableCell>
                    <TableCell className="text-muted-foreground">{formatActivityDate(item.date)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="md:hidden -mx-4 divide-y border-t">
          {pageItems.length === 0 ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              {emptyText}
            </div>
          ) : (
            pageItems.map((item) => (
              <div key={item.id} className="px-4 py-3 space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-medium truncate">{item.user}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {item.type + " · " + item.ref}
                    </div>
                  </div>
                  <span
                    className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${actionStyles[item.action] ?? "bg-gray-100 text-gray-700"}`}
                  >
                    {item.action}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 text-sm">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${roleStyles[item.role] ?? "bg-gray-100 text-gray-700"}`}
                    >
                      {item.role}
                    </span>
                    <span className="text-xs text-muted-foreground truncate">
                      {formatActivityDate(item.date)}
                    </span>
                  </div>
                  <span className="font-medium tabular-nums shrink-0">
                    {formatActivityAmount(item.amount)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>

      <CardFooter className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2 border-t py-3">
        <p className="hidden sm:block text-xs text-muted-foreground">
          Showing {filtered.length === 0 ? 0 : pageStart + 1}–{Math.min(pageStart + PAGE_SIZE, filtered.length)} of {filtered.length}
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
  );
}
