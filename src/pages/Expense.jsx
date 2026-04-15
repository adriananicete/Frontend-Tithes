import { useState } from "react";
import { GoPlus } from "react-icons/go";
import CustomButton from "@/components/Buttons";
import { ExpenseCategoryBreakdown } from "@/components/expense-components/ExpenseCategoryBreakdown";
import { ExpenseDetailsDialog } from "@/components/expense-components/ExpenseDetailsDialog";
import { ExpenseSummaryStats } from "@/components/expense-components/ExpenseSummaryStats";
import { ExpenseTable } from "@/components/expense-components/ExpenseTable";
import { ExpenseTrendChart } from "@/components/expense-components/ExpenseTrendChart";
import { RecordExpenseDialog } from "@/components/expense-components/RecordExpenseDialog";
import { useAuth } from "@/hooks/useAuth";
import { can } from "@/utils/rolePermissions";

function Expense() {
  const { user } = useAuth();
  const canRecord = can.recordManualExpense(user?.role);
  const [viewingExpense, setViewingExpense] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="w-full flex-1 min-h-0 flex flex-col gap-5 overflow-auto px-1">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Expenses</h1>
          <p className="text-sm text-muted-foreground">
            Track and record all church expenses across vouchers and manual entries.
          </p>
        </div>
        {canRecord && (
          <div className="w-44" onClick={() => setCreateOpen(true)}>
            <CustomButton titleName="Record Expense" icon={GoPlus} />
          </div>
        )}
      </div>

      <div className="shrink-0">
        <ExpenseSummaryStats />
      </div>

      <div className="shrink-0 grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="h-96">
          <ExpenseTrendChart />
        </div>
        <div className="h-96">
          <ExpenseCategoryBreakdown />
        </div>
      </div>

      <div className="h-[32rem] shrink-0">
        <ExpenseTable onViewExpense={setViewingExpense} />
      </div>

      <ExpenseDetailsDialog
        expense={viewingExpense}
        open={!!viewingExpense}
        onOpenChange={(v) => !v && setViewingExpense(null)}
      />

      <RecordExpenseDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}

export default Expense;
