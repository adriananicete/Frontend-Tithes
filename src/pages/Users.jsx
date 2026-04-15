import { useState } from "react";
import { GoPlus } from "react-icons/go";
import CustomButton from "@/components/Buttons";
import { ConfirmUserActionDialog } from "@/components/users-components/ConfirmUserActionDialog";
import { CreateUserDialog } from "@/components/users-components/CreateUserDialog";
import { EditUserDialog } from "@/components/users-components/EditUserDialog";
import { UserDetailsDialog } from "@/components/users-components/UserDetailsDialog";
import { UsersSummaryStats } from "@/components/users-components/UsersSummaryStats";
import { UsersTable } from "@/components/users-components/UsersTable";

function Users() {
  const [createOpen, setCreateOpen] = useState(false);
  const [viewingUser, setViewingUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [confirm, setConfirm] = useState(null); // { user, action }

  const handleToggleActive = (user) => {
    setConfirm({ user, action: user.isActive ? "deactivate" : "activate" });
  };

  const handleDelete = (user) => {
    setConfirm({ user, action: "delete" });
  };

  return (
    <div className="w-full flex-1 min-h-0 flex flex-col gap-5 overflow-auto px-1">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Users</h1>
          <p className="text-sm text-muted-foreground">
            Manage user accounts, assign roles, and control access to the system.
          </p>
        </div>
        <div className="w-40" onClick={() => setCreateOpen(true)}>
          <CustomButton titleName="Create User" icon={GoPlus} />
        </div>
      </div>

      <div className="shrink-0">
        <UsersSummaryStats />
      </div>

      <div className="h-[32rem] shrink-0">
        <UsersTable
          onViewUser={setViewingUser}
          onEditUser={setEditingUser}
          onToggleActive={handleToggleActive}
          onDeleteUser={handleDelete}
        />
      </div>

      <CreateUserDialog open={createOpen} onOpenChange={setCreateOpen} />

      <UserDetailsDialog
        user={viewingUser}
        open={!!viewingUser}
        onOpenChange={(v) => !v && setViewingUser(null)}
      />

      <EditUserDialog
        user={editingUser}
        open={!!editingUser}
        onOpenChange={(v) => !v && setEditingUser(null)}
      />

      <ConfirmUserActionDialog
        user={confirm?.user}
        action={confirm?.action}
        open={!!confirm}
        onOpenChange={(v) => !v && setConfirm(null)}
      />
    </div>
  );
}

export default Users;
