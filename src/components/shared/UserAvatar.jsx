import { getInitials, colorFromName } from "@/lib/avatar";

// Single reusable avatar: shows the uploaded photo when `src` is set, otherwise
// a deterministic colored initials circle. Used in the header, sidebar/drawer,
// Users table, RF comments, and the Profile page.
const SIZES = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-24 w-24 text-2xl",
};

export function UserAvatar({ name = "", src, size = "md", className = "" }) {
  const dim = SIZES[size] ?? SIZES.md;
  const base = `${dim} ${className} rounded-full shrink-0 overflow-hidden flex items-center justify-center font-semibold`;

  if (src) {
    return (
      <div className={base}>
        <img src={src} alt={name} className="w-full h-full object-cover" />
      </div>
    );
  }
  return <div className={`${base} ${colorFromName(name)}`}>{getInitials(name)}</div>;
}

export default UserAvatar;
