// Shared avatar helpers used by <UserAvatar /> and anywhere an identity is shown.

export const getInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "?";

// Deterministic color so a given person always gets the same initials swatch,
// even before they upload a photo (a small touch that makes lists scannable).
const AVATAR_COLORS = [
  "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300",
  "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300",
  "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
  "bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-300",
  "bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300",
  "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300",
  "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300",
  "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-500/20 dark:text-fuchsia-300",
];

export const colorFromName = (name = "") => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) | 0;
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

// Client-side guard mirroring the backend uploadAvatar limits.
export const AVATAR_MAX_BYTES = 5 * 1024 * 1024;
export const AVATAR_ACCEPT = "image/jpeg,image/jpg,image/png,image/webp";

export const validateAvatarFile = (file) => {
  if (!file) return "No file selected";
  if (!file.type.startsWith("image/")) return "Please choose an image file";
  if (file.size > AVATAR_MAX_BYTES) return "Image must be 5MB or smaller";
  return "";
};
