/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Eye, Pen, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import React, { useState } from "react";
import DatatableDeleteDialog from "./DatatableDeleteDialog";
import useAuth from "@/modules/Auth/Hooks/useAuth";

interface DatatableItemActionsProps {
  baseUrl: string;
  item: any;
  deleteAction?: (item: any) => void;
  actions: string[];
  requiredPermission: string;
}

const DatatableItemActions: React.FC<DatatableItemActionsProps> = ({
  baseUrl,
  deleteAction,
  item,
  actions,
  requiredPermission,
}) => {
  const { userData } = useAuth();
  const [isDatatableDeleteDialogOpen, setIsDatatableDeleteDialogOpen] =
    useState(false);

  return (
    <>
      <div className="flex gap-1 justify-end">
        {userData?.permissions.includes(`ALL-view-${requiredPermission}`) &&
          actions.includes("view") && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  aria-haspopup="true"
                  size="smIcon"
                  variant="ghost"
                  asChild
                >
                  <Link href={`${baseUrl}/view`}>
                    <Eye className="h-5 w-5 cursor-pointer text-cyan-700 dark:text-cyan-900" />
                    <span className="sr-only">Visualizar</span>
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Visualizar</p>
              </TooltipContent>
            </Tooltip>
          )}
        {userData?.permissions.includes(`ALL-edit-${requiredPermission}`) &&
          userData?.permissions.includes(
            `ALL-view-${requiredPermission}`,
          ) &&
          actions.includes("edit") && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button aria-haspopup="true" size="smIcon" variant="ghost">
                  <Link href={`${baseUrl}/edit`}>
                    <Pen className="h-5 w-5 cursor-pointer text-green-700 dark:text-green-900" />
                    <span className="sr-only">Editar</span>
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Editar</p>
              </TooltipContent>
            </Tooltip>
          )}
        {userData?.permissions.includes(
          `ALL-delete-${requiredPermission}`,
        ) &&
          actions.includes("delete") && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  aria-haspopup="true"
                  size="smIcon"
                  variant="ghost"
                  onClick={() => setIsDatatableDeleteDialogOpen(true)}
                >
                  <Trash className="h-5 w-5 cursor-pointer text-red-700 dark:text-red-900" />
                  <span className="sr-only">Deletar</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Deletar</p>
              </TooltipContent>
            </Tooltip>
          )}
      </div>
      {deleteAction && (
        <DatatableDeleteDialog
          item={item}
          isOpen={isDatatableDeleteDialogOpen}
          setIsOpen={setIsDatatableDeleteDialogOpen}
          deleteAction={deleteAction}
        />
      )}
    </>
  );
};

export default DatatableItemActions;
