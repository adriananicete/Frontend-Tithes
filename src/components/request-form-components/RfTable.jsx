import { useMemo, useState } from "react";
import {
  Check,
  Eye,
  FileCheck2,
  MoreHorizontal,
  PackageCheck,
  Pencil,
  Receipt,
  Send,
  Trash2,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
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
  formatDate,
  formatPHP,
  mockCategories,
  mockRfs,
  statusConfig,
} from "./mockData";
import { RejectDialog } from "./RejectDialog";
import { useAuth } from "@/hooks/useAuth";
import { can } from "@/utils/rolePermissions";

const PAGE_SIZE = 10;

const statusOptions = [
  "All",
  "draft",
  "submitted",
  "for_approval",
  "approved",
  "voucher_created",
  "disbursed",
  "rejected",
];

function ActionMenu({ rf, onView, onReject, role, currentUserName }) {
  const status = rf.status;
  const isOwner = rf.requestedBy === currentUserName;
  const items = [];
  items.push({ key: "view", label: "View details", icon: Eye, action: onView });

  if (status === "draft") {
    if (isOwner) {
      items.push({ key: "edit", label: "Edit", icon: Pencil });
      items.push({ key: "submit", label: "Submit", icon: Send });
      items.push({ key: "delete", label: "Delete", icon: Trash2, destructive: true });
    }
  } else if (status === "submitted") {
    if (can.validateRf(role)) {
      items.push({ key: "validate", label: "Validate", icon: FileCheck2 });
    }
    if (can.rejectRf(role)) {
      items.push({ key: "reject", label: "Reject", icon: X, destructive: true, action: onReject });
    }
  } else if (status === "for_approval") {
    if (can.approveRf(role)) {
      items.push({ key: "approve", label: "Approve", icon: Check });
    }
    if (can.rejectRf(role)) {
      items.push({ key: "reject", label: "Reject", icon: X, destructive: true, action: onReject });
    }
  } else if (status === "approved") {
    if (can.createVoucherFromRf(role)) {
      items.push({ key: "voucher", label: "Create Voucher", icon: Receipt });
    }
  } else if (status === "voucher_created") {
    if (can.markRfReceived(role) && isOwner) {
      items.push({ key: "received", label: "Mark Received", icon: PackageCheck });
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {items.map((it, idx) => (
          <div key={it.key}>
            {idx === 1 && <DropdownMenuSeparator />}
            <DropdownMenuItem
              onClick={it.action}
              className={it.destructive ? "text-red-600" : ""}
            >
              <it.icon className="h-4 w-4" /> {it.label}
            </DropdownMenuItem>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function RfTable({ className, statusFilter, onClearStatusFilter, onViewRf }) {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [rejectingRf, setRejectingRf] = useState(null);

  const effectiveStatus = statusFilter || status;

  const filtered = useMemo(() => {
    return mockRfs.filter((rf) => {
      if (effectiveStatus !== "All" && rf.status !== effectiveStatus) return false;
      if (category !== "All" && rf.category !== category) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !rf.rfNo.toLowerCase().includes(q) &&
          !rf.requestedBy.toLowerCase().includes(q) &&
          !rf.remarks.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [search, effectiveStatus, category]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  return (
    <>
      <Card className={`w-full h-full flex flex-col ${className ?? ""}`}>
        <CardHeader className="gap-3">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="space-y-1">
              <CardTitle>Request Forms</CardTitle>
              <CardDescription>
                {statusFilter
                  ? `Filtered by ${statusConfig[statusFilter]?.label ?? statusFilter}`
                  : "All requests with filters and actions"}
              </CardDescription>
            </div>
            {statusFilter && (
              <Button variant="outline" size="sm" onClick={onClearStatusFilter}>
                Clear stage filter
              </Button>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Input
              placeholder="Search RF no, requester, remarks..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-64"
            />
            {!statusFilter && (
              <Select
                value={status}
                onValueChange={(v) => {
                  setStatus(v);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s === "All" ? "All Status" : statusConfig[s]?.label ?? s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Select
              value={category}
              onValueChange={(v) => {
                setCategory(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                {mockCategories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="flex-1 min-h-0 overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead>RF No</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Requester</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-6">
                    No request forms found.
                  </TableCell>
                </TableRow>
              ) : (
                pageItems.map((rf) => {
                  const cfg = statusConfig[rf.status];
                  return (
                    <TableRow key={rf.id}>
                      <TableCell className="font-medium">{rf.rfNo}</TableCell>
                      <TableCell className="text-muted-foreground">{formatDate(rf.entryDate)}</TableCell>
                      <TableCell>{rf.requestedBy}</TableCell>
                      <TableCell>{rf.category}</TableCell>
                      <TableCell className="text-right font-medium">{formatPHP(rf.estimatedAmount)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={cfg.color}>
                          {cfg.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <ActionMenu
                          rf={rf}
                          role={user?.role}
                          currentUserName={user?.name}
                          onView={() => onViewRf?.(rf)}
                          onReject={() => setRejectingRf(rf)}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>

        <CardFooter className="flex items-center justify-between border-t py-3">
          <p className="text-xs text-muted-foreground">
            Showing {filtered.length === 0 ? 0 : pageStart + 1}–
            {Math.min(pageStart + PAGE_SIZE, filtered.length)} of {filtered.length}
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

      <RejectDialog
        rf={rejectingRf}
        open={!!rejectingRf}
        onOpenChange={(v) => !v && setRejectingRf(null)}
        onConfirm={(note) => {
          console.log("Reject (mock):", rejectingRf?.rfNo, note);
        }}
      />
    </>
  );
}
