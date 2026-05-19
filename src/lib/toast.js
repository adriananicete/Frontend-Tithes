import { sileo } from "sileo";

// Generic helpers — use directly when no workflow key fits. Sileo's toast
// functions take a single options object ({ title, description }); a
// missing description is simply omitted from the toast.
export const notifySuccess = (title, description) =>
  sileo.success({ title, description });

export const notifyError = (title, description) =>
  sileo.error({ title, description });

export const notifyInfo = (title, description) =>
  sileo.info({ title, description });

export const notifyWarning = (title, description) =>
  sileo.warning({ title, description });

// Workflow-aware: every successful mutation across the app maps to a key
// here. Centralising the wording so the same action reads identically
// whether the user fired it from a row dropdown, a details dialog footer,
// or a Dashboard quick-action.
const WORKFLOW_TOASTS = {
  // Tithes
  tithesSubmitted:   { type: "info",    title: "Tithes submitted",    description: "Pending review." },
  tithesApproved:    { type: "success", title: "Tithes approved" },
  tithesRejected:    { type: "error",   title: "Tithes rejected" },
  tithesUpdated:     { type: "info",    title: "Tithes updated" },

  // Request Forms
  rfDraftCreated:    { type: "info",    title: "Draft saved" },
  rfDraftUpdated:    { type: "info",    title: "Draft updated" },
  rfDraftDeleted:    { type: "info",    title: "Draft deleted" },
  rfSubmitted:       { type: "info",    title: "RF submitted for validation" },
  rfValidated:       { type: "success", title: "RF validated",        description: "Now awaiting pastor approval." },
  rfApproved:        { type: "success", title: "RF approved",         description: "Ready for voucher creation." },
  rfRejected:        { type: "error",   title: "RF rejected" },
  rfDisbursed:       { type: "success", title: "Marked as disbursed" },
  rfReceived:        { type: "success", title: "Receipt confirmed" },

  // Vouchers
  voucherCreated:    { type: "success", title: "Voucher created" },

  // Users
  userCreated:       { type: "success", title: "User created" },
  userUpdated:       { type: "info",    title: "User updated" },
  userActivated:     { type: "success", title: "User activated" },
  userDeactivated:   { type: "warning", title: "User deactivated" },
  userDeleted:       { type: "info",    title: "User deleted" },

  // Categories
  categoryCreated:   { type: "success", title: "Category created" },
  categoryUpdated:   { type: "info",    title: "Category updated" },
  categoryArchived:  { type: "warning", title: "Category archived" },
  categoryRestored:  { type: "success", title: "Category restored" },
  categoryDeleted:   { type: "info",    title: "Category deleted" },

  // Expenses
  expenseRecorded:   { type: "success", title: "Expense recorded" },

  // Auth
  passwordChanged:   { type: "success", title: "Password changed" },
};

const fnFor = (type) => {
  switch (type) {
    case "success": return notifySuccess;
    case "error":   return notifyError;
    case "warning": return notifyWarning;
    case "info":
    default:        return notifyInfo;
  }
};

// Single entry point for any workflow toast. Pass a description to override
// the default copy — useful when you want to include the affected record's
// number or amount (e.g. notifyAction("voucherCreated", "PCF-0042")).
export const notifyAction = (key, description) => {
  const cfg = WORKFLOW_TOASTS[key];
  if (!cfg) return notifyInfo(key, description);
  return fnFor(cfg.type)(cfg.title, description ?? cfg.description);
};
