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
import { LoaderCircle, PlusCircleIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import React, { ChangeEvent, useState } from "react";
import { AdsSchema, adsSchema } from "../../Lib/Validations/ads";
import { Input } from "@/components/ui/input";
import DatePickerWithRange from "@/components/ui/date-range";
import { toast } from "@/hooks/use-toast";
import supportService from "@/modules/Common/Services/support.service";
import adsService from "../../Services/ads.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "@/lib/utils";
import { ApiError } from "@/modules/Common/Interfaces/ApiError";

interface CreateAdsDialogProps {
  refreshAds: () => Promise<void>;
}

const CreateAdsDialog: React.FC<CreateAdsDialogProps> = ({ refreshAds }) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<AdsSchema>({
    resolver: zodResolver(adsSchema),
    defaultValues: {
      button_text: "",
      button_url: "",
    },
  });

  const onSubmit = async (values: AdsSchema) => {
    setIsLoading(true);
    try {
      const data = supportService.removeEmptyValues(values);
      const response = await adsService.store(data);

      if (response.status === 201) {
        toast({
          title: "Banner criado com sucesso!",
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
        <div className="flex h-[640px] w-90vh md:w-[583px] justify-center items-center">
          <Button variant="tenantPrimary" size="lg">
            <PlusCircleIcon className="size-5 mr-2" />
            Adicionar novo banner
          </Button>
        </div>
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
                      disabled={isLoading}
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
                      disabled={isLoading}
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
                      disabled={isLoading}
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
                  disabled={isLoading}
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

export default CreateAdsDialog;
