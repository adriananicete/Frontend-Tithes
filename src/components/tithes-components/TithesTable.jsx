import { useMemo, useState } from "react";
import { MoreHorizontal, Eye, Check, X, Pencil } from "lucide-react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

// ============================================================
// MOCK DATA — palitan ng GET /api/tithes
// ============================================================
const mockTithes = [
  { id: 1,  entryDate: "2026-04-13", serviceType: "Sunday Service",   submittedBy: "Kiya",    total: 2500, status: "pending",  remarks: "Morning service", denominations: [{ bill: 1000, qty: 2 }, { bill: 500, qty: 1 }] },
  { id: 2,  entryDate: "2026-04-13", serviceType: "Sunday Service",   submittedBy: "Lourdes", total: 3200, status: "approved", remarks: "", denominations: [{ bill: 1000, qty: 3 }, { bill: 200, qty: 1 }] },
  { id: 3,  entryDate: "2026-04-12", serviceType: "Prayer Meeting",   submittedBy: "Berna",   total: 800,  status: "approved", remarks: "Wednesday prayer", denominations: [{ bill: 500, qty: 1 }, { bill: 100, qty: 3 }] },
  { id: 4,  entryDate: "2026-04-11", serviceType: "Youth Service",    submittedBy: "Kiya",    total: 1500, status: "pending",  remarks: "", denominations: [{ bill: 1000, qty: 1 }, { bill: 500, qty: 1 }] },
  { id: 5,  entryDate: "2026-04-10", serviceType: "Special Offering", submittedBy: "Adrian",  total: 5000, status: "approved", remarks: "Missions support", denominations: [{ bill: 1000, qty: 5 }] },
  { id: 6,  entryDate: "2026-04-09", serviceType: "Sunday Service",   submittedBy: "Lourdes", total: 1200, status: "rejected", remarks: "", denominations: [{ bill: 500, qty: 2 }, { bill: 100, qty: 2 }] },
  { id: 7,  entryDate: "2026-04-08", serviceType: "Prayer Meeting",   submittedBy: "Berna",   total: 600,  status: "approved", remarks: "", denominations: [{ bill: 500, qty: 1 }, { bill: 50, qty: 2 }] },
  { id: 8,  entryDate: "2026-04-06", serviceType: "Sunday Service",   submittedBy: "Kiya",    total: 2000, status: "approved", remarks: "", denominations: [{ bill: 1000, qty: 2 }] },
  { id: 9,  entryDate: "2026-04-05", serviceType: "Youth Service",    submittedBy: "Lourdes", total: 900,  status: "approved", remarks: "", denominations: [{ bill: 500, qty: 1 }, { bill: 200, qty: 2 }] },
  { id: 10, entryDate: "2026-04-03", serviceType: "Sunday Service",   submittedBy: "Adrian",  total: 4500, status: "approved", remarks: "", denominations: [{ bill: 1000, qty: 4 }, { bill: 500, qty: 1 }] },
  { id: 11, entryDate: "2026-04-02", serviceType: "Special Offering", submittedBy: "Berna",   total: 3500, status: "pending",  remarks: "Building fund", denominations: [{ bill: 1000, qty: 3 }, { bill: 500, qty: 1 }] },
  { id: 12, entryDate: "2026-03-30", serviceType: "Sunday Service",   submittedBy: "Kiya",    total: 2200, status: "approved", remarks: "", denominations: [{ bill: 1000, qty: 2 }, { bill: 200, qty: 1 }] },
];

const statusStyles = {
  pending:  "bg-amber-100 text-amber-700 hover:bg-amber-100",
  approved: "bg-green-100 text-green-700 hover:bg-green-100",
  rejected: "bg-red-100 text-red-700 hover:bg-red-100",
};

const serviceOptions = ["All", "Sunday Service", "Prayer Meeting", "Youth Service", "Special Offering"];
const statusOptions = ["All", "pending", "approved", "rejected"];
const PAGE_SIZE = 10;

const formatPHP = (n) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(n);

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export function TithesTable({ className }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [service, setService] = useState("All");
  const [page, setPage] = useState(1);
  const [viewing, setViewing] = useState(null);

  const filtered = useMemo(() => {
    return mockTithes.filter((row) => {
      if (status !== "All" && row.status !== status) return false;
      if (service !== "All" && row.serviceType !== service) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !row.submittedBy.toLowerCase().includes(q) &&
          !row.remarks.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [search, status, service]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  const resetPage = () => setPage(1);

  return (
    <>
      <Card className={`w-full h-full flex flex-col ${className ?? ""}`}>
        <CardHeader className="gap-3">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="space-y-1">
              <CardTitle>Tithes Entries</CardTitle>
              <CardDescription>All submissions with filters and actions</CardDescription>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Input
              placeholder="Search submitter or remarks..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                resetPage();
              }}
              className="w-60"
            />
            <Select
              value={status}
              onValueChange={(v) => {
                setStatus(v);
                resetPage();
              }}
            >
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s === "All" ? "All Status" : s.charAt(0).toUpperCase() + s.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={service}
              onValueChange={(v) => {
                setService(v);
                resetPage();
              }}
            >
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Service" />
              </SelectTrigger>
              <SelectContent>
                {serviceOptions.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s === "All" ? "All Services" : s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="flex-1 min-h-0 overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Submitter</TableHead>
                <TableHead>Service Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-6">
                    No tithes entries found.
                  </TableCell>
                </TableRow>
              ) : (
                pageItems.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="text-muted-foreground">{formatDate(row.entryDate)}</TableCell>
                    <TableCell className="font-medium">{row.submittedBy}</TableCell>
                    <TableCell>{row.serviceType}</TableCell>
                    <TableCell className="text-right font-medium">{formatPHP(row.total)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={statusStyles[row.status]}>
                        {row.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setViewing(row)}>
                            <Eye className="h-4 w-4" /> View details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem disabled={row.status !== "pending"}>
                            <Check className="h-4 w-4 text-green-600" /> Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem disabled={row.status !== "pending"}>
                            <X className="h-4 w-4 text-red-600" /> Reject
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem disabled={row.status !== "pending"}>
                            <Pencil className="h-4 w-4" /> Edit
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>

        <CardFooter className="flex items-center justify-between border-t py-3">
          <p className="text-xs text-muted-foreground">
            Showing {filtered.length === 0 ? 0 : pageStart + 1}–
            {Math.min(pageStart + PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-2">
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

      <Dialog open={!!viewing} onOpenChange={(open) => !open && setViewing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tithes Entry Details</DialogTitle>
            <DialogDescription>
              {viewing && `${viewing.serviceType} • ${formatDate(viewing.entryDate)}`}
            </DialogDescription>
          </DialogHeader>
          {viewing && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-muted-foreground">Submitter</div>
                  <div className="font-medium">{viewing.submittedBy}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Status</div>
                  <Badge variant="secondary" className={statusStyles[viewing.status]}>
                    {viewing.status}
                  </Badge>
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-2">Denominations</div>
                <div className="rounded-md border divide-y">
                  {viewing.denominations.map((d, i) => (
                    <div key={i} className="flex justify-between px-3 py-2">
                      <span>₱{d.bill} × {d.qty}</span>
                      <span className="font-medium">{formatPHP(d.bill * d.qty)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between px-3 py-2 bg-muted/50 font-semibold">
                    <span>Total</span>
                    <span>{formatPHP(viewing.total)}</span>
                  </div>
                </div>
              </div>
              {viewing.remarks && (
                <div>
                  <div className="text-xs text-muted-foreground">Remarks</div>
                  <div>{viewing.remarks}</div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
