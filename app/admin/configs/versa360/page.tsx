"use client";

import Versa360ScopesListContainer from "@/modules/Auth/Components/Containers/Versa360ScopesListContainer";
import AdminLayout from "@/modules/Common/Components/AdminLayout/AdminLayout";

export default function AdminVersa360() {
  return (
    <AdminLayout
      pageTitle="Configurações Versa 360"
      requiredPermission="get-versa360-client"
    >
      <Versa360ScopesListContainer />
    </AdminLayout>
  );
}
