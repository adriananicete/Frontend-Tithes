import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
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
import { formatDate, formatPHP, statusConfig } from "./mockData";
import { RejectDialog } from "./RejectDialog";
import { CreateRfDialog } from "./CreateRfDialog";
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

const requesterName = (rf) =>
  typeof rf.requestedBy === "string"
    ? rf.requestedBy
    : rf.requestedBy?.name || "—";

const categoryName = (rf) =>
  typeof rf.category === "string" ? rf.category : rf.category?.name || "—";

function ActionMenu({
  rf,
  role,
  currentUserId,
  onView,
  onEdit,
  onSubmit,
  onDelete,
  onValidate,
  onApprove,
  onReject,
  onCreateVoucher,
  onMarkReceived,
}) {
  const status = rf.status;
  const ownerId =
    typeof rf.requestedBy === "string" ? null : rf.requestedBy?._id;
  const isOwner = ownerId && currentUserId && ownerId === currentUserId;

  const items = [{ key: "view", label: "View details", icon: Eye, action: onView }];

  if (status === "draft") {
    if (isOwner) {
      items.push({ key: "edit", label: "Edit", icon: Pencil, action: onEdit });
      items.push({ key: "submit", label: "Submit", icon: Send, action: onSubmit });
      items.push({
        key: "delete",
        label: "Delete",
        icon: Trash2,
        destructive: true,
        action: onDelete,
      });
    }
  } else if (status === "submitted") {
    if (can.validateRf(role)) {
      items.push({ key: "validate", label: "Validate", icon: FileCheck2, action: onValidate });
    }
    if (can.rejectRf(role)) {
      items.push({
        key: "reject",
        label: "Reject",
        icon: X,
        destructive: true,
        action: onReject,
      });
    }
  } else if (status === "for_approval") {
    if (can.approveRf(role)) {
      items.push({ key: "approve", label: "Approve", icon: Check, action: onApprove });
    }
    if (can.rejectRf(role)) {
      items.push({
        key: "reject",
        label: "Reject",
        icon: X,
        destructive: true,
        action: onReject,
      });
    }
  } else if (status === "approved") {
    if (can.createVoucherFromRf(role)) {
      items.push({
        key: "voucher",
        label: "Create Voucher",
        icon: Receipt,
        action: onCreateVoucher,
      });
    }
  } else if (status === "voucher_created") {
    if (can.markRfReceived(role) && isOwner) {
      items.push({
        key: "received",
        label: "Mark Received",
        icon: PackageCheck,
        action: onMarkReceived,
      });
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

export function RfTable({
  className,
  rfs = [],
  loading = false,
  error = "",
  categories = [],
  statusFilter,
  onClearStatusFilter,
  onViewRf,
  onUpdateRf,
  onDeleteRf,
  onSubmitRf,
  onValidateRf,
  onApproveRf,
  onRejectRf,
  onMarkReceived,
}) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [rejectingRf, setRejectingRf] = useState(null);
  const [editingRf, setEditingRf] = useState(null);
  const [actionError, setActionError] = useState("");

  const effectiveStatus = statusFilter || status;

  const filtered = useMemo(() => {
    return rfs.filter((rf) => {
      if (effectiveStatus !== "All" && rf.status !== effectiveStatus) return false;
      if (category !== "All") {
        const catId = rf.category?._id || rf.category;
        if (catId !== category) return false;
      }
      if (search) {
        const q = search.toLowerCase();
        const haystack = [
          rf.rfNo,
          requesterName(rf),
          rf.remarks || "",
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [rfs, search, effectiveStatus, category]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  // Wraps a hook mutation so backend errors surface near the table instead of
  // crashing silently. Confirms destructive actions first.
  const runAction = async (fn, confirmMsg) => {
    if (confirmMsg && !window.confirm(confirmMsg)) return;
    setActionError("");
    try {
      await fn();
    } catch (err) {
      setActionError(err.message || "Action failed");
    }
  };

  const renderEmptyMessage = () => {
    if (loading) return "Loading request forms...";
    if (error) return error;
    return "No request forms found.";
  };

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
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2">
            <Input
              placeholder="Search RF no, requester, remarks..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full sm:w-64"
            />
            {!statusFilter && (
              <Select
                value={status}
                onValueChange={(v) => {
                  setStatus(v);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-full sm:w-40">
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
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="Category">
                  {(value) =>
                    value === "All"
                      ? "All Categories"
                      : categories.find((c) => c._id === value)?.name || "Category"
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c._id} value={c._id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {actionError && (
            <p className="text-sm text-red-600">{actionError}</p>
          )}
        </CardHeader>

        <CardContent className="flex-1 min-h-0 overflow-auto">
          <div className="hidden md:block">
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
                    <TableCell
                      colSpan={7}
                      className="text-center text-muted-foreground py-6"
                    >
                      {renderEmptyMessage()}
                    </TableCell>
                  </TableRow>
                ) : (
                  pageItems.map((rf) => {
                    const cfg = statusConfig[rf.status] ?? statusConfig.draft;
                    return (
                      <TableRow key={rf._id}>
                        <TableCell className="font-medium">{rf.rfNo}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(rf.entryDate)}
                        </TableCell>
                        <TableCell>{requesterName(rf)}</TableCell>
                        <TableCell>{categoryName(rf)}</TableCell>
                        <TableCell className="text-right font-medium">
                          {formatPHP(rf.estimatedAmount)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={cfg.color}>
                            {cfg.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <ActionMenu
                            rf={rf}
                            role={user?.role}
                            currentUserId={user?.id}
                            onView={() => onViewRf?.(rf)}
                            onEdit={() => setEditingRf(rf)}
                            onSubmit={() =>
                              runAction(
                                () => onSubmitRf?.(rf._id),
                                `Submit ${rf.rfNo} for validation?`,
                              )
                            }
                            onDelete={() =>
                              runAction(
                                () => onDeleteRf?.(rf._id),
                                `Delete ${rf.rfNo}? This cannot be undone.`,
                              )
                            }
                            onValidate={() =>
                              runAction(() => onValidateRf?.(rf._id))
                            }
                            onApprove={() =>
                              runAction(() => onApproveRf?.(rf._id))
                            }
                            onReject={() => setRejectingRf(rf)}
                            onCreateVoucher={() => navigate("/voucher")}
                            onMarkReceived={() =>
                              runAction(
                                () => onMarkReceived?.(rf._id),
                                `Confirm receipt of ${rf.rfNo}?`,
                              )
                            }
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          <div className="md:hidden -mx-4 divide-y border-t">
            {pageItems.length === 0 ? (
              <div className="py-10 text-center text-sm text-muted-foreground">
                {renderEmptyMessage()}
              </div>
            ) : (
              pageItems.map((rf) => {
                const cfg = statusConfig[rf.status] ?? statusConfig.draft;
                return (
                  <div key={rf._id} className="px-4 py-3 space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="font-medium truncate">{rf.rfNo}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {categoryName(rf)} • {requesterName(rf)}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Badge variant="secondary" className={cfg.color}>
                          {cfg.label}
                        </Badge>
                        <ActionMenu
                          rf={rf}
                          role={user?.role}
                          currentUserId={user?.id}
                          onView={() => onViewRf?.(rf)}
                          onEdit={() => setEditingRf(rf)}
                          onSubmit={() =>
                            runAction(
                              () => onSubmitRf?.(rf._id),
                              `Submit ${rf.rfNo} for validation?`,
                            )
                          }
                          onDelete={() =>
                            runAction(
                              () => onDeleteRf?.(rf._id),
                              `Delete ${rf.rfNo}?`,
                            )
                          }
                          onValidate={() =>
                            runAction(() => onValidateRf?.(rf._id))
                          }
                          onApprove={() =>
                            runAction(() => onApproveRf?.(rf._id))
                          }
                          onReject={() => setRejectingRf(rf)}
                          onCreateVoucher={() => navigate("/voucher")}
                          onMarkReceived={() =>
                            runAction(
                              () => onMarkReceived?.(rf._id),
                              `Confirm receipt of ${rf.rfNo}?`,
                            )
                          }
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {formatDate(rf.entryDate)}
                      </span>
                      <span className="font-medium tabular-nums">
                        {formatPHP(rf.estimatedAmount)}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
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

      <RejectDialog
        rf={rejectingRf}
        open={!!rejectingRf}
        onOpenChange={(v) => !v && setRejectingRf(null)}
        onConfirm={async (note) => {
          await onRejectRf?.(rejectingRf._id, note);
        }}
      />

      {editingRf && (
        <CreateRfDialog
          categories={categories}
          editingRf={editingRf}
          onUpdate={onUpdateRf}
          open={!!editingRf}
          onOpenChange={(v) => !v && setEditingRf(null)}
        />
      )}
    </>
  );
}
