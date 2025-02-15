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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Eye, LoaderCircle, Pencil } from "lucide-react";
import { useForm } from "react-hook-form";
import React, { ChangeEvent, useState } from "react";
import { AdsSchema, adsSchema } from "../../Lib/Validations/ads";
import { Input } from "@/components/ui/input";
import DatePickerWithRange from "@/components/ui/date-range";
import { toast } from "@/hooks/use-toast";
import adsService from "../../Services/ads.service";
import { zodResolver } from "@hookform/resolvers/zod";
import Ads from "../../Interfaces/Ads";
import { Switch } from "@/components/ui/switch";
import { isAxiosError } from "@/lib/utils";
import { ApiError } from "@/modules/Common/Interfaces/ApiError";

interface AdsActionsDialogProps {
  ads: Ads;
  refreshAds: () => Promise<void>;
  mode: "edit" | "view";
}

const AdsActionsDialog: React.FC<AdsActionsDialogProps> = ({
  ads,
  refreshAds,
  mode,
}) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<AdsSchema>({
    resolver: zodResolver(adsSchema),
    defaultValues: {
      background_image: undefined,
      button_text: ads.button_text || "",
      button_url: ads.button_url || "",
      start_date: ads.start_date || "",
      end_date: ads.end_date || "",
      active: ads.active || false,
    },
  });

  const onSubmit = async (values: AdsSchema) => {
    setIsLoading(true);
    try {
      const updatedData = Object.fromEntries(
        Object.entries(values).filter(
          ([key, value]) => value !== ads[key as keyof Ads],
        ),
      ) as Partial<AdsSchema>;

      const response = await adsService.update(ads.id, updatedData);
      if (response.status === 200) {
        toast({
          title: "Banner alterado com sucesso!",
        });
        setOpen(false);
        await refreshAds();
      }
    } catch (e: unknown) {
      if (isAxiosError<ApiError>(e)) {
        if (e.response?.data.errors) {
          Object.entries(e.response.data.errors).forEach(([key, value]) => {
            form.setError(key as keyof AdsSchema, {
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
        {mode === "edit" ? (
          <Button variant="tenantPrimary">
            <Pencil className="size-4 mr-2" />
            Editar
          </Button>
        ) : (
          <Button variant="tenantPrimary">
            <Eye className="size-4 mr-2" />
            Visualizar
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Banner de Login</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para criar um novo banner de login.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="background_image"
              render={() => (
                <FormItem>
                  <FormLabel>Imagem de fundo</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      error={form.formState.errors.background_image}
                      disabled={isLoading || mode === "view"}
                      value={undefined}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        if (e.target.files) {
                          form.setValue("background_image", e.target.files[0]);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="button_text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Texto do botão</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      error={form.formState.errors.button_text}
                      disabled={isLoading || mode === "view"}
                      {...form.register("button_text")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="button_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL do botão</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      error={form.formState.errors.button_url}
                      disabled={isLoading || mode === "view"}
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
                      Selecione se o tema está ativo ou não
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isLoading || mode === "view"}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel>Intervalo de datas</FormLabel>
              <FormControl>
                <DatePickerWithRange
                  modal
                  error={form.formState.errors.start_date}
                  disabled={isLoading || mode === "view"}
                  setDateRange={(date) => {
                    if (date && typeof date === "object") {
                      if (date.start_date) {
                        form.setValue("start_date", date.start_date);
                      }
                      if (date.end_date) {
                        form.setValue("end_date", date.end_date);
                      }
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
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
              Salvar alterações
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AdsActionsDialog;
