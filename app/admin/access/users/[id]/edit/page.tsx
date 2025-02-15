"use client";

import UserFormContainer from "@/modules/Auth/Components/Containers/UserFormContainer";
import AdminLayout from "@/modules/Common/Components/AdminLayout/AdminLayout";

export default function AdminUsersEdit({
  params,
}: {
  params: { id: string };
}) {
  return (
    <AdminLayout
      pageTitle="Editar Usuário"
      path={[{ name: "Usuários", url: "/admin/access/users" }]}
      requiredPermission="edit-users"
    >
      <UserFormContainer mode="edit" id={params.id} />
    </AdminLayout>
  );
}
