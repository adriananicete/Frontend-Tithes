import { useMemo, useState } from "react";
import { Eye, MoreHorizontal, Pencil, Trash2, UserCheck, UserX } from "lucide-react";
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
  getInitials,
  ROLES,
  roleConfig,
  statusConfig,
} from "./mockData";

const PAGE_SIZE = 10;

function RowActions({ u, onView, onEdit, onToggleActive, onDelete }) {
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
        <DropdownMenuItem onClick={onEdit}>
          <Pencil className="h-4 w-4" /> Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onToggleActive}>
          {u.isActive ? (
            <>
              <UserX className="h-4 w-4" /> Deactivate
            </>
          ) : (
            <>
              <UserCheck className="h-4 w-4" /> Activate
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onDelete}
          className="text-red-600 focus:text-red-700"
        >
          <Trash2 className="h-4 w-4" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function UsersTable({
  users = [],
  loading = false,
  error = "",
  className,
  onViewUser,
  onEditUser,
  onToggleActive,
  onDeleteUser,
}) {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("All");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      if (role !== "All" && u.role !== role) return false;
      if (status === "active" && !u.isActive) return false;
      if (status === "inactive" && u.isActive) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !u.name.toLowerCase().includes(q) &&
          !u.email.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [users, search, role, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  return (
    <Card className={`w-full h-full flex flex-col ${className ?? ""}`}>
      <CardHeader className="gap-3">
        <div className="space-y-1">
          <CardTitle>Users</CardTitle>
          <CardDescription>Manage accounts, roles, and activation status</CardDescription>
        </div>
        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2">
          <Input
            placeholder="Search name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-64"
          />
          <Select
            value={role}
            onValueChange={(v) => {
              setRole(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Roles</SelectItem>
              {ROLES.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
              <SelectItem value="All">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="flex-1 min-h-0 overflow-auto">
        <div className="hidden md:block">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-6">
                    Loading users…
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-red-600 py-6">
                    {error}
                  </TableCell>
                </TableRow>
              ) : pageItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-6">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                pageItems.map((u) => {
                  const rcfg = roleConfig[u.role];
                  const scfg = u.isActive ? statusConfig.active : statusConfig.inactive;
                  return (
                    <TableRow key={u._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground">
                            {getInitials(u.name)}
                          </div>
                          <div className="font-medium">{u.name}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{u.email}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={rcfg.color}>
                          {rcfg.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={scfg.color}>
                          {scfg.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{formatDate(u.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <RowActions
                          u={u}
                          onView={() => onViewUser?.(u)}
                          onEdit={() => onEditUser?.(u)}
                          onToggleActive={() => onToggleActive?.(u)}
                          onDelete={() => onDeleteUser?.(u)}
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
          {loading ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              Loading users…
            </div>
          ) : error ? (
            <div className="py-10 text-center text-sm text-red-600">
              {error}
            </div>
          ) : pageItems.length === 0 ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              No users found.
            </div>
          ) : (
            pageItems.map((u) => {
              const rcfg = roleConfig[u.role];
              const scfg = u.isActive ? statusConfig.active : statusConfig.inactive;
              return (
                <div key={u._id} className="px-4 py-3 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground shrink-0">
                        {getInitials(u.name)}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium truncate">{u.name}</div>
                        <div className="text-xs text-muted-foreground truncate">{u.email}</div>
                      </div>
                    </div>
                    <RowActions
                      u={u}
                      onView={() => onViewUser?.(u)}
                      onEdit={() => onEditUser?.(u)}
                      onToggleActive={() => onToggleActive?.(u)}
                      onDelete={() => onDeleteUser?.(u)}
                    />
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Badge variant="secondary" className={rcfg.color}>
                        {rcfg.label}
                      </Badge>
                      <Badge variant="secondary" className={scfg.color}>
                        {scfg.label}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {formatDate(u.createdAt)}
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
  );
}
