import { useMemo, useState } from "react";
import { Eye, MoreHorizontal } from "lucide-react";
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
import { formatDate, formatPHP, sourceConfig } from "./mockData";

const PAGE_SIZE = 10;
const sourceOptions = ["All", "voucher", "manual"];

function RowActions({ onView }) {
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ExpenseTable({
  expenses = [],
  loading = false,
  error = "",
  className,
  onViewExpense,
}) {
  const [search, setSearch] = useState("");
  const [source, setSource] = useState("All");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);

  const categoryOptions = useMemo(() => {
    const set = new Set();
    expenses.forEach((e) => {
      const name = e.category?.name;
      if (name) set.add(name);
    });
    return Array.from(set).sort();
  }, [expenses]);

  const filtered = useMemo(() => {
    return expenses
      .filter((e) => {
        if (source !== "All" && e.source !== source) return false;
        const catName = e.category?.name ?? "";
        if (category !== "All" && catName !== category) return false;
        if (search) {
          const q = search.toLowerCase();
          const recordedBy = e.recordedBy?.name ?? "";
          const linkedRef = e.linkedId?.pcfNo ?? "";
          const remarks = e.remarks ?? "";
          if (
            !catName.toLowerCase().includes(q) &&
            !recordedBy.toLowerCase().includes(q) &&
            !linkedRef.toLowerCase().includes(q) &&
            !remarks.toLowerCase().includes(q)
          )
            return false;
        }
        return true;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [expenses, search, source, category]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  const emptyText = loading
    ? "Loading expenses…"
    : error
    ? error
    : "No expenses found.";

  return (
    <Card className={`w-full h-full flex flex-col ${className ?? ""}`}>
      <CardHeader className="gap-3">
        <div className="space-y-1">
          <CardTitle>Expenses</CardTitle>
          <CardDescription>All recorded expenses across vouchers and manual entries</CardDescription>
        </div>
        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2">
          <Input
            placeholder="Search category, ref, recorder, remarks..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-64"
          />
          <Select
            value={source}
            onValueChange={(v) => {
              setSource(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              {sourceOptions.map((s) => (
                <SelectItem key={s} value={s}>
                  {s === "All" ? "All Sources" : sourceConfig[s]?.label ?? s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={category}
            onValueChange={(v) => {
              setCategory(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              {categoryOptions.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
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
                <TableHead>Source</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Linked Ref</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Recorded By</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-6">
                    {emptyText}
                  </TableCell>
                </TableRow>
              ) : (
                pageItems.map((e) => {
                  const cfg = sourceConfig[e.source] ?? { label: e.source, color: "" };
                  return (
                    <TableRow key={e._id}>
                      <TableCell className="text-muted-foreground">{formatDate(e.date)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={cfg.color}>
                          {cfg.label}
                        </Badge>
                      </TableCell>
                      <TableCell>{e.category?.name ?? "—"}</TableCell>
                      <TableCell className="font-medium">{e.linkedId?.pcfNo ?? "—"}</TableCell>
                      <TableCell className="text-right font-medium tabular-nums">
                        {formatPHP(e.amount)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{e.recordedBy?.name ?? "—"}</TableCell>
                      <TableCell className="text-right">
                        <RowActions onView={() => onViewExpense?.(e)} />
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
              {emptyText}
            </div>
          ) : (
            pageItems.map((e) => {
              const cfg = sourceConfig[e.source] ?? { label: e.source, color: "" };
              return (
                <div key={e._id} className="px-4 py-3 space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-medium truncate">{e.category?.name ?? "—"}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {(e.linkedId?.pcfNo ?? "—") + " • " + (e.recordedBy?.name ?? "—")}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Badge variant="secondary" className={cfg.color}>
                        {cfg.label}
                      </Badge>
                      <RowActions onView={() => onViewExpense?.(e)} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{formatDate(e.date)}</span>
                    <span className="font-medium tabular-nums">{formatPHP(e.amount)}</span>
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
