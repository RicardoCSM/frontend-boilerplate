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
import themesService from "../../Services/themes.service";
import Theme from "../../Interfaces/Theme";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ApiError } from "@/modules/Common/Interfaces/ApiError";

interface DeleteThemeDialogProps {
  selectedTheme: Theme;
  setSelectedTheme: (group: Theme | null) => void;
  refreshThemes: (setFirstItemAsSelected?: boolean) => Promise<void>;
}

const DeleteThemeDialog: React.FC<DeleteThemeDialogProps> = ({
  selectedTheme,
  setSelectedTheme,
  refreshThemes,
}) => {
  const deleteTheme = async () => {
    try {
      const response = await themesService.delete(selectedTheme.id);
      if (response.status === 204) {
        setSelectedTheme(null);
        await refreshThemes(true);
        toast({
          title: "Tema deletado com sucesso.",
          description: "O tema foi deletado com sucesso.",
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
            Tem certeza que deseja deletar o tema?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não poderá ser desfeita. Deseja continuar?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            className={cn(buttonVariants({ variant: "destructive" }))}
            onClick={deleteTheme}
          >
            Continuar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteThemeDialog;
