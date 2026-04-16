import { GoPlus } from "react-icons/go";
import Button from "@/components/Buttons";
import { ChartAreaGradient } from "@/components/dashboard-components/ChartAreaGradient";
import { ChartBarExpense } from "@/components/dashboard-components/ChartBarExpense";
import { RecentActivity } from "@/components/dashboard-components/RecentActivity";
import { SummaryStats } from "@/components/dashboard-components/SummaryStats";

function Dashboard() {
  return (
    <div
      className="w-full flex-1 min-h-0 flex flex-col gap-5 overflow-auto"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-xl md:text-[25px] font-[600]">Welcome, Admin 👋</p>
          <p className="text-gray-600 text-sm">
            Let's Rock today. We have 2 Pending Tasks and 5 New Records.
          </p>
        </div>
        <div className="w-full sm:w-36">
          <Button titleName="Add Category" icon={GoPlus} />
        </div>
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

      <div className="w-full h-[28rem] md:flex-1 md:min-h-0">
        <RecentActivity />
      </div>
    </div>
  );
}

export default Dashboard;
