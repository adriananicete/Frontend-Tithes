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
import {
  formatDate,
  formatPHP,
  mockCategories,
  mockVouchers,
  voucherStatusConfig,
} from "./mockData";

const PAGE_SIZE = 10;
const statusOptions = ["All", "voucher_created", "disbursed"];

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

export function VoucherTable({ className, onViewVoucher }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return mockVouchers.filter((v) => {
      if (status !== "All" && v.linkedRfStatus !== status) return false;
      if (category !== "All" && v.category !== category) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !v.pcfNo.toLowerCase().includes(q) &&
          !v.linkedRf.rfNo.toLowerCase().includes(q) &&
          !v.linkedRf.requestedBy.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [search, status, category]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  return (
    <Card className={`w-full h-full flex flex-col ${className ?? ""}`}>
      <CardHeader className="gap-3">
        <div className="space-y-1">
          <CardTitle>Vouchers (PCF)</CardTitle>
          <CardDescription>All issued vouchers with linked request forms</CardDescription>
        </div>
        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2">
          <Input
            placeholder="Search PCF no, RF no, requester..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-64"
          />
          <Select
            value={status}
            onValueChange={(v) => {
              setStatus(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((s) => (
                <SelectItem key={s} value={s}>
                  {s === "All" ? "All Status" : voucherStatusConfig[s]?.label ?? s}
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
              {mockCategories.map((c) => (
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
                <TableHead>PCF No</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Linked RF</TableHead>
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
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-6">
                    No vouchers found.
                  </TableCell>
                </TableRow>
              ) : (
                pageItems.map((v) => {
                  const cfg = voucherStatusConfig[v.linkedRfStatus];
                  return (
                    <TableRow key={v.id}>
                      <TableCell className="font-medium">{v.pcfNo}</TableCell>
                      <TableCell className="text-muted-foreground">{formatDate(v.date)}</TableCell>
                      <TableCell className="font-medium">{v.linkedRf.rfNo}</TableCell>
                      <TableCell>{v.linkedRf.requestedBy}</TableCell>
                      <TableCell>{v.category}</TableCell>
                      <TableCell className="text-right font-medium">{formatPHP(v.amount)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={cfg.color}>
                          {cfg.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <RowActions onView={() => onViewVoucher?.(v)} />
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
              No vouchers found.
            </div>
          ) : (
            pageItems.map((v) => {
              const cfg = voucherStatusConfig[v.linkedRfStatus];
              return (
                <div key={v.id} className="px-4 py-3 space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-medium truncate">{v.pcfNo}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {v.linkedRf.rfNo} • {v.linkedRf.requestedBy}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Badge variant="secondary" className={cfg.color}>
                        {cfg.label}
                      </Badge>
                      <RowActions onView={() => onViewVoucher?.(v)} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground truncate">
                      {formatDate(v.date)} • {v.category}
                    </span>
                    <span className="font-medium tabular-nums shrink-0">{formatPHP(v.amount)}</span>
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
