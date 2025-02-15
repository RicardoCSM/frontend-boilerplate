"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "@/hooks/use-toast";
import {
  getCoreRowModel,
  getPaginationRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { DataTable } from "@/modules/Common/Components/Datatable/Datatable";
import { isAxiosError } from "@/lib/utils";
import { ApiError } from "@/modules/Common/Interfaces/ApiError";
import QuestionnaireResponse from "../../Interfaces/QuestionnaireResponse";
import questionnaireResponsesService from "../../Services/questionnaireResponsesService";
import Questionnaire from "../../Interfaces/Questionnaire";
import { columns } from "./_partials/QuestionnaireResponsesTableColumns";

interface QuestionnaireResponsesTableProps {
  questionnaire: Questionnaire;
}

const QuestionnaireResponsesTable: React.FC<
  QuestionnaireResponsesTableProps
> = ({ questionnaire }) => {
  const [users, setResponses] = useState<QuestionnaireResponse[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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

  const fetchQuestionnaireResponses = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await questionnaireResponsesService.index(
        {
          per_page: pagination.pageSize,
          page: pagination.pageIndex + 1,
          sort_field: sorting[0].id,
          sort_order: sorting[0].desc ? "desc" : "asc",
        },
        [
          {
            key: "questionnaire_id",
            value: questionnaire.id,
          },
          {
            key: "version",
            value: questionnaire.version.toString(),
          },
        ],
      );
      const response = res.data;
      setResponses(response.data);
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
  }, [pagination, sorting, questionnaire]);

  useEffect(() => {
    fetchQuestionnaireResponses();
  }, [fetchQuestionnaireResponses]);

  const table = useReactTable<QuestionnaireResponse>({
    data: users || [],
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

  return (
    <div className="flex flex-1 py-6 md:px-4">
      <DataTable table={table} isLoading={isLoading} />
    </div>
  );
};

export default QuestionnaireResponsesTable;
