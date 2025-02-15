"use client";

import UserFormContainer from "@/modules/Auth/Components/Containers/UserFormContainer";
import AdminLayout from "@/modules/Common/Components/AdminLayout/AdminLayout";

export default function AdminUsersShow({
  params,
}: {
  params: { id: string };
}) {
  return (
    <AdminLayout
      pageTitle="Visualizar Usuário"
      path={[{ name: "Usuários", url: "/admin/access/users" }]}
      requiredPermission="view-users"
    >
      <UserFormContainer mode="view" id={params.id} />
    </AdminLayout>
  );
}
