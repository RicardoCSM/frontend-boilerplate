"use client";

import RoleFormContainer from "@/modules/Auth/Components/Containers/RoleFormContainer";
import AdminLayout from "@/modules/Common/Components/AdminLayout/AdminLayout";

export default function AdminRolesCreate() {
  return (
    <AdminLayout
      pageTitle="Adicionar Grupo"
      path={[{ name: "Grupos", url: "/admin/access/roles" }]}
      requiredPermission="create-roles"
    >
      <RoleFormContainer mode="create" />
    </AdminLayout>
  );
}
