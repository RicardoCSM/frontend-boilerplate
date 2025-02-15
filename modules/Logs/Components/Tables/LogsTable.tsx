"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "@/hooks/use-toast";
import AccessLog from "../../Interfaces/AccessLog";
import accessLogsService from "../../Services/accessLogs.service";
import {
  getCoreRowModel,
  getPaginationRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { DataTable } from "@/modules/Common/Components/Datatable/Datatable";
import { DataTableAdvancedToolbar } from "@/modules/Common/Components/Datatable/DatatableAdvancedToolbar";
import { AdvancedFilter, Filter } from "@/modules/Common/Interfaces/Filter";
import DatePickerWithRange from "@/components/ui/date-range";
import { acessorKeyLabels, columns } from "./_partials/LogsTableColumns";
import { DateRange } from "@/modules/Common/Interfaces/DateRange";
import { isAxiosError } from "@/lib/utils";
import { ApiError } from "@/modules/Common/Interfaces/ApiError";

const LogsTable = () => {
  const [logs, setAccessLogs] = useState<AccessLog[] | null>(null);
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
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [filters, setFilters] = useState<Filter[]>([]);

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await accessLogsService.index(
        {
          per_page: pagination.pageSize,
          page: pagination.pageIndex + 1,
          search: search,
          sort_field: sorting[0].id,
          sort_order: sorting[0].desc ? "desc" : "asc",
          log: isFirstRender.current ? true : false,
          start_date: dateRange?.start_date,
          end_date: dateRange?.end_date,
        },
        filters,
      );
      const response = res.data;
      setAccessLogs(response.data);
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
  }, [search, pagination, sorting, dateRange, filters]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const table = useReactTable<AccessLog>({
    data: logs || [],
    columns: columns,
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

  const filterList: AdvancedFilter<AccessLog>[] = [
    {
      id: "action",
      label: "Tipo",
      type: "select",
      options: [
        { value: "LOGGED_IN", label: "Login" },
        { value: "LOGGED_OUT", label: "Logout" },
        { value: "VIEWED_DATATABLE", label: "Tabela" },
      ],
    },
    {
      id: "module",
      label: "Módulo",
      type: "select",
      options: [
        { value: "auth", label: "Autenticação" },
        { value: "users", label: "Usuários" },
        { value: "roles", label: "Grupos" },
        { value: "cecad", label: "Cecad" },
        { value: "social_benefits", label: "Benefícios sociais" },
        { value: "access_logs", label: "Logs de acesso" },
      ],
    },
  ];

  return (
    <div className="flex flex-1 py-6 md:px-4">
      <DataTable table={table} isLoading={isLoading}>
        <DataTableAdvancedToolbar
          table={table}
          isLoading={isLoading}
          search={search}
          setSearch={setSearch}
          filterTypes={filterList}
          filters={filters}
          setFilters={setFilters}
          acessorKeyLabels={acessorKeyLabels}
        >
          <DatePickerWithRange
            input={false}
            setDateRange={setDateRange}
            disabled={isLoading}
            isDatePickerOpen={isDatePickerOpen}
            setIsDatePickerOpen={setIsDatePickerOpen}
          />
        </DataTableAdvancedToolbar>
      </DataTable>
    </div>
  );
};

export default LogsTable;
