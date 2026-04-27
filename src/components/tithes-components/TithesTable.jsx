import { useMemo, useState } from "react";
import { MoreHorizontal, Eye, Check, X } from "lucide-react";
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
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
import { ConfirmActionDialog } from "@/components/shared/ConfirmActionDialog";
import { useAuth } from "@/hooks/useAuth";
import { can } from "@/utils/rolePermissions";
import { formatDate, formatPHP, SERVICE_TYPES, statusStyles } from "./tithesUtils";

const PAGE_SIZE = 10;
const serviceOptions = ["All", ...SERVICE_TYPES];
const statusOptions = ["All", "pending", "approved", "rejected"];

function RowActions({ row, role, userName, onView, onApprove, onReject }) {
  const submitterName = row.submittedBy?.name;
  const canApprove = can.approveTithes(role, submitterName, userName);
  const canReject = can.rejectTithes(role);
  const showSeparator = canApprove || canReject;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onView}>
          <Eye className="h-4 w-4" /> View details
        </DropdownMenuItem>
        {showSeparator && <DropdownMenuSeparator />}
        {canApprove && (
          <DropdownMenuItem
            onClick={onApprove}
            disabled={row.status !== "pending"}
          >
            <Check className="h-4 w-4 text-green-600" /> Approve
          </DropdownMenuItem>
        )}
        {canReject && (
          <DropdownMenuItem
            onClick={onReject}
            disabled={row.status !== "pending"}
          >
            <X className="h-4 w-4 text-red-600" /> Reject
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function RejectDialog({ entry, open, onOpenChange, onConfirm }) {
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const reset = () => {
    setNote("");
    setSubmitting(false);
    setError("");
  };

  const handleConfirm = async () => {
    if (!note.trim()) {
      setError("A reason is required.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await onConfirm?.(note.trim());
      onOpenChange?.(false);
      reset();
    } catch (err) {
      setError(err.message || "Failed to reject entry");
      setSubmitting(false);
    }
  };

  if (!entry) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange?.(v);
        if (!v) reset();
      }}
    >
      <DialogContent className="max-w-md overflow-x-hidden">
        <DialogHeader>
          <DialogTitle>Reject tithes entry?</DialogTitle>
          <DialogDescription>
            Provide a reason. The submitter will be notified.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Textarea
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g., Mismatched denominations, incorrect total..."
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={submitting}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={submitting}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {submitting ? "Rejecting…" : "Reject"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function TithesTable({
  tithes = [],
  loading = false,
  error = "",
  onApprove,
  onReject,
  className,
}) {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [service, setService] = useState("All");
  const [page, setPage] = useState(1);
  const [viewing, setViewing] = useState(null);
  const [rejecting, setRejecting] = useState(null);
  const [approving, setApproving] = useState(null);

  const filtered = useMemo(() => {
    return tithes.filter((row) => {
      if (status !== "All" && row.status !== status) return false;
      if (service !== "All" && row.serviceType !== service) return false;
      if (search) {
        const q = search.toLowerCase();
        const submitter = row.submittedBy?.name?.toLowerCase() || "";
        const remarks = row.remarks?.toLowerCase() || "";
        if (!submitter.includes(q) && !remarks.includes(q)) return false;
      }
      return true;
    });
  }, [tithes, search, status, service]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  const resetPage = () => setPage(1);

  const renderEmptyMessage = () => {
    if (loading) return "Loading tithes…";
    if (error) return error;
    return "No tithes entries found.";
  };

  const emptyClass = error ? "text-red-600" : "text-muted-foreground";

  return (
    <>
      <Card className={`w-full h-full flex flex-col ${className ?? ""}`}>
        <CardHeader className="gap-3">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="space-y-1">
              <CardTitle>Tithes Entries</CardTitle>
              <CardDescription>All submissions with filters and actions</CardDescription>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2">
            <Input
              placeholder="Search submitter or remarks..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                resetPage();
              }}
              className="w-full sm:w-60"
            />
            <Select
              value={status}
              onValueChange={(v) => {
                setStatus(v);
                resetPage();
              }}
            >
              <SelectTrigger className="w-full sm:w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s === "All" ? "All Status" : s.charAt(0).toUpperCase() + s.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={service}
              onValueChange={(v) => {
                setService(v);
                resetPage();
              }}
            >
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="Service" />
              </SelectTrigger>
              <SelectContent>
                {serviceOptions.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s === "All" ? "All Services" : s}
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
                  <TableHead>Date</TableHead>
                  <TableHead>Submitter</TableHead>
                  <TableHead>Service Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className={`text-center py-6 ${emptyClass}`}>
                      {renderEmptyMessage()}
                    </TableCell>
                  </TableRow>
                ) : (
                  pageItems.map((row) => (
                    <TableRow key={row._id}>
                      <TableCell className="text-muted-foreground">{formatDate(row.entryDate)}</TableCell>
                      <TableCell className="font-medium">{row.submittedBy?.name || "—"}</TableCell>
                      <TableCell>{row.serviceType}</TableCell>
                      <TableCell className="text-right font-medium">{formatPHP(row.total)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={statusStyles[row.status]}>
                          {row.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <RowActions
                          row={row}
                          role={user?.role}
                          userName={user?.name}
                          onView={() => setViewing(row)}
                          onApprove={() => setApproving(row)}
                          onReject={() => setRejecting(row)}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="md:hidden -mx-4 divide-y border-t">
            {pageItems.length === 0 ? (
              <div className={`py-10 text-center text-sm ${emptyClass}`}>
                {renderEmptyMessage()}
              </div>
            ) : (
              pageItems.map((row) => (
                <div key={row._id} className="px-4 py-3 space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-medium truncate">{row.submittedBy?.name || "—"}</div>
                      <div className="text-xs text-muted-foreground truncate">{row.serviceType}</div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Badge variant="secondary" className={statusStyles[row.status]}>
                        {row.status}
                      </Badge>
                      <RowActions
                        row={row}
                        role={user?.role}
                        userName={user?.name}
                        onView={() => setViewing(row)}
                        onApprove={() => setApproving(row)}
                        onReject={() => setRejecting(row)}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{formatDate(row.entryDate)}</span>
                    <span className="font-medium tabular-nums">{formatPHP(row.total)}</span>
                  </div>
                </div>
              ))
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

      <Dialog open={!!viewing} onOpenChange={(open) => !open && setViewing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tithes Entry Details</DialogTitle>
            <DialogDescription>
              {viewing && `${viewing.serviceType} • ${formatDate(viewing.entryDate)}`}
            </DialogDescription>
          </DialogHeader>
          {viewing && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-muted-foreground">Submitter</div>
                  <div className="font-medium">{viewing.submittedBy?.name || "—"}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Status</div>
                  <Badge variant="secondary" className={statusStyles[viewing.status]}>
                    {viewing.status}
                  </Badge>
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-2">Denominations</div>
                <div className="rounded-md border divide-y">
                  {viewing.denominations.map((d, i) => (
                    <div key={i} className="flex justify-between px-3 py-2">
                      <span>₱{d.bill} × {d.qty}</span>
                      <span className="font-medium">{formatPHP(d.subtotal ?? d.bill * d.qty)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between px-3 py-2 bg-muted/50 font-semibold">
                    <span>Total</span>
                    <span>{formatPHP(viewing.total)}</span>
                  </div>
                </div>
              </div>
              {viewing.remarks && (
                <div>
                  <div className="text-xs text-muted-foreground">Remarks</div>
                  <div>{viewing.remarks}</div>
                </div>
              )}
              {viewing.status === "rejected" && viewing.rejectionNote && (
                <div>
                  <div className="text-xs text-muted-foreground">Rejection Note</div>
                  <div className="rounded-md border border-red-200 bg-red-50 p-2 text-red-800">
                    {viewing.rejectionNote}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <RejectDialog
        entry={rejecting}
        open={!!rejecting}
        onOpenChange={(v) => !v && setRejecting(null)}
        onConfirm={(note) => onReject?.(rejecting._id, note)}
      />

      {approving && (
        <ConfirmActionDialog
          open={!!approving}
          onOpenChange={(v) => !v && setApproving(null)}
          variant="approve"
          title="Approve this tithes entry?"
          description={`${formatPHP(approving.total)} from ${
            approving.submittedBy?.name ?? "—"
          } on ${formatDate(approving.entryDate)} will be marked approved.`}
          confirmLabel="Yes, approve"
          pendingLabel="Approving…"
          onConfirm={() => onApprove?.(approving._id)}
        />
      )}
    </>
  );
}
