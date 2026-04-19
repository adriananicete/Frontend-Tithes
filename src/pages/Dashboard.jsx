import { GoPlus } from "react-icons/go";
import { LuChartBar, LuCoins, LuReceipt } from "react-icons/lu";
import { useNavigate } from "react-router";
import Button from "@/components/Buttons";
import { ChartAreaGradient } from "@/components/dashboard-components/ChartAreaGradient";
import { ChartBarExpense } from "@/components/dashboard-components/ChartBarExpense";
import { RecentActivity } from "@/components/dashboard-components/RecentActivity";
import { SummaryStats } from "@/components/dashboard-components/SummaryStats";
import { useAuth } from "@/hooks/useAuth";

// Quick-action buttons per role. Mirrors the backend ACL in CLAUDE.md:
// admin can do everything; validator can create vouchers + submit tithes;
// DO and members can only submit tithes; auditor generates reports;
// pastor has no dashboard shortcut (approvals happen inside the RF page).
const ADD_CATEGORY   = { label: "Add Category",   icon: GoPlus,     path: "/admin/categories" };
const CREATE_VOUCHER = { label: "Create Voucher", icon: LuReceipt,  path: "/voucher" };
const SUBMIT_TITHES  = { label: "Submit Tithes",  icon: LuCoins,    path: "/tithes" };
const GENERATE_REPORT = { label: "Generate Report", icon: LuChartBar, path: "/reports" };

const QUICK_ACTIONS_BY_ROLE = {
  admin:     [ADD_CATEGORY, CREATE_VOUCHER, SUBMIT_TITHES, GENERATE_REPORT],
  validator: [CREATE_VOUCHER, SUBMIT_TITHES],
  do:        [SUBMIT_TITHES],
  member:    [SUBMIT_TITHES],
  auditor:   [GENERATE_REPORT],
  pastor:    [],
};

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const firstName = user?.name?.split(" ")[0] ?? "there";
  const actions = QUICK_ACTIONS_BY_ROLE[user?.role] ?? [];

  return (
    <div
      className="w-full flex-1 min-h-0 flex flex-col gap-5 overflow-auto px-1"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-xl md:text-[25px] font-[600]">Welcome, {firstName} 👋</p>
          <p className="text-gray-600 text-sm">
            Let's Rock today. We have 2 Pending Tasks and 5 New Records.
          </p>
        </div>
        {actions.length > 0 && (
          <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2">
            {actions.map((a) => (
              <div
                key={a.path}
                onClick={() => navigate(a.path)}
                className="w-full sm:w-40"
              >
                <Button titleName={a.label} icon={a.icon} />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 w-full">
        <div className="min-w-0">
          <ChartAreaGradient />
        </div>

        <div className="min-w-0">
          <ChartBarExpense />
        </div>

        <div className="min-w-0 lg:h-auto">
          <SummaryStats />
        </div>
      </div>

      <div className="w-full h-[28rem] md:h-[36rem]">
        <RecentActivity />
      </div>
    </div>
  );
}

export default Dashboard;
