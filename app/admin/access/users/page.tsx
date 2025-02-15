"use client";

import UsersTable from "@/modules/Auth/Components/Tables/UsersTable";
import AdminLayout from "@/modules/Common/Components/AdminLayout/AdminLayout";

export default function AdminUsers() {
  return (
    <AdminLayout pageTitle="Usuários" requiredPermission="users">
      <UsersTable />
    </AdminLayout>
  );
}
