import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
  BadgeCheck,
  Check,
  ExternalLink,
  FileCheck2,
  PackageCheck,
  Receipt,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiFetch } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";
import { useNotifications } from "@/hooks/useNotifications";
import { can } from "@/utils/rolePermissions";
import {
  formatDate,
  formatPHP,
  statusConfig as rfStatusConfig,
} from "@/components/request-form-components/mockData";
import { statusStyles as tithesStatusStyles } from "@/components/tithes-components/tithesUtils";
import { pathForRef } from "./notificationsUtils";

const REF_LIST_PATH = {
  RequestForm: "/request-form",
  Tithes: "/tithes",
  Voucher: "/vouchers",
};

const REF_LABEL = {
  RequestForm: "Request Form",
  Tithes: "Tithes Entry",
  Voucher: "Voucher",
};

const personName = (val) =>
  val && typeof val === "object" ? val.name : typeof val === "string" ? val : null;

// Resource hooks each subscribe to `notification:new` and refetch on a
// matching refModel. Dispatching the event after our own action keeps
// the list pages fresh without the dialog needing direct refs to those hooks.
const broadcastResourceChange = (refModel) => {
  if (!refModel) return;
  window.dispatchEvent(
    new CustomEvent("notification:new", { detail: { refModel } }),
  );
};

