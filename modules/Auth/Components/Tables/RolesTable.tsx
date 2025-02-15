"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Role } from "../../Interfaces/Role";
import { toast } from "@/hooks/use-toast";
import rolesService from "../../Services/roles.service";
import {
  getCoreRowModel,
  getPaginationRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { DataTable } from "@/modules/Common/Components/Datatable/Datatable";
import { DataTableAdvancedToolbar } from "@/modules/Common/Components/Datatable/DatatableAdvancedToolbar";
import DatatableCreateButton from "@/modules/Common/Components/Datatable/DatatableCreateButton";
import { getColumns, acessorKeyLabels } from "./_partials/RolesTableColumns";
import { isAxiosError } from "@/lib/utils";
import { ApiError } from "@/modules/Common/Interfaces/ApiError";

const RolesTable = () => {
  const [roles, setRoles] = useState<Role[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "updated_at",
      desc: true,
    },
  ]);
  const [totalPages, setTotalPages] = useState(0);
  const [rowCount, setRowCount] = useState(0);
  const isFirstRender = useRef(true);

  const fetchRoles = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await rolesService.index({
        per_page: pagination.pageSize,
        page: pagination.pageIndex + 1,
        search: search,
        sort_field: sorting[0].id,
        sort_order: sorting[0].desc ? "desc" : "asc",
        log: isFirstRender.current ? true : false,
      });
      const response = res.data;
      setRoles(response.data);
      setTotalPages(response.meta.last_page);
      setRowCount(response.meta.total);
      isFirstRender.current = false;
    } catch (e: unknown) {
      if (isAxiosError<ApiError>(e)) {
        toast({
          title: "Algo deu errado.",
          description: e.response?.data.message || "",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [search, pagination, sorting]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const deleteRole = async (role: Role) => {
    try {
      const response = await rolesService.delete(role.name);
      if (response.status === 204) {
        toast({
          title: "Grupo deletado com sucesso.",
        });
        fetchRoles();
      }
    } catch (e: unknown) {
      if (isAxiosError<ApiError>(e)) {
        toast({
          title: "Algo deu errado.",
          description: e.response?.data.message || "",
          variant: "destructive",
        });
      }
    }
  };

  const table = useReactTable<Role>({
    data: roles || [],
    columns: getColumns(deleteRole),
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    manualSorting: true,
    onSortingChange: setSorting,
    pageCount: totalPages,
    rowCount: rowCount,
    state: {
      pagination,
      sorting,
    },
  });

  return (
    <div className="flex flex-1 py-6 md:px-4">
      <DataTable table={table} isLoading={isLoading}>
        <DataTableAdvancedToolbar
          table={table}
          isLoading={isLoading}
          search={search}
          setSearch={setSearch}
          acessorKeyLabels={acessorKeyLabels}
        >
          <DatatableCreateButton
            href="/admin/access/roles/create"
            disabled={isLoading}
            requiredPermission="roles"
          />
        </DataTableAdvancedToolbar>
      </DataTable>
    </div>
  );
};

export default RolesTable;
