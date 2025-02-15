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
import { buttonVariants } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { cn, isAxiosError } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import questionnairesService from "../../Services/questionnaires.service";
import Questionnaire from "../../Interfaces/Questionnaire";
import { ApiError } from "@/modules/Common/Interfaces/ApiError";

interface DeleteQuestionnairesDialogProps {
  questionnaire: Questionnaire;
  refreshQuestionnaires: () => void;
}

const DeleteQuestionnairesDialog: React.FC<DeleteQuestionnairesDialogProps> = ({
  questionnaire,
  refreshQuestionnaires,
}) => {
  const deleteQuestionnaire = async () => {
    try {
      const response = await questionnairesService.delete(questionnaire.id);
      if (response.status === 204) {
        await refreshQuestionnaires();
        toast({
          title: "Questionário deletado com sucesso.",
          description: "O questionário foi deletado com sucesso.",
        });
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

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Tooltip>
          <TooltipTrigger>
            <Trash className="size-4 cursor-pointer text-destructive" />
          </TooltipTrigger>
          <TooltipContent>Deletar</TooltipContent>
        </Tooltip>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Tem certeza que deseja deletar o questionário?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não poderá ser desfeita. Deseja continuar?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            className={cn(buttonVariants({ variant: "destructive" }))}
            onClick={deleteQuestionnaire}
          >
            Continuar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteQuestionnairesDialog;
