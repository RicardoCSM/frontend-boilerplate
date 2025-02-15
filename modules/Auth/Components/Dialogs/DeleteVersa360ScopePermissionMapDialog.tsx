"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Versa360Scope } from "../../Interfaces/Versa360Client";
import { cn, isAxiosError } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import versa360Service from "../../Services/versa360.service";
import { ApiError } from "@/modules/Common/Interfaces/ApiError";

interface DeleteVersa360ScopePermissionMapDialogProps {
  selectedVersa360Scope: Versa360Scope;
  refreshVersa360ScopePermissionMap: () => void;
}

const DeleteVersa360ScopePermissionMapDialog: React.FC<
  DeleteVersa360ScopePermissionMapDialogProps
> = ({ selectedVersa360Scope, refreshVersa360ScopePermissionMap }) => {
  const deleteVersa360ScopePermissionMap = async () => {
    try {
      await versa360Service.delete(selectedVersa360Scope.id);
      refreshVersa360ScopePermissionMap();
      toast({
        title: "Configuração removida.",
        description: "A configuração foi removida com sucesso.",
      });
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

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          <Trash className="size-4 mr-2" />
          Remover configuração
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Tem certeza que deseja remover a configuração?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não poderá ser desfeita. Deseja continuar?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            className={cn(buttonVariants({ variant: "destructive" }))}
            onClick={deleteVersa360ScopePermissionMap}
          >
            Continuar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteVersa360ScopePermissionMapDialog;
