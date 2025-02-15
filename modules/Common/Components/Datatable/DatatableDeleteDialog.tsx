/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DatatableDeleteDialogProps {
  item: any;
  deleteAction: (item: any) => void;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const DatatableDeleteDialog: React.FC<DatatableDeleteDialogProps> = ({
  deleteAction,
  isOpen,
  setIsOpen,
  item,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function deleteItem() {
    setIsLoading(true);
    try {
      await deleteAction(item);
    } catch (e: unknown) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={isOpen ? () => setIsOpen(false) : () => setIsOpen(true)}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            Essa ação não pode ser desfeita. Tem certeza de que deseja
            permanentemente excluir este item de nosso sistema?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteItem()}
            disabled={isLoading}
            className={cn(buttonVariants({ variant: "destructive" }))}
          >
            Deletar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DatatableDeleteDialog;