export function NotificationActionDialog({ notif, open, onOpenChange }) {
  const { user } = useAuth();
  const { refetch: refetchNotifs } = useNotifications();
  const navigate = useNavigate();

  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [rejectMode, setRejectMode] = useState(false);
  const [rejectNote, setRejectNote] = useState("");

  useEffect(() => {
    if (!open || !notif) return;

    let cancelled = false;
    setLoading(true);
    setError("");
    setRecord(null);
    setRejectMode(false);
    setRejectNote("");

    const path = REF_LIST_PATH[notif.refModel];
    if (!path) {
      setError("This notification has no actionable record.");
      setLoading(false);
      return;
    }

    apiFetch(path)
      .then((res) => {
        if (cancelled) return;
        const list = Array.isArray(res?.data) ? res.data : [];
        const found = list.find((r) => r._id === notif.refId);
        if (!found) {
          setError("Record not found — it may have been deleted.");
        } else {
          setRecord(found);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message || "Failed to load record");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, notif?._id, notif?.refModel, notif?.refId]);

  const handleOpenChange = (next) => {
    if (busy) return;
    onOpenChange?.(next);
  };

  const performAction = async (path, body) => {
    setBusy(true);
    setError("");
    try {
      await apiFetch(path, {
        method: "PATCH",
        body: body ? JSON.stringify(body) : undefined,
      });
      broadcastResourceChange(notif?.refModel);
      await refetchNotifs?.();
      onOpenChange?.(false);
    } catch (err) {
      setError(err?.message || "Action failed");
    } finally {
      setBusy(false);
    }
  };

  const goToFullPage = () => {
    onOpenChange?.(false);
    if (notif?.refModel && notif?.refId) {
      navigate(pathForRef(notif.refModel, notif.refId));
    }
  };

  const headerBadge = useMemo(() => {
    if (!record || !notif) return null;
    if (notif.refModel === "RequestForm") {
      const cfg = rfStatusConfig[record.status] ?? rfStatusConfig.draft;
      return { label: cfg.label, className: cfg.color };
    }
    if (notif.refModel === "Tithes") {
      return {
        label: record.status,
        className: tithesStatusStyles[record.status] ?? "",
      };
    }
    return null;
  }, [record, notif]);

  const renderRfDetails = () => (
    <div className="grid grid-cols-2 gap-3 text-sm">
      <div>
        <div className="text-xs text-muted-foreground">RF No</div>
        <div className="font-medium">{record.rfNo}</div>
      </div>
      <div>
        <div className="text-xs text-muted-foreground">Amount</div>
        <div className="font-medium">{formatPHP(record.estimatedAmount)}</div>
      </div>
      <div>
        <div className="text-xs text-muted-foreground">Requester</div>
        <div className="font-medium">{personName(record.requestedBy) || "—"}</div>
      </div>
      <div>
        <div className="text-xs text-muted-foreground">Date</div>
        <div className="font-medium">{formatDate(record.entryDate)}</div>
      </div>
      <div className="col-span-2">
        <div className="text-xs text-muted-foreground">Category</div>
        <div className="font-medium">
          {personName(record.category) || "—"}
        </div>
      </div>
      {record.remarks && (
        <div className="col-span-2">
          <div className="text-xs text-muted-foreground">Remarks</div>
          <div className="text-sm">{record.remarks}</div>
        </div>
      )}
    </div>
  );

  const renderTithesDetails = () => (
    <div className="grid grid-cols-2 gap-3 text-sm">
      <div>
        <div className="text-xs text-muted-foreground">Service</div>
        <div className="font-medium">{record.serviceType ?? "—"}</div>
      </div>
      <div>
        <div className="text-xs text-muted-foreground">Total</div>
        <div className="font-medium">{formatPHP(record.total)}</div>
      </div>
      <div>
        <div className="text-xs text-muted-foreground">Submitted by</div>
        <div className="font-medium">
          {personName(record.submittedBy) || "—"}
        </div>
      </div>
      <div>
        <div className="text-xs text-muted-foreground">Entry Date</div>
        <div className="font-medium">{formatDate(record.entryDate)}</div>
      </div>
      {record.remarks && (
        <div className="col-span-2">
          <div className="text-xs text-muted-foreground">Remarks</div>
          <div className="text-sm">{record.remarks}</div>
        </div>
      )}
    </div>
  );

  const renderVoucherDetails = () => (
    <div className="grid grid-cols-2 gap-3 text-sm">
      <div>
        <div className="text-xs text-muted-foreground">PCF No</div>
        <div className="font-medium">{record.pcfNo}</div>
      </div>
      <div>
        <div className="text-xs text-muted-foreground">Amount</div>
        <div className="font-medium">{formatPHP(record.amount)}</div>
      </div>
      <div>
        <div className="text-xs text-muted-foreground">Linked RF</div>
        <div className="font-medium">{record.rfId?.rfNo ?? "—"}</div>
      </div>
      <div>
        <div className="text-xs text-muted-foreground">Created by</div>
        <div className="font-medium">
          {personName(record.createdBy) || "—"}
        </div>
      </div>
    </div>
  );

  const renderDetails = () => {
    if (!record || !notif) return null;
    if (notif.refModel === "RequestForm") return renderRfDetails();
    if (notif.refModel === "Tithes") return renderTithesDetails();
    if (notif.refModel === "Voucher") return renderVoucherDetails();
    return null;
  };

  const renderActionButtons = () => {
    if (!record || !notif) return null;
    const role = user?.role;
    const userId = user?.id;

    if (notif.refModel === "RequestForm") {
      const status = record.status;
      const ownerId =
        typeof record.requestedBy === "string" ? null : record.requestedBy?._id;
      const isOwner = ownerId && userId && ownerId === userId;

      if (status === "submitted" && can.validateRf(role)) {
        return (
          <>
            {can.rejectRf(role) && (
              <Button
                variant="destructive"
                disabled={busy}
                onClick={() => setRejectMode(true)}
              >
                <X className="h-4 w-4" /> Reject
              </Button>
            )}
            <Button
              disabled={busy}
              onClick={() =>
                performAction(`/request-form/${record._id}/validate`)
              }
            >
              <FileCheck2 className="h-4 w-4" /> Validate
            </Button>
          </>
        );
      }
      if (status === "for_approval" && can.approveRf(role)) {
        return (
          <>
            {can.rejectRf(role) && (
              <Button
                variant="destructive"
                disabled={busy}
                onClick={() => setRejectMode(true)}
              >
                <X className="h-4 w-4" /> Reject
              </Button>
            )}
            <Button
              disabled={busy}
              onClick={() =>
                performAction(`/request-form/${record._id}/approve`)
              }
            >
              <Check className="h-4 w-4" /> Approve
            </Button>
          </>
        );
      }
      if (status === "approved" && can.createVoucherFromRf(role)) {
        return (
          <Button onClick={goToFullPage}>
            <Receipt className="h-4 w-4" /> Create Voucher
          </Button>
        );
      }
      if (status === "voucher_created" && can.disburseRf(role)) {
        return (
          <Button
            disabled={busy}
            onClick={() =>
              performAction(`/request-form/${record._id}/disburse`)
            }
          >
            <BadgeCheck className="h-4 w-4" /> Mark as Disbursed
          </Button>
        );
      }
      if (status === "disbursed" && can.markRfReceived(role) && isOwner) {
        return (
          <Button
            disabled={busy}
            onClick={() =>
              performAction(`/request-form/${record._id}/received`)
            }
          >
            <PackageCheck className="h-4 w-4" /> Mark as Received
          </Button>
        );
      }
    } else if (notif.refModel === "Tithes" && record.status === "pending") {
      const submitterId =
        typeof record.submittedBy === "string"
          ? null
          : record.submittedBy?._id;
      const isOwn = submitterId && userId && submitterId === userId;
      if (!isOwn) {
        return (
          <>
            <Button
              variant="destructive"
              disabled={busy}
              onClick={() => setRejectMode(true)}
            >
              <X className="h-4 w-4" /> Reject
            </Button>
            <Button
              disabled={busy}
              onClick={() => performAction(`/tithes/${record._id}/approve`)}
            >
              <Check className="h-4 w-4" /> Approve
            </Button>
          </>
        );
      }
    }

    return (
      <Button variant="outline" onClick={goToFullPage}>
        <ExternalLink className="h-4 w-4" /> Open full page
      </Button>
    );
  };

  const handleRejectConfirm = async () => {
    const note = rejectNote.trim();
    if (!note) return;
    const path =
      notif?.refModel === "RequestForm"
        ? `/request-form/${record._id}/reject`
        : `/tithes/${record._id}/reject`;
    await performAction(path, { rejectionNote: note });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2 flex-wrap">
            <DialogTitle>
              {notif ? REF_LABEL[notif.refModel] || "Notification" : "Notification"}
            </DialogTitle>
            {headerBadge && (
              <Badge variant="secondary" className={headerBadge.className}>
                {headerBadge.label}
              </Badge>
            )}
          </div>
          {notif?.message && (
            <DialogDescription>{notif.message}</DialogDescription>
          )}
        </DialogHeader>

        <div className="space-y-4">
          {loading && (
            <p className="text-sm text-muted-foreground">Loading record…</p>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}

          {!loading && record && renderDetails()}

          {rejectMode && record && (
            <div className="space-y-2 border-t pt-3">
              <Label htmlFor="rejectNote">Rejection Note</Label>
              <Textarea
                id="rejectNote"
                placeholder="Reason for rejecting…"
                value={rejectNote}
                onChange={(e) => setRejectNote(e.target.value)}
                rows={3}
              />
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          {rejectMode ? (
            <>
              <Button
                type="button"
                variant="outline"
                disabled={busy}
                onClick={() => {
                  setRejectMode(false);
                  setRejectNote("");
                  setError("");
                }}
              >
                Back
              </Button>
              <Button
                type="button"
                variant="destructive"
                disabled={busy || !rejectNote.trim()}
                onClick={handleRejectConfirm}
              >
                {busy ? "Rejecting…" : "Confirm Rejection"}
              </Button>
            </>
          ) : (
            <>
              <Button
                type="button"
                variant="ghost"
                disabled={busy}
                onClick={goToFullPage}
              >
                <ExternalLink className="h-4 w-4" /> Open page
              </Button>
              {!loading && record && renderActionButtons()}
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
