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
import { LoaderCircle, PlusCircleIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  QuestionnairesGroupSchema,
  questionnairesGroupSchema,
} from "../../Lib/Validations/questionnairesGroup";
import IconsCombobox from "@/modules/Common/Components/RootLayout/_partials/IconsCombobox";
import { zodResolver } from "@hookform/resolvers/zod";
import supportService from "@/modules/Common/Services/support.service";
import questionnairesGroupsService from "../../Services/questionnairesGroups.service";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import QuestionnairesGroup from "../../Interfaces/QuestionnairesGroup";
import { isAxiosError } from "@/lib/utils";
import { ApiError } from "@/modules/Common/Interfaces/ApiError";

interface CreateQuestionnairesGroupDialogProps {
  refreshQuestionnairesGroups: (
    setFirstItemAsSelected?: boolean,
  ) => Promise<void>;
  setSelectedQuestionnairesGroup: (group: QuestionnairesGroup) => void;
}

const CreateQuestionnairesGroupDialog: React.FC<
  CreateQuestionnairesGroupDialogProps
> = ({ refreshQuestionnairesGroups, setSelectedQuestionnairesGroup }) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<QuestionnairesGroupSchema>({
    resolver: zodResolver(questionnairesGroupSchema),
    defaultValues: {
      title: "",
      description: "",
      icon: "",
    },
  });

  const onSubmit = async (values: QuestionnairesGroupSchema) => {
    setIsLoading(true);
    try {
      const data = supportService.removeEmptyValues(values);
      const response = await questionnairesGroupsService.store(data);

      if (response.status === 201) {
        await refreshQuestionnairesGroups();
        setSelectedQuestionnairesGroup(response.data);
        form.reset();
        setOpen(false);
        toast({
          title: "Grupo de questionários adicionado com sucesso",
        });
      }
    } catch (e: unknown) {
      if (isAxiosError<ApiError>(e)) {
        if (e.response?.data.errors) {
          Object.entries(e.response.data.errors).forEach(([key, value]) => {
            form.setError(key as keyof QuestionnairesGroupSchema, {
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
          type="button"
          variant="tenantPrimary"
          className="w-full text-left"
        >
          <PlusCircleIcon className="size-4 mr-2" />
          <h2>Adicionar grupo de questionários</h2>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar grupo de questionários</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para criar um novo grupo de questionários.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-6 gap-2 items-end">
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

export default CreateQuestionnairesGroupDialog;
