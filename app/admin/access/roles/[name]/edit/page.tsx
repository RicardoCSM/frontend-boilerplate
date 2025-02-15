"use client";

import RoleFormContainer from "@/modules/Auth/Components/Containers/RoleFormContainer";
import AdminLayout from "@/modules/Common/Components/AdminLayout/AdminLayout";

export default function AdminRolesEdit({
  params,
}: {
  params: { name: string };
}) {
  return (
    <AdminLayout
      pageTitle="Editar Grupo"
      path={[{ name: "Grupos", url: "/admin/access/roles" }]}
      requiredPermission="edit-roles"
    >
      <RoleFormContainer mode="edit" name={params.name} />
    </AdminLayout>
  );
}
