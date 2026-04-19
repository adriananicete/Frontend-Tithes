import { useState } from "react";
import { GoPlus } from "react-icons/go";
import { LuChartBar, LuCoins, LuReceipt } from "react-icons/lu";
import { useNavigate } from "react-router";
import Button from "@/components/Buttons";
import { CategoryFormDialog } from "@/components/categories-components/CategoryFormDialog";
import { ChartAreaGradient } from "@/components/dashboard-components/ChartAreaGradient";
import { ChartBarExpense } from "@/components/dashboard-components/ChartBarExpense";
import { RecentActivity } from "@/components/dashboard-components/RecentActivity";
import { SummaryStats } from "@/components/dashboard-components/SummaryStats";
import { SubmitTithesDialog } from "@/components/tithes-components/SubmitTithesDialog";
import { CreateVoucherDialog } from "@/components/voucher-components/CreateVoucherDialog";
import { useAuth } from "@/hooks/useAuth";

// Quick-action buttons per role. Mirrors the backend ACL in CLAUDE.md:
// admin can do everything; validator can create vouchers + submit tithes;
// DO and members can only submit tithes; auditor generates reports;
// pastor has no dashboard shortcut (approvals happen inside the RF page).
// Each action opens the same dialog as the one on its feature page, except
// "generate_report" — Reports has no single dialog, so it navigates.
const ADD_CATEGORY    = { key: "add_category",    label: "Add Category",    icon: GoPlus };
const CREATE_VOUCHER  = { key: "create_voucher",  label: "Create Voucher",  icon: LuReceipt };
const SUBMIT_TITHES   = { key: "submit_tithes",   label: "Submit Tithes",   icon: LuCoins };
const GENERATE_REPORT = { key: "generate_report", label: "Generate Report", icon: LuChartBar };

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

  const [categoryOpen, setCategoryOpen] = useState(false);
  const [voucherOpen, setVoucherOpen] = useState(false);
  const [tithesOpen, setTithesOpen] = useState(false);

  const handleAction = (key) => {
    if (key === "add_category") setCategoryOpen(true);
    else if (key === "create_voucher") setVoucherOpen(true);
    else if (key === "submit_tithes") setTithesOpen(true);
    else if (key === "generate_report") navigate("/reports");
  };

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
                key={a.key}
                onClick={() => handleAction(a.key)}
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

      <CategoryFormDialog open={categoryOpen} onOpenChange={setCategoryOpen} />
      <CreateVoucherDialog open={voucherOpen} onOpenChange={setVoucherOpen} />
      <SubmitTithesDialog open={tithesOpen} onOpenChange={setTithesOpen} />
    </div>
  );
}

export default Dashboard;
