import { ShieldCheck, UserCheck, UserX, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const OFFICER_ROLES = ["admin", "do", "validator", "pastor", "auditor"];

const computeStats = (users) => {
  const total    = users.length;
  const active   = users.filter((u) => u.isActive).length;
  const inactive = total - active;
  const officers = users.filter((u) => OFFICER_ROLES.includes(u.role)).length;
  const members  = users.filter((u) => u.role === "member").length;
  return { total, active, inactive, officers, members };
};

function StatTile({ label, value, sub, icon: Icon, accent }) {
  return (
    <div className={`rounded-lg border p-4 flex flex-col gap-2 ${accent ?? ""}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="text-2xl font-semibold">{value}</div>
      {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
    </div>
  );
}

export function UsersSummaryStats({ users = [], className }) {
  const stats = computeStats(users);
  return (
    <Card className={`w-full ${className ?? ""}`}>
      <CardHeader>
        <CardTitle>User Overview</CardTitle>
        <CardDescription>Role and account status across all registered users</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatTile
          label="Total Users"
          value={stats.total.toString()}
          sub="registered accounts"
          icon={Users}
          accent="bg-blue-50/50"
        />
        <StatTile
          label="Active"
          value={stats.active.toString()}
          sub="can sign in"
          icon={UserCheck}
          accent="bg-emerald-50/50"
        />
        <StatTile
          label="Inactive"
          value={stats.inactive.toString()}
          sub="deactivated accounts"
          icon={UserX}
          accent="bg-red-50/50"
        />
        <StatTile
          label="Officers vs Members"
          value={`${stats.officers} / ${stats.members}`}
          sub="officer roles vs members"
          icon={ShieldCheck}
          accent="bg-purple-50/50"
        />
      </CardContent>
    </Card>
  );
}
