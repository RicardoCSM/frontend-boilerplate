"use client";

import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoaderCircle, Pencil, X } from "lucide-react";
import QuestionnairesGroup from "@/modules/Questionnaires/Interfaces/QuestionnairesGroup";
import Icon from "@/modules/Common/Components/RootLayout/_partials/Icon";
import { Textarea } from "@/components/ui/textarea";
import {
  QuestionnairesGroupSchema,
  questionnairesGroupSchema,
} from "@/modules/Questionnaires/Lib/Validations/questionnairesGroup";
import IconsCombobox from "@/modules/Common/Components/RootLayout/_partials/IconsCombobox";
import questionnairesGroupsService from "@/modules/Questionnaires/Services/questionnairesGroups.service";
import { toast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useAuth from "@/modules/Auth/Hooks/useAuth";
import DeleteQuestionnairesGroupDialog from "../../Dialogs/DeleteQuestionnairesGroupDialog";
import { isAxiosError } from "@/lib/utils";
import { ApiError } from "@/modules/Common/Interfaces/ApiError";

interface QuestionnairesGroupGeneralInfoProps {
  selectedQuestionnairesGroup: QuestionnairesGroup;
  refreshQuestionnairesGroups: (
    setFirstItemAsSelected?: boolean,
  ) => Promise<void>;
  setSelectedQuestionnairesGroup: (group: QuestionnairesGroup | null) => void;
}

const QuestionnairesGroupGeneralInfo: React.FC<
  QuestionnairesGroupGeneralInfoProps
> = ({
  selectedQuestionnairesGroup,
  refreshQuestionnairesGroups,
  setSelectedQuestionnairesGroup,
}) => {
    const { userData } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [edit, setEdit] = useState(false);

    function toggleEdit() {
      setEdit(!edit);
    }

    const form = useForm<QuestionnairesGroupSchema>({
      resolver: zodResolver(questionnairesGroupSchema),
      defaultValues: {
        title: selectedQuestionnairesGroup.title || "",
        description: selectedQuestionnairesGroup.description || "",
        icon: selectedQuestionnairesGroup.icon || "",
        active: selectedQuestionnairesGroup.active || false,
      },
    });

    useEffect(() => {
      form.setValue("title", selectedQuestionnairesGroup.title || "");
      form.setValue("icon", selectedQuestionnairesGroup.icon || "");
      form.setValue("description", selectedQuestionnairesGroup.description || "");
      form.setValue("active", selectedQuestionnairesGroup.active || false);
    }, [selectedQuestionnairesGroup, form]);

    const onSubmit = async (values: QuestionnairesGroupSchema) => {
      setIsLoading(true);
      try {
        const updatedData = Object.fromEntries(
          Object.entries(values).filter(
            ([key, value]) =>
              value !==
              selectedQuestionnairesGroup[key as keyof QuestionnairesGroup],
          ),
        ) as Partial<QuestionnairesGroupSchema>;

        const response = await questionnairesGroupsService.update(
          selectedQuestionnairesGroup.id,
          updatedData,
        );

        if (response.status === 200) {
          await refreshQuestionnairesGroups();
          setSelectedQuestionnairesGroup(response.data);
          toast({
            title: "Grupo de questionários atualizado com sucesso",
          });
          toggleEdit();
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

    if (edit) {
      return (
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-2 rounded-md pt-1">
                <div className="grid grid-cols-6 lg:grid-cols-8 gap-2">
                  <IconsCombobox displayLabel={false} disabled={isLoading} />
                  <div className="flex col-span-5 lg:col-span-7 gap-2 items-center">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <Input
                              {...field}
                              disabled={isLoading}
                              error={form.formState.errors.title}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <X onClick={toggleEdit} className="size-5 cursor-pointer" />
                  </div>
                </div>
                <div className="flex flex-col xl:flex-row items-center gap-2">
                  <div className="grid w-full xl:grid-cols-4 gap-2">
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="xl:col-span-3">
                          <FormControl>
                            <Textarea
                              {...field}
                              disabled={isLoading}
                              rows={3}
                              error={form.formState.errors.description}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="active"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel>Status</FormLabel>
                            <FormDescription>
                              Selecione se o grupo de questionários está ativo ou não
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button
                    size="sm"
                    variant="tenantPrimary"
                    className="h-9 w-40"
                    type="submit"
                  >
                    {isLoading && (
                      <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Salvar Informações
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </>
      );
    }

    return (
      <div className="flex flex-col">
        <h3 className="flex justify-between scroll-m-20 items-center gap-1 font-semibold text-xl md:text-3xl tracking-tight">
          <span className="flex items-center">
            {selectedQuestionnairesGroup.icon && (
              <span>
                <Icon
                  name={selectedQuestionnairesGroup.icon}
                  className="size-6 mr-2"
                />{" "}
              </span>
            )}
            {selectedQuestionnairesGroup.title || ""}
          </span>
          <span className="flex items-center gap-2">
            {selectedQuestionnairesGroup.active && (
              <Badge variant="tenantPrimary">Ativo</Badge>
            )}
            {!selectedQuestionnairesGroup.active && (
              <Badge variant="destructive">Inativo</Badge>
            )}
            {userData?.permissions.includes(
              "ALL-edit-questionnaires-groups",
            ) && (
                <Tooltip>
                  <TooltipTrigger>
                    <Pencil
                      onClick={toggleEdit}
                      className="size-5 mb-1 ml-1 cursor-pointer"
                    />
                  </TooltipTrigger>
                  <TooltipContent>Editar</TooltipContent>
                </Tooltip>
              )}
            {userData?.permissions.includes(
              "ALL-delete-questionnaires-groups",
            ) &&
              !selectedQuestionnairesGroup.active && (
                <DeleteQuestionnairesGroupDialog
                  selectedQuestionnairesGroup={selectedQuestionnairesGroup}
                  setSelectedQuestionnairesGroup={setSelectedQuestionnairesGroup}
                  refreshQuestionnairesGroups={refreshQuestionnairesGroups}
                />
              )}
          </span>{" "}
        </h3>
        <p className="text-tenant-primary text-md ">
          {selectedQuestionnairesGroup.description || ""}
        </p>
      </div>
    );
  };

export default QuestionnairesGroupGeneralInfo;
