import { useMemo } from "react";
import { ChevronRight, XCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatPHP, pipelineStages, statusConfig } from "./mockData";

const computeStageStats = (rfs) => {
  const stats = {};
  [...pipelineStages, "rejected"].forEach((s) => {
    stats[s] = { count: 0, amount: 0 };
  });
  rfs.forEach((r) => {
    if (stats[r.status]) {
      stats[r.status].count += 1;
      stats[r.status].amount += Number(r.estimatedAmount) || 0;
    }
  });
  return stats;
};

export function RfPipelineTracker({ rfs = [], activeStatus, onSelectStatus, className }) {
  const stats = useMemo(() => computeStageStats(rfs), [rfs]);

  return (
    <Card className={`w-full ${className ?? ""}`}>
      <CardHeader>
        <CardTitle>Approval Pipeline</CardTitle>
        <CardDescription>Click a stage to filter the table below</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-stretch gap-2 overflow-x-auto">
          {pipelineStages.map((stage, idx) => {
            const cfg = statusConfig[stage];
            const s = stats[stage];
            const isActive = activeStatus === stage;
            return (
              <div key={stage} className="flex items-stretch gap-2">
                <button
                  type="button"
                  onClick={() => onSelectStatus?.(isActive ? null : stage)}
                  className={`flex-1 min-w-[130px] rounded-lg border p-3 text-left transition ${
                    isActive
                      ? "ring-2 ring-offset-1 ring-blue-500 bg-blue-50/50"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <div
                    className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${cfg.color}`}
                  >
                    {cfg.label}
                  </div>
                  <div className="mt-2 text-2xl font-semibold">{s.count}</div>
                  <div className="text-xs text-muted-foreground">{formatPHP(s.amount)}</div>
                </button>
                {idx < pipelineStages.length - 1 && (
                  <div className="flex items-center">
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
              </div>
            );
          })}

          <div className="border-l mx-2" />

          <button
            type="button"
            onClick={() =>
              onSelectStatus?.(activeStatus === "rejected" ? null : "rejected")
            }
            className={`min-w-[130px] rounded-lg border p-3 text-left transition ${
              activeStatus === "rejected"
                ? "ring-2 ring-offset-1 ring-red-500 bg-red-50/50"
                : "hover:bg-muted/50"
            }`}
          >
            <div className="flex items-center gap-1.5">
              <XCircle className="h-3 w-3 text-red-600" />
              <span
                className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${statusConfig.rejected.color}`}
              >
                Rejected
              </span>
            </div>
            <div className="mt-2 text-2xl font-semibold">{stats.rejected.count}</div>
            <div className="text-xs text-muted-foreground">
              {formatPHP(stats.rejected.amount)}
            </div>
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
