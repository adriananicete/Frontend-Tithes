import { GoPlus } from "react-icons/go";
import Button from "@/components/Buttons";
import { ChartAreaGradient } from "@/components/dashboard-components/ChartAreaGradient";
import { ChartBarExpense } from "@/components/dashboard-components/ChartBarExpense";
import { RecentActivity } from "@/components/dashboard-components/RecentActivity";
import { SummaryStats } from "@/components/dashboard-components/SummaryStats";

function Dashboard() {
  return (
    <div
      className="w-full flex-1 min-h-0 flex flex-col gap-5"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[25px] font-[600]">Welcome, Admin 👋</p>
          <p className="text-gray-600 text-sm">
            Let's Rock today. We have 2 Pending Tasks and 5 New Records.
          </p>
        </div>
        <div className="w-33">
          <Button titleName="Add Category" icon={GoPlus} />
        </div>
      </div>

      <div className=" flex justify-start items-center gap-5 w-full h-auto">
        <div className="w-110">
          <ChartAreaGradient />
        </div>

        <div className="w-110">
          <ChartBarExpense />
        </div>

        <div className="flex-1 h-98">
          <SummaryStats />
        </div>
      </div>

      <div className="w-full flex-1 min-h-0">
        <RecentActivity />
      </div>
    </div>
  );
}

export default Dashboard;
