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

// ============================================================
// MOCK DATA — palitan ng fetch sa backend pag ready na
// Suggested endpoint: GET /api/activity (aggregate ng tithes + RF + vouchers + etc.)
// ============================================================
const recentActivity = [
  { id: 1,  user: "Adrian",  role: "admin",     action: "Created",   type: "Voucher",       ref: "PCF-0003",   amount: 1500, date: "2026-04-13" },
  { id: 2,  user: "Bernie",  role: "pastor",    action: "Approved",  type: "Request Form",  ref: "RF-0007",    amount: 5000, date: "2026-04-13" },
  { id: 3,  user: "Kiya",    role: "member",    action: "Submitted", type: "Tithes",        ref: "Tithes #24", amount: 2000, date: "2026-04-12" },
  { id: 4,  user: "Dani",    role: "validator", action: "Validated", type: "Request Form",  ref: "RF-0006",    amount: 3200, date: "2026-04-12" },
  { id: 5,  user: "Jaymar",  role: "do",        action: "Rejected",  type: "Tithes",        ref: "Tithes #23", amount: 800,  date: "2026-04-11" },
  { id: 6,  user: "Lourdes", role: "member",    action: "Submitted", type: "Request Form",  ref: "RF-0008",    amount: 2500, date: "2026-04-11" },
  { id: 7,  user: "Roselyn", role: "auditor",   action: "Validated", type: "Request Form",  ref: "RF-0005",    amount: 4100, date: "2026-04-10" },
  { id: 8,  user: "Berna",   role: "member",    action: "Received",  type: "Request Form",  ref: "RF-0004",    amount: 1800, date: "2026-04-10" },
  { id: 9,  user: "Adrian",  role: "admin",     action: "Created",   type: "Category",      ref: "Utilities",  amount: 0,    date: "2026-04-10" },
  { id: 10, user: "Adrian",  role: "admin",     action: "Created",   type: "User",          ref: "Kiya",       amount: 0,    date: "2026-04-09" },
  { id: 11, user: "Roselyn", role: "auditor",   action: "Exported",  type: "Reports",       ref: "Tithes.xlsx",amount: 0,    date: "2026-04-09" },
  { id: 12, user: "Dani",    role: "validator", action: "Created",   type: "Voucher",       ref: "PCF-0002",   amount: 3500, date: "2026-04-09" },
  { id: 13, user: "Kiya",    role: "member",    action: "Submitted", type: "Tithes",        ref: "Tithes #22", amount: 1200, date: "2026-04-08" },
  { id: 14, user: "Adrian",  role: "admin",     action: "Exported",  type: "Reports",       ref: "Expense.pdf",amount: 0,    date: "2026-04-08" },
  { id: 15, user: "Bernie",  role: "pastor",    action: "Approved",  type: "Request Form",  ref: "RF-0003",    amount: 2800, date: "2026-04-07" },
  { id: 16, user: "Adrian",  role: "admin",     action: "Updated",   type: "Category",      ref: "Missions",   amount: 0,    date: "2026-04-07" },
  { id: 17, user: "Lourdes", role: "member",    action: "Submitted", type: "Tithes",        ref: "Tithes #21", amount: 1500, date: "2026-04-06" },
  { id: 18, user: "Adrian",  role: "admin",     action: "Updated",   type: "User",          ref: "Dani",       amount: 0,    date: "2026-04-06" },
];

const actionStyles = {
  Created:   "bg-blue-100 text-blue-700",
  Approved:  "bg-green-100 text-green-700",
  Validated: "bg-indigo-100 text-indigo-700",
  Submitted: "bg-yellow-100 text-yellow-700",
  Rejected:  "bg-red-100 text-red-700",
  Received:  "bg-emerald-100 text-emerald-700",
  Exported:  "bg-cyan-100 text-cyan-700",
  Updated:   "bg-violet-100 text-violet-700",
};

const roleStyles = {
  admin:     "bg-purple-100 text-purple-700",
  pastor:    "bg-amber-100 text-amber-700",
  validator: "bg-indigo-100 text-indigo-700",
  auditor:   "bg-sky-100 text-sky-700",
  do:        "bg-orange-100 text-orange-700",
  member:    "bg-gray-100 text-gray-700",
};

const typeOptions = ["All", "Tithes", "Voucher", "Request Form", "Category", "User", "Reports"];
const PAGE_SIZE = 10;

const formatAmount = (n) =>
  n === 0
    ? "—"
    : new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(n);

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export function RecentActivity({ className }) {
  const [typeFilter, setTypeFilter] = useState("All");
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () => (typeFilter === "All" ? recentActivity : recentActivity.filter((r) => r.type === typeFilter)),
    [typeFilter]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  const handleFilterChange = (value) => {
    setTypeFilter(value);
    setPage(1);
  };

  return (
    <Card className={`w-full h-full flex flex-col ${className ?? ""}`}>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="space-y-1">
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest actions across all accounts</CardDescription>
        </div>
        <Select value={typeFilter} onValueChange={handleFilterChange}>
          <SelectTrigger className="w-40">
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
      </CardHeader>

      <CardContent className="flex-1 min-h-0 overflow-auto">
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
                  No activity found.
                </TableCell>
              </TableRow>
            ) : (
              pageItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.user}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${roleStyles[item.role]}`}>
                      {item.role}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${actionStyles[item.action]}`}>
                      {item.action}
                    </span>
                  </TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell className="text-muted-foreground">{item.ref}</TableCell>
                  <TableCell className="text-right font-medium">{formatAmount(item.amount)}</TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(item.date)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t py-3">
        <p className="text-xs text-muted-foreground">
          Showing {filtered.length === 0 ? 0 : pageStart + 1}–{Math.min(pageStart + PAGE_SIZE, filtered.length)} of {filtered.length}
        </p>
        <div className="flex items-center gap-2">
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
