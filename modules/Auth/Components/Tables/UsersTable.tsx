"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "@/hooks/use-toast";
import usersService from "../../Services/users.service";
import User from "../../Interfaces/User";
import {
  getCoreRowModel,
  getPaginationRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { Filter } from "@/modules/Common/Interfaces/Filter";
import { DataTable } from "@/modules/Common/Components/Datatable/Datatable";
import { DataTableAdvancedToolbar } from "@/modules/Common/Components/Datatable/DatatableAdvancedToolbar";
import DatatableCreateButton from "@/modules/Common/Components/Datatable/DatatableCreateButton";
import { acessorKeyLabels, getColumns } from "./_partials/UsersTableColumns";
import userFilters from "../Filters/UserFilters";
import { isAxiosError } from "@/lib/utils";
import { ApiError } from "@/modules/Common/Interfaces/ApiError";

const UsersTable = () => {
  const [users, setUsers] = useState<User[] | null>(null);
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
  const [filters, setFilters] = useState<Filter[]>([]);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await usersService.index(
        {
          per_page: pagination.pageSize,
          page: pagination.pageIndex + 1,
          search: search,
          sort_field: sorting[0].id,
          sort_order: sorting[0].desc ? "desc" : "asc",
          log: isFirstRender.current ? true : false,
        },
        filters,
      );
      const response = res.data;
      setUsers(response.data);
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
  }, [search, pagination, sorting, filters]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const deleteUser = async (User: User) => {
    try {
      const response = await usersService.delete(User.id);
      if (response.status === 204) {
        toast({
          title: "Usuário deletado com sucesso.",
        });
        fetchUsers();
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

  const table = useReactTable<User>({
    data: users || [],
    columns: getColumns(deleteUser),
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
          filterTypes={userFilters}
          filters={filters}
          setFilters={setFilters}
          acessorKeyLabels={acessorKeyLabels}
        >
          <DatatableCreateButton
            href="/admin/access/users/create"
            disabled={isLoading}
            requiredPermission="users"
          />
        </DataTableAdvancedToolbar>
      </DataTable>
    </div>
  );
};

export default UsersTable;
