"use client";

import { Button } from "@/components/ui/button";
import { ColorPickerInput } from "@/components/ui/color-picker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { ThemeSchema, themeSchema } from "../../Lib/Validations/themes";
import SelectThemeFormFields from "./_partials/SelectThemeFormFields";
import ImageDropzone from "./_partials/ImageDropzone";
import supportService from "@/modules/Common/Services/support.service";
import themesService from "../../Services/themes.service";
import Theme from "../../Interfaces/Theme";
import useAuth from "@/modules/Auth/Hooks/useAuth";
import { LoaderCircle } from "lucide-react";
import { isAxiosError } from "@/lib/utils";
import { ApiError } from "@/modules/Common/Interfaces/ApiError";

interface CreateThemeFormProps {
  refreshThemes: (setFirstItemAsSelected?: boolean) => Promise<void>;
  setSelectedTheme: (theme: Theme | null) => void;
  setSelectedMode: Dispatch<SetStateAction<"view" | "edit" | "create">>;
}

const CreateThemeForm: React.FC<CreateThemeFormProps> = ({
  refreshThemes,
  setSelectedTheme,
  setSelectedMode,
}) => {
  const { userData } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");
  const form = useForm<ThemeSchema>({
    resolver: zodResolver(themeSchema),
    defaultValues: {
      title: "",
      primary_color_light: "#FFFFFF",
      secondary_color_light: "#FFFFFF",
      primary_color_dark: "#FFFFFF",
      secondary_color_dark: "#FFFFFF",
      institutional_website_url: "",
      app_store_url: "",
      google_play_url: "",
    },
  });

  const onSubmit = async (values: ThemeSchema) => {
    setIsLoading(true);
    try {
      const themeData = supportService.removeEmptyValues(values);
      const response = await themesService.store(themeData);
      if (response.status === 201) {
        await refreshThemes();
        if (userData?.permissions.includes("ALL-edit-themes")) {
          setSelectedMode("edit");
        } else if (userData?.permissions.includes("ALL-view-themes")) {
          setSelectedMode("view");
        }
        setSelectedTheme(response.data);
        toast({
          title: "Tema criado com sucesso.",
          description: "O tema foi criado com sucesso.",
          variant: "success",
        });
      }
    } catch (e: unknown) {
      if (isAxiosError<ApiError>(e)) {
        if (e.response?.data.errors) {
          Object.entries(e.response.data.errors).forEach(([key, value]) => {
            form.setError(key as keyof ThemeSchema, {
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
    <div className="flex flex-col grow justify-between">
      <div className="flex flex-col space-y-6">
        <Form {...form}>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
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
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 space-y-6 md:space-y-0 md:gap-6">
            <SelectThemeFormFields
              themeMode={themeMode}
              setThemeMode={setThemeMode}
            />
            <React.Fragment key={themeMode}>
              {themeMode === "light" ? (
                <FormField
                  control={form.control}
                  name="primary_logo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Logo Primária</FormLabel>
                      <FormControl>
                        <ImageDropzone
                          {...field}
                          disabled={isLoading}
                          field={field.name}
                          dropMessage={
                            <div className="flex w-full justify-center text-center text-[0.8rem] text-muted-foreground">
                              <span className="w-1/2">
                                Arraste e solte o arquivo aqui ou clique para
                                fazer o upload
                              </span>
                            </div>
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <FormField
                  control={form.control}
                  name="contrast_primary_logo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Logo Primária (contraste)</FormLabel>
                      <FormControl>
                        <ImageDropzone
                          {...field}
                          disabled={isLoading}
                          field={field.name}
                          dropMessage={
                            <div className="flex w-full justify-center text-center text-[0.8rem] text-muted-foreground">
                              <span className="w-1/2">
                                Arraste e solte o arquivo aqui ou clique para
                                fazer o upload
                              </span>
                            </div>
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <div className="grid grid-cols-2 gap-6 col-span-2 2xl:col-span-1">
                {themeMode === "light" ? (
                  <FormField
                    control={form.control}
                    name="reduced_logo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Logo contraída</FormLabel>
                        <FormControl>
                          <ImageDropzone
                            {...field}
                            field={field.name}
                            {...field}
                            dropMessage={
                              <div className="text-center text-[0.8rem] text-muted-foreground">
                                Arraste e solte o arquivo aqui ou clique para
                                fazer o upload
                              </div>
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <FormField
                    control={form.control}
                    name="contrast_reduced_logo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Logo contraída (contraste)</FormLabel>
                        <FormControl>
                          <ImageDropzone
                            {...field}
                            field={field.name}
                            {...field}
                            dropMessage={
                              <div className="text-center text-[0.8rem] text-muted-foreground">
                                Arraste e solte o arquivo aqui ou clique para
                                fazer o upload
                              </div>
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name="favicon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Favicon</FormLabel>
                      <FormControl>
                        <ImageDropzone
                          {...field}
                          disabled={isLoading}
                          field={field.name}
                          dropMessage={
                            <div className="text-center text-[0.8rem] text-muted-foreground">
                              Arraste e solte o arquivo aqui ou clique para
                              fazer o upload
                            </div>
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </React.Fragment>
          </div>
          {themeMode === "light" ? (
            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="primary_color_light"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cor primária clara</FormLabel>
                    <FormControl>
                      <ColorPickerInput
                        color={field.value}
                        onColorChange={(color) => {
                          field.onChange(color);
                        }}
                        error={form.formState.errors.primary_color_light}
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="secondary_color_light"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cor secundária clara</FormLabel>
                    <FormControl>
                      <ColorPickerInput
                        color={field.value}
                        onColorChange={(color) => {
                          field.onChange(color);
                        }}
                        error={form.formState.errors.secondary_color_light}
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="primary_color_dark"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cor primária escura</FormLabel>
                      <FormControl>
                        <ColorPickerInput
                          color={field.value}
                          onColorChange={(color) => {
                            field.onChange(color);
                          }}
                          error={form.formState.errors.primary_color_dark}
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="secondary_color_dark"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cor secundária escura</FormLabel>
                      <FormControl>
                        <ColorPickerInput
                          color={field.value}
                          onColorChange={(color) => {
                            field.onChange(color);
                          }}
                          error={form.formState.errors.secondary_color_dark}
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}
          <div className="grid lg:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="institutional_website_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL do site institucional</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      error={form.formState.errors.institutional_website_url}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="app_store_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL da App Store</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      error={form.formState.errors.app_store_url}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="google_play_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL da Play Store</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      error={form.formState.errors.google_play_url}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Form>
      </div>
      <div className="flex w-full justify-center p-4">
        <Button
          variant="tenantPrimary"
          size="lg"
          onClick={form.handleSubmit(onSubmit)}
          disabled={isLoading}
        >
          {isLoading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
          Criar tema
        </Button>
      </div>
    </div>
  );
};

export default CreateThemeForm;
