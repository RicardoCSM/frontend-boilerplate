"use client";

import AdminLayout from "@/modules/Common/Components/AdminLayout/AdminLayout";
import ThemeFormContainer from "@/modules/Tenant/Themes/Components/Containers/ThemeFormContainer";

export default function AdminThemes() {
  return (
    <AdminLayout pageTitle="Temas" requiredPermission="themes">
      <ThemeFormContainer />
    </AdminLayout>
  );
}
