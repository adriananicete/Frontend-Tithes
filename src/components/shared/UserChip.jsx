import { UserAvatar } from "./UserAvatar";

// Renders a person as a small avatar + name. Tolerant of every shape the API
// sends a user ref in: a populated object ({ name, avatarUrl }), a bare name
// string, or null/undefined (shows `fallback`). Use anywhere a name appears in
// a table cell or detail modal.
export function UserChip({
  user,
  size = "xs",
  fallback = "—",
  className = "",
  nameClassName = "",
}) {
  const isObj = user && typeof user === "object";
  const name = isObj ? user.name : typeof user === "string" ? user : null;

  if (!name) return <span className={nameClassName}>{fallback}</span>;

  return (
    <span className={`inline-flex items-center gap-2 min-w-0 ${className}`}>
      <UserAvatar name={name} src={isObj ? user.avatarUrl : undefined} size={size} />
      <span className={`truncate ${nameClassName}`}>{name}</span>
    </span>
  );
}

export default UserChip;
