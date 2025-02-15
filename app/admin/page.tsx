"use client";

import UsersDashboard from "@/modules/Auth/Components/Dashboards/UsersDashboard";
import userFilters from "@/modules/Auth/Components/Filters/UserFilters";
import AdminLayout from "@/modules/Common/Components/AdminLayout/AdminLayout";
import Dashboard from "@/modules/Common/Components/Dashboards/Dashboard";

export default function Admin() {
  return (
    <AdminLayout pageTitle="Dashboard" requiredPermission="admin-panel">
      <Dashboard
        tabs={[
          {
            label: "Usuários",
            title: "Usuários",
            value: "users",
            filterTypes: userFilters,
            component: UsersDashboard,
          },
        ]}
        defaultTab="dashboard"
      />
    </AdminLayout>
  );
}
