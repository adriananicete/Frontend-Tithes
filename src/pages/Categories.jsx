import { useState } from "react";
import { GoPlus } from "react-icons/go";
import CustomButton from "@/components/Buttons";
import { CategoriesSummaryStats } from "@/components/categories-components/CategoriesSummaryStats";
import { CategoriesTable } from "@/components/categories-components/CategoriesTable";
import { CategoryFormDialog } from "@/components/categories-components/CategoryFormDialog";
import { ConfirmCategoryActionDialog } from "@/components/categories-components/ConfirmCategoryActionDialog";
import { useCategories } from "@/hooks/useCategories";

function Categories() {
  const {
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useCategories();

  const [createOpen, setCreateOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [confirm, setConfirm] = useState(null); // { category, action }

  const handleToggleActive = (category) => {
    setConfirm({
      category,
      action: category.isActive ? "archive" : "restore",
    });
  };

  const handleDelete = (category) => {
    setConfirm({ category, action: "delete" });
  };

  const handleConfirmAction = async () => {
    if (!confirm) return;
    const { category, action } = confirm;
    if (action === "archive") {
      await updateCategory(category._id, { isActive: false });
    } else if (action === "restore") {
      await updateCategory(category._id, { isActive: true });
    } else if (action === "delete") {
      await deleteCategory(category._id);
    }
  };

  return (
    <div className="w-full flex-1 min-h-0 flex flex-col gap-5 overflow-auto px-1">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold">Categories</h1>
          <p className="text-sm text-muted-foreground">
            Organize request forms and expenses into named categories with color accents.
          </p>
        </div>
        <div className="w-full sm:w-44" onClick={() => setCreateOpen(true)}>
          <CustomButton titleName="Create Category" icon={GoPlus} />
        </div>
      </div>

      <div className="shrink-0">
        <CategoriesSummaryStats categories={categories} />
      </div>

      <div className="h-[24rem] md:h-[32rem] shrink-0">
        <CategoriesTable
          categories={categories}
          loading={loading}
          error={error}
          onEditCategory={setEditingCategory}
          onToggleActive={handleToggleActive}
          onDeleteCategory={handleDelete}
        />
      </div>

      <CategoryFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={createCategory}
      />

      {editingCategory && (
        <CategoryFormDialog
          category={editingCategory}
          open
          onOpenChange={(v) => !v && setEditingCategory(null)}
          onSubmit={(payload) => updateCategory(editingCategory._id, payload)}
        />
      )}

      <ConfirmCategoryActionDialog
        category={confirm?.category}
        action={confirm?.action}
        open={!!confirm}
        onOpenChange={(v) => !v && setConfirm(null)}
        onConfirm={handleConfirmAction}
      />
    </div>
  );
}

export default Categories;
