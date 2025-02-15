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
import { toast } from "@/hooks/use-toast";
import { cn, isAxiosError } from "@/lib/utils";
import { ApiError } from "@/modules/Common/Interfaces/ApiError";
import questionnairesService from "@/modules/Questionnaires/Services/questionnaires.service";
import { BookPlus, LoaderCircle } from "lucide-react";
import { useTransition } from "react";

interface QuestionnaireBuilderActivateDialogProps {
  id: string;
}

const QuestionnaireBuilderActivateDialog: React.FC<
  QuestionnaireBuilderActivateDialogProps
> = ({ id }) => {
  const [isLoading, startTransition] = useTransition();

  const activateQuestionnaire = async () => {
    try {
      await questionnairesService.update(id, {
        active: true,
      });
      toast({
        title: "Questionário ativado com sucesso.",
        description:
          "O questionário foi ativado e está disponível para coleta de respostas.",
      });
      window.location.reload();
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
        <Button variant="tenantSecondary">
          <BookPlus className="mr-2 size-4" />
          Ativar
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Você tem certeza que deseja ativar este questionário?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Você poderá desativá-lo a qualquer momento se necessário realizar
            alterações. <br />
            <span className="font-medium">
              Ao ativar o questionário, ele será adicionado ao grupo de
              questionários ativos e estará disponível para coleta de respostas.
            </span>
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              disabled={isLoading}
              onClick={(e) => {
                e.preventDefault();
                startTransition(activateQuestionnaire);
              }}
              className={cn(buttonVariants({ variant: "tenantPrimary" }))}
            >
              {isLoading && (
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              )}
              Ativar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default QuestionnaireBuilderActivateDialog;
