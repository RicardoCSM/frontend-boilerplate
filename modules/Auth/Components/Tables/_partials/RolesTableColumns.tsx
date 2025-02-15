"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/modules/Common/Components/Datatable/DatatableColumnHeader";
import supportService from "@/modules/Common/Services/support.service";
import DatatableItemActions from "@/modules/Common/Components/Datatable/DatatableItemActions";
import { Role } from "@/modules/Auth/Interfaces/Role";

export const acessorKeyLabels = {
  name: "Grupo",
  description: "Descrição",
  updated_at: "Atualizado em",
  actions: "Ações",
};

export const getColumns = (
  handleDelete: (role: Role) => void,
): ColumnDef<Role>[] => {
  return [
    {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Grupo" />
      ),
      accessorKey: "name",
    },
    {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Descrição" />
      ),
      accessorKey: "description",
    },
    {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Atualizado em" />
      ),
      accessorKey: "updated_at",
      cell: ({ row }) => (
        <>{supportService.formatDateTime(row.getValue("updated_at"))}</>
      ),
    },
    {
      header: "",
      accessorKey: "actions",
      cell: ({ row }) => (
        <DatatableItemActions
          baseUrl={`/admin/access/roles/${row.original.name}`}
          item={row.original}
          actions={["view", "edit", "delete"]}
          deleteAction={handleDelete}
          requiredPermission="roles"
        />
      ),
    },
  ];
};
