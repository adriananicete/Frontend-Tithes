import { ChartAreaGradient } from "@/components/dashboard-components/ChartAreaGradient";
import { ChartBarExpense } from "@/components/dashboard-components/ChartBarExpense";

function Dashboard() {
    return (
        <div className="w-full border h-full flex justify-center items-center gap-5">
            <div className="w-120 h-80">
                <ChartAreaGradient />
            </div>

            <div className="w-120 h-80">
                <ChartBarExpense />
            </div>
        </div>
     );
}

export default Dashboard;