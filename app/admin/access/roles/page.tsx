"use client";

import RolesTable from "@/modules/Auth/Components/Tables/RolesTable";
import AdminLayout from "@/modules/Common/Components/AdminLayout/AdminLayout";

export default function AdminRoles() {
  return (
    <AdminLayout pageTitle="Grupos" requiredPermission="roles">
      <RolesTable />
    </AdminLayout>
  );
}
