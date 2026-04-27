import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import deleteSvg from "@/assets/Inbox-cleanup-rafiki.svg";
import approveSvg from "@/assets/undraw_approve_jz6b.svg";
import rejectSvg from "@/assets/Cancel-bro.svg";

const VARIANTS = {
  delete: {
    illustration: deleteSvg,
    accent: "text-[#ed5f75] border-[#ed5f75] hover:bg-[#ed5f75]/10",
  },
  approve: {
    illustration: approveSvg,
    accent: "text-emerald-600 border-emerald-600 hover:bg-emerald-50",
  },
  reject: {
    illustration: rejectSvg,
    accent: "text-[#ed5f75] border-[#ed5f75] hover:bg-[#ed5f75]/10",
  },
};

export function ConfirmActionDialog({
  open,
  onOpenChange,
  variant = "delete",
  title,
  description,
  confirmLabel,
  pendingLabel,
  onConfirm,
}) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const config = VARIANTS[variant] ?? VARIANTS.delete;

  useEffect(() => {
    if (!open) {
      setError("");
      setSubmitting(false);
    }
  }, [open]);

  const handleConfirm = async () => {
    if (!onConfirm) {
      onOpenChange?.(false);
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await onConfirm();
      onOpenChange?.(false);
    } catch (err) {
      setError(err?.message || "Action failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[320px] flex flex-col items-center gap-3 p-5 rounded-[8px]"
      >
        <div className="w-[60%]">
          <img className="w-full h-full" src={config.illustration} alt="" />
        </div>

        <div className="w-full text-center sm:text-left">
          <p className="font-bold text-[20px] leading-none">{title}</p>
          {description && (
            <p className="text-[12px] text-gray-500 mt-1">{description}</p>
          )}
        </div>

        {error && (
          <p className="w-full text-[12px] text-red-600">{error}</p>
        )}

        <div className="w-full flex justify-between items-center pt-1">
          <button
            type="button"
            onClick={handleConfirm}
            disabled={submitting}
            className={`cursor-pointer font-medium border rounded-[5px] py-1 px-5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${config.accent}`}
          >
            {submitting ? pendingLabel || "Working…" : confirmLabel}
          </button>
          <button
            type="button"
            onClick={() => onOpenChange?.(false)}
            disabled={submitting}
            className="cursor-pointer text-white font-medium border border-black bg-black rounded-[5px] py-1 px-8 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-900 transition-colors"
          >
            Cancel
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
