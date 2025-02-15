"use client";

import * as React from "react";
import { type Table } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { DataTableViewOptions } from "./DatatableViewOptions";
import DatatableSearch from "./DatatableSearch";
import { AdvancedFilter, Filter } from "../../Interfaces/Filter";
import { FilterList } from "../RootLayout/_partials/FilterList";

interface DataTableAdvancedToolbarProps<TData>
  extends React.HTMLAttributes<HTMLDivElement> {
  table: Table<TData>;
  isLoading: boolean;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  filters?: Filter[];
  setFilters?: React.Dispatch<React.SetStateAction<Filter[]>>;
  filterTypes?: AdvancedFilter<TData>[];
  acessorKeyLabels?: Record<string, string>;
  showDataViewOptions?: boolean;
}

export function DataTableAdvancedToolbar<TData>({
  table,
  children,
  className,
  isLoading,
  search,
  setSearch,
  filterTypes,
  filters,
  setFilters,
  acessorKeyLabels,
  ...props
}: DataTableAdvancedToolbarProps<TData>) {
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row w-full items-center justify-between gap-2 overflow-auto p-1",
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        <DatatableSearch
          search={search}
          setSearch={setSearch}
          isLoading={isLoading}
        />
        {filterTypes && filters && setFilters && (
          <FilterList
            filterTypes={filterTypes}
            filters={filters}
            setFilters={setFilters}
            isLoading={isLoading}
          />
        )}
      </div>
      <div className="flex items-center gap-2">
        {acessorKeyLabels && (
          <DataTableViewOptions
            table={table}
            isLoading={isLoading}
            acessorKeyLabels={acessorKeyLabels}
          />
        )}
        {children}
      </div>
    </div>
  );
}
