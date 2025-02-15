"use client";

import RoleFormContainer from "@/modules/Auth/Components/Containers/RoleFormContainer";
import AdminLayout from "@/modules/Common/Components/AdminLayout/AdminLayout";

export default function AdminRolesShow({
  params,
}: {
  params: { name: string };
}) {
  return (
    <AdminLayout
      pageTitle="Visualizar Grupo"
      path={[{ name: "Grupos", url: "/admin/access/roles" }]}
      requiredPermission="view-roles"
    >
      <RoleFormContainer mode="view" name={params.name} />
    </AdminLayout>
  );
}
