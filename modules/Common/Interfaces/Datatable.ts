import { Dispatch, ReactNode, SetStateAction } from "react";

export interface DatatableHeaderItem {
  fieldName: string;
  label: string;
  hidden?: boolean;
  displaySort?: boolean;
}

export interface DatatableItem {
  id: number | string;
  [key: string]: unknown;
}

export interface DatatableProps {
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  fetchAction: () => void;
  deleteAction?: (item: unknown) => void;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  totalPages: number;
  sortField: string;
  sortOrder: string;
  setSortField: Dispatch<SetStateAction<string>>;
  setSortOrder: Dispatch<SetStateAction<string>>;
  baseUrl?: string;
  headerItems: DatatableHeaderItem[];
  items: DatatableItem[] | null;
  actionsFieldName?: string;
  actions?: string[];
  extra_actions?: ReactNode;
  createLabel?: string;
  requiredPermission: string;
}

export interface Datatable {
  page?: number;
  per_page?: number | string;
  sort_field?: string;
  sort_order?: string;
  search?: string;
  start_date?: string;
  end_date?: string;
  log?: boolean;
}
