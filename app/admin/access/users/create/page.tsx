"use client";

import UserFormContainer from "@/modules/Auth/Components/Containers/UserFormContainer";
import AdminLayout from "@/modules/Common/Components/AdminLayout/AdminLayout";

export default function AdminUsersCreate() {
  return (
    <AdminLayout
      pageTitle="Adicionar Usuário"
      path={[{ name: "Usuários", url: "/admin/access/users" }]}
      requiredPermission="create-users"
    >
      <UserFormContainer mode="create" />
    </AdminLayout>
  );
}
