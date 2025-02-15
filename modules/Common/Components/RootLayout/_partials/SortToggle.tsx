"use client";

import { ArrowDownUp, ArrowUpDown } from "lucide-react";
import React, { SetStateAction } from "react";

interface SortToggleProps {
  fieldName: string;
  sortOrder: string;
  sortField: string;
  setSortOrder: (value: SetStateAction<string>) => void;
  setSortField: (value: SetStateAction<string>) => void;
}

const SortToggle: React.FC<SortToggleProps> = ({
  fieldName,
  sortOrder,
  sortField,
  setSortField,
  setSortOrder,
}) => {
  const toggleSort = (field: string, order: string) => {
    setSortField(field);
    setSortOrder(order);
  };

  return (
    <>
      {sortField == fieldName ? (
        <>
          {sortOrder == "desc" ? (
            <ArrowUpDown
              onClick={() => toggleSort(fieldName, "asc")}
              className="cursor-pointer ml-2 h-4 w-4 text-primary"
            />
          ) : (
            <ArrowDownUp
              onClick={() => toggleSort(fieldName, "desc")}
              className="cursor-pointer ml-2 h-4 w-4 text-primary"
            />
          )}
        </>
      ) : (
        <ArrowUpDown
          onClick={() => toggleSort(fieldName, "desc")}
          className="cursor-pointer ml-2 h-4 w-4"
        />
      )}
    </>
  );
};

export default SortToggle;
