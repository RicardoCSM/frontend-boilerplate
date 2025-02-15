"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/modules/Common/Components/Datatable/DatatableColumnHeader";
import supportService from "@/modules/Common/Services/support.service";
import DatatableItemActions from "@/modules/Common/Components/Datatable/DatatableItemActions";
import User from "@/modules/Auth/Interfaces/User";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";

export const acessorKeyLabels = {
  avatar: "Avatar",
  name: "Nome",
  login: "Login",
  updated_at: "Atualizado em",
  active: "Status",
  actions: "Ações",
};

export const getColumns = (
  handleDelete: (user: User) => void,
): ColumnDef<User>[] => {
  return [
    {
      header: "",
      accessorKey: "avatar",
      cell: ({ row }) => (
        <Avatar>
          <AvatarImage src={row.getValue("avatar") ?? ""} />
          <AvatarFallback>
            {(row.getValue("name") as string).charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      ),
    },
    {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nome" />
      ),
      accessorKey: "name",
    },
    {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Login" />
      ),
      accessorKey: "login",
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
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      accessorKey: "active",
      cell: ({ row }) => <Switch disabled checked={row.getValue("active")} />,
    },
    {
      header: "",
      accessorKey: "actions",
      cell: ({ row }) => (
        <DatatableItemActions
          baseUrl={`/admin/access/users/${row.original.id}`}
          item={row.original}
          actions={["view", "edit", "delete"]}
          deleteAction={handleDelete}
          requiredPermission="users"
        />
      ),
    },
  ];
};
