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
import { BookMinus, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

interface QuestionnaireDetailsDeactivateFormProps {
  id: string;
}

const QuestionnaireDetailsDeactivateForm: React.FC<
  QuestionnaireDetailsDeactivateFormProps
> = ({ id }) => {
  const router = useRouter();
  const [isLoading, startTransition] = useTransition();

  const activateQuestionnaire = async () => {
    try {
      await questionnairesService.update(id, {
        active: false,
      });
      toast({
        title: "Questionário desativado com sucesso.",
        description:
          "O questionário foi desativado e está disponível para edição.",
      });
      router.push(`/admin/questionnaires/builder/${id}`);
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
          <BookMinus className="mr-2 size-4" />
          Desativar
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Você tem certeza que deseja desativar este questionário?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Ao desativar o questionário, ele será removido do grupo de
            questionários ativos e não estará mais disponível para coleta de
            respostas. <br />
            <span className="font-medium">
              As respostas já coletadas não serão perdidas e você poderá
              reativar o questionário a qualquer momento.
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
              className={cn(buttonVariants({ variant: "destructive" }))}
            >
              {isLoading && (
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              )}
              Desativar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default QuestionnaireDetailsDeactivateForm;
