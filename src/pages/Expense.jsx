import { useMemo, useState } from "react";
import { GoPlus } from "react-icons/go";
import CustomButton from "@/components/Buttons";
import { ExpenseCategoryBreakdown } from "@/components/expense-components/ExpenseCategoryBreakdown";
import { ExpenseDetailsDialog } from "@/components/expense-components/ExpenseDetailsDialog";
import { ExpenseSummaryStats } from "@/components/expense-components/ExpenseSummaryStats";
import { ExpenseTable } from "@/components/expense-components/ExpenseTable";
import { ExpenseTrendChart } from "@/components/expense-components/ExpenseTrendChart";
import { RecordExpenseDialog } from "@/components/expense-components/RecordExpenseDialog";
import { useAuth } from "@/hooks/useAuth";
import { useCategories } from "@/hooks/useCategories";
import { useExpenses } from "@/hooks/useExpenses";
import { can } from "@/utils/rolePermissions";

function Expense() {
  const { user } = useAuth();
  const canRecord = can.recordManualExpense(user?.role);

  const { expenses, loading, error, createExpense } = useExpenses();
  const { categories } = useCategories();

  const expenseCategories = useMemo(
    () => categories.filter((c) => c.type === "expense" && c.isActive !== false),
    [categories]
  );

  const [viewingExpense, setViewingExpense] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="w-full flex-1 min-h-0 flex flex-col gap-5 overflow-auto px-1">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold">Expenses</h1>
          <p className="text-sm text-muted-foreground">
            Track and record all church expenses across vouchers and manual entries.
          </p>
        </div>
        {canRecord && (
          <div className="w-full sm:w-44" onClick={() => setCreateOpen(true)}>
            <CustomButton titleName="Record Expense" icon={GoPlus} />
          </div>
        )}
      </div>

      <div className="shrink-0">
        <ExpenseSummaryStats expenses={expenses} />
      </div>

      <div className="shrink-0 grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="h-72 md:h-96">
          <ExpenseTrendChart expenses={expenses} />
        </div>
        <div className="h-72 md:h-96">
          <ExpenseCategoryBreakdown expenses={expenses} />
        </div>
      </div>

      <div className="h-[24rem] md:h-[32rem] shrink-0">
        <ExpenseTable
          expenses={expenses}
          loading={loading}
          error={error}
          onViewExpense={setViewingExpense}
        />
      </div>

      <ExpenseDetailsDialog
        expense={viewingExpense}
        open={!!viewingExpense}
        onOpenChange={(v) => !v && setViewingExpense(null)}
      />

      {canRecord && (
        <RecordExpenseDialog
          categories={expenseCategories}
          open={createOpen}
          onOpenChange={setCreateOpen}
          onSubmit={createExpense}
        />
      )}
    </div>
  );
}

export default Expense;
