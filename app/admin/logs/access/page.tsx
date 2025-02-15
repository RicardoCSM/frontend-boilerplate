"use client";

import AdminLayout from "@/modules/Common/Components/AdminLayout/AdminLayout";
import LogsTable from "@/modules/Logs/Components/Tables/LogsTable";
import React from "react";

export default function AdminAccessLogs() {
  return (
    <AdminLayout pageTitle="Logs de Acesso" requiredPermission="access-logs">
      <LogsTable />
    </AdminLayout>
  );
}
