"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoaderCircle, Pencil } from "lucide-react";
import { useForm } from "react-hook-form";
import React, { useState } from "react";
import {
  QuestionnairesSchema,
  questionnairesSchema,
} from "../../Lib/Validations/questionnaires";
import { zodResolver } from "@hookform/resolvers/zod";
import IconsCombobox from "@/modules/Common/Components/RootLayout/_partials/IconsCombobox";
import Questionnaire from "../../Interfaces/Questionnaire";
import { toast } from "@/hooks/use-toast";
import questionnairesService from "../../Services/questionnaires.service";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { isAxiosError } from "@/lib/utils";
import { ApiError } from "@/modules/Common/Interfaces/ApiError";

interface QuestionnaireActionsDialogProps {
  questionnaire: Questionnaire;
  mode?: "edit" | "view";
  refreshQuestionnaires: () => void;
}

const QuestionnaireActionsDialog: React.FC<QuestionnaireActionsDialogProps> = ({
  questionnaire,
  mode = "view",
  refreshQuestionnaires,
}) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<QuestionnairesSchema>({
    resolver: zodResolver(questionnairesSchema),
    defaultValues: {
      title: questionnaire.title,
      description: questionnaire.description ?? "",
      icon: questionnaire.icon,
    },
  });

  const onSubmit = async (values: QuestionnairesSchema) => {
    setIsLoading(true);
    try {
      const response = await questionnairesService.update(
        questionnaire.id,
        values,
      );
      if (response.status === 200) {
        await refreshQuestionnaires();
        toast({
          title: "Questionário atualizado com sucesso",
        });
      }
    } catch (e: unknown) {
      if (isAxiosError<ApiError>(e)) {
        if (e.response?.data.errors) {
          Object.entries(e.response.data.errors).forEach(([key, value]) => {
            form.setError(key as keyof QuestionnairesSchema, {
              type: "manual",
              message: value,
            });
          });
        }
        toast({
          title: "Algo deu errado.",
          description: e.response?.data.message || "",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Pencil className="size-4 cursor-pointer" />
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>Editar</TooltipContent>
      </Tooltip>
      <DialogContent className="max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit"
              ? "Editar questionário"
              : "Visualizar questionário"}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Edite as informações do questionário"
              : "Visualize as informações do questionário"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-6 gap-2">
              <IconsCombobox disabled={isLoading || mode === "view"} />
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="col-span-5">
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        error={form.formState.errors.title}
                        disabled={isLoading || mode === "view"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={5}
                      {...field}
                      error={form.formState.errors.description}
                      disabled={isLoading || mode === "view"}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        {mode === "edit" && (
          <DialogFooter className="gap-3">
            <DialogClose asChild>
              <Button disabled={isLoading} type="button" variant="outline">
                Cancelar
              </Button>
            </DialogClose>
            <Button
              disabled={isLoading}
              onClick={form.handleSubmit(onSubmit)}
              variant="tenantPrimary"
            >
              {isLoading && (
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              )}
              Editar
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QuestionnaireActionsDialog;
