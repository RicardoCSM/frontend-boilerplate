"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/modules/Common/Components/Datatable/DatatableColumnHeader";
import supportService from "@/modules/Common/Services/support.service";
import AccessLog from "@/modules/Logs/Interfaces/AccessLog";

export const acessorKeyLabels = {
  user_name: "Usuário",
  created_at: "Data",
  action: "Tipo",
  module: "Módulo",
  message: "Ação",
};

export const columns: ColumnDef<AccessLog>[] = [
  {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Usuário" />
    ),
    accessorKey: "user_name",
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data" />
    ),
    accessorKey: "created_at",
    cell: ({ row }) => (
      <>{supportService.formatDateTimeFull(row.getValue("created_at"))}</>
    ),
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tipo" />
    ),
    accessorKey: "action",
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Módulo" />
    ),
    accessorKey: "module",
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ação" />
    ),
    accessorKey: "message",
  },
];
