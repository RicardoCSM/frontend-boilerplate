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
import { FilePlus, LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import QuestionnairesGroup from "../../Interfaces/QuestionnairesGroup";
import React, { useState } from "react";
import {
  QuestionnairesSchema,
  questionnairesSchema,
} from "../../Lib/Validations/questionnaires";
import { zodResolver } from "@hookform/resolvers/zod";
import IconsCombobox from "@/modules/Common/Components/RootLayout/_partials/IconsCombobox";
import { toast } from "@/hooks/use-toast";
import supportService from "@/modules/Common/Services/support.service";
import questionnairesService from "../../Services/questionnaires.service";
import { useRouter } from "next/navigation";
import { isAxiosError } from "@/lib/utils";
import { ApiError } from "@/modules/Common/Interfaces/ApiError";

interface CreateQuestionnaireDialogProps {
  selectedQuestionnairesGroup: QuestionnairesGroup;
}

const CreateQuestionnaireDialog: React.FC<CreateQuestionnaireDialogProps> = ({
  selectedQuestionnairesGroup,
}) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<QuestionnairesSchema>({
    resolver: zodResolver(questionnairesSchema),
    defaultValues: {
      title: "",
      description: "",
      icon: "",
    },
  });

  const onSubmit = async (values: QuestionnairesSchema) => {
    setIsLoading(true);
    try {
      const data = supportService.removeEmptyValues(values);
      const response = await questionnairesService.store({
        ...data,
        questionnaires_group_id: selectedQuestionnairesGroup.id,
      });

      if (response.status === 201) {
        form.reset();
        toast({
          title: "Questionário adicionado com sucesso",
        });
        router.push(`/admin/questionnaires/builder/${response.data.id}`);
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
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="group border border-tenant-primary/20 h-[190px] items-center justify-center flex flex-col hover:border-tenant-primary hover:cursor-pointer border-dashed gap-4"
        >
          <FilePlus className="size-8 text-tenant-primary/80 group-hover:text-tenant-primary" />
          <p className="font-bold text-xl text-tenant-primary/80 group-hover:text-tenant-primary">
            Criar questionário
          </p>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar questionário</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para criar um novo questionário.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-6 gap-2">
              <IconsCombobox disabled={isLoading} />
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
                        disabled={isLoading}
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
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
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
            Criar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateQuestionnaireDialog;
