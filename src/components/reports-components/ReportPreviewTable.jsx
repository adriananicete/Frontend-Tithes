import { useMemo, useState } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, formatPHP } from "./mockData";

const PAGE_SIZE = 10;

const tithesStatusColor = {
  approved: "bg-emerald-100 text-emerald-700",
  pending:  "bg-amber-100 text-amber-700",
  rejected: "bg-red-100 text-red-700",
};

const sourceColor = {
  voucher: "bg-blue-100 text-blue-700",
  manual:  "bg-purple-100 text-purple-700",
};

export function ReportPreviewTable({ className, tab, data }) {
  const [page, setPage] = useState(1);

  const sorted = useMemo(() => {
    const dateKey = tab === "tithes" ? "entryDate" : "date";
    return [...data].sort((a, b) => new Date(b[dateKey]) - new Date(a[dateKey]));
  }, [tab, data]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pageItems = sorted.slice(pageStart, pageStart + PAGE_SIZE);

  return (
    <Card className={`w-full h-full flex flex-col ${className ?? ""}`}>
      <CardHeader>
        <CardTitle>Preview</CardTitle>
        <CardDescription>
          {tab === "tithes"
            ? "Tithe entries included in the export"
            : "Expense entries included in the export"}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 min-h-0 overflow-auto">
        <div className="hidden md:block">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              {tab === "tithes" ? (
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Service Type</TableHead>
                  <TableHead>Submitted By</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              ) : (
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Linked Ref</TableHead>
                  <TableHead>Recorded By</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              )}
            </TableHeader>
            <TableBody>
              {pageItems.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={tab === "tithes" ? 5 : 6}
                    className="text-center text-muted-foreground py-6"
                  >
                    No entries in this date range.
                  </TableCell>
                </TableRow>
              ) : tab === "tithes" ? (
                pageItems.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="text-muted-foreground">
                      {formatDate(row.entryDate)}
                    </TableCell>
                    <TableCell>{row.serviceType}</TableCell>
                    <TableCell>{row.submittedBy}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={tithesStatusColor[row.status]}>
                        {row.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums">
                      {formatPHP(row.total)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                pageItems.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="text-muted-foreground">{formatDate(row.date)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={sourceColor[row.source]}>
                        {row.source === "voucher" ? "Voucher" : "Manual"}
                      </Badge>
                    </TableCell>
                    <TableCell>{row.category}</TableCell>
                    <TableCell className="font-medium">{row.linkedRef ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{row.recordedBy}</TableCell>
                    <TableCell className="text-right font-medium tabular-nums">
                      {formatPHP(row.amount)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="md:hidden -mx-4 divide-y border-t">
          {pageItems.length === 0 ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              No entries in this date range.
            </div>
          ) : tab === "tithes" ? (
            pageItems.map((row) => (
              <div key={row.id} className="px-4 py-3 space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-medium truncate">{row.serviceType}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {row.submittedBy}
                    </div>
                  </div>
                  <Badge variant="secondary" className={tithesStatusColor[row.status]}>
                    {row.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{formatDate(row.entryDate)}</span>
                  <span className="font-medium tabular-nums">{formatPHP(row.total)}</span>
                </div>
              </div>
            ))
          ) : (
            pageItems.map((row) => (
              <div key={row.id} className="px-4 py-3 space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-medium truncate">{row.category}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {row.linkedRef ?? "—"} • {row.recordedBy}
                    </div>
                  </div>
                  <Badge variant="secondary" className={sourceColor[row.source]}>
                    {row.source === "voucher" ? "Voucher" : "Manual"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{formatDate(row.date)}</span>
                  <span className="font-medium tabular-nums">{formatPHP(row.amount)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>

      <CardFooter className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2 border-t py-3">
        <p className="hidden sm:block text-xs text-muted-foreground">
          Showing {sorted.length === 0 ? 0 : pageStart + 1}–
          {Math.min(pageStart + PAGE_SIZE, sorted.length)} of {sorted.length}
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
