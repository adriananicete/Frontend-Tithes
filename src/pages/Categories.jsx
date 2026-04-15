import { useState } from "react";
import { GoPlus } from "react-icons/go";
import CustomButton from "@/components/Buttons";
import { CategoriesSummaryStats } from "@/components/categories-components/CategoriesSummaryStats";
import { CategoriesTable } from "@/components/categories-components/CategoriesTable";
import { CategoryFormDialog } from "@/components/categories-components/CategoryFormDialog";
import { ConfirmCategoryActionDialog } from "@/components/categories-components/ConfirmCategoryActionDialog";

function Categories() {
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

  return (
    <div className="w-full flex-1 min-h-0 flex flex-col gap-5 overflow-auto px-1">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Categories</h1>
          <p className="text-sm text-muted-foreground">
            Organize request forms and expenses into named categories with color accents.
          </p>
        </div>
        <div className="w-44" onClick={() => setCreateOpen(true)}>
          <CustomButton titleName="Create Category" icon={GoPlus} />
        </div>
      </div>

      <div className="shrink-0">
        <CategoriesSummaryStats />
      </div>

      <div className="h-[32rem] shrink-0">
        <CategoriesTable
          onEditCategory={setEditingCategory}
          onToggleActive={handleToggleActive}
          onDeleteCategory={handleDelete}
        />
      </div>

      <CategoryFormDialog open={createOpen} onOpenChange={setCreateOpen} />

      <CategoryFormDialog
        category={editingCategory}
        open={!!editingCategory}
        onOpenChange={(v) => !v && setEditingCategory(null)}
      />

      <ConfirmCategoryActionDialog
        category={confirm?.category}
        action={confirm?.action}
        open={!!confirm}
        onOpenChange={(v) => !v && setConfirm(null)}
      />
    </div>
  );
}

export default Categories;
