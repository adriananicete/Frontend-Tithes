import { apiFetch } from "../services/api";
import { notifyAction } from "@/lib/toast";
import { useCachedResource } from "./useCachedResource";

export function useExpenses() {
  const { data: res, loading, error, refetch } = useCachedResource(
    "expenses",
    () => apiFetch("/expenses"),
  );
  const expenses = res?.data ?? [];

  const createExpense = async (payload) => {
    await apiFetch("/expenses", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    await refetch();
    notifyAction("expenseRecorded");
  };

  return { expenses, loading, error, refetch, createExpense };
}
