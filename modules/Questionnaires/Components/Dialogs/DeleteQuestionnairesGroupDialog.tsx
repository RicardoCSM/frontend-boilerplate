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
import questionnairesGroupsService from "../../Services/questionnairesGroups.service";
import QuestionnairesGroup from "../../Interfaces/QuestionnairesGroup";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ApiError } from "@/modules/Common/Interfaces/ApiError";

interface DeleteQuestionnairesGroupDialogProps {
  selectedQuestionnairesGroup: QuestionnairesGroup;
  setSelectedQuestionnairesGroup: (group: QuestionnairesGroup | null) => void;
  refreshQuestionnairesGroups: (
    setFirstItemAsSelected?: boolean,
  ) => Promise<void>;
}

const DeleteQuestionnairesGroupDialog: React.FC<
  DeleteQuestionnairesGroupDialogProps
> = ({
  selectedQuestionnairesGroup,
  setSelectedQuestionnairesGroup,
  refreshQuestionnairesGroups,
}) => {
    const deleteQuestionnairesGroup = async () => {
      try {
        const response = await questionnairesGroupsService.delete(
          selectedQuestionnairesGroup.id,
        );
        if (response.status === 204) {
          setSelectedQuestionnairesGroup(null);
          await refreshQuestionnairesGroups(true);
          toast({
            title: "Grupo deletado com sucesso.",
            description: "O grupo de questionários foi deletado com sucesso.",
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
              <Trash className="size-5 mb-1 ml-1 cursor-pointer text-destructive" />
            </TooltipTrigger>
            <TooltipContent>Deletar</TooltipContent>
          </Tooltip>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Tem certeza que deseja deletar o grupo?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não poderá ser desfeita. Deseja continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className={cn(buttonVariants({ variant: "destructive" }))}
              onClick={deleteQuestionnairesGroup}
            >
              Continuar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };

export default DeleteQuestionnairesGroupDialog;
