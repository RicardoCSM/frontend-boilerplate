"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/modules/Common/Components/Datatable/DatatableColumnHeader";
import supportService from "@/modules/Common/Services/support.service";
import QuestionnaireResponse from "@/modules/Questionnaires/Interfaces/QuestionnaireResponse";
import DatatableItemActions from "@/modules/Common/Components/Datatable/DatatableItemActions";

export const acessorKeyLabels = {
  started_at: "Início em",
  ended_at: "Fim em",
  actions: "Ações",
};

export const columns: ColumnDef<QuestionnaireResponse>[] = [
  {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Início em" />
    ),
    accessorKey: "started_at",
    cell: ({ row }) => (
      <>{supportService.formatDateTime(row.getValue("started_at"))}</>
    ),
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fim em" />
    ),
    accessorKey: "ended_at",
    cell: ({ row }) => (
      <>{supportService.formatDateTime(row.getValue("ended_at"))}</>
    ),
  },
  {
    header: "",
    accessorKey: "actions",
    cell: ({ row }) => (
      <DatatableItemActions
        baseUrl={`/admin/questionnaires/responses/${row.original.id}`}
        item={row.original}
        actions={["view"]}
        requiredPermission="questionnaire-responses"
      />
    ),
  },
];
