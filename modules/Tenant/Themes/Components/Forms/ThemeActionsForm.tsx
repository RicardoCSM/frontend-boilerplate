"use client";

import { Button } from "@/components/ui/button";
import { ColorPickerInput } from "@/components/ui/color-picker";
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
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ThemeSchema, themeSchema } from "../../Lib/Validations/themes";
import Theme from "../../Interfaces/Theme";
import SelectThemeFormFields from "./_partials/SelectThemeFormFields";
import ImageDropzone from "./_partials/ImageDropzone";
import { Switch } from "@/components/ui/switch";
import themesService from "../../Services/themes.service";
import { LoaderCircle } from "lucide-react";
import { isAxiosError } from "@/lib/utils";
import { ApiError } from "@/modules/Common/Interfaces/ApiError";

interface ThemeActionsFormProps {
  theme: Theme;
  mode: "edit" | "view";
  refreshThemes: (setFirstItemAsSelected?: boolean) => Promise<void>;
  setSelectedTheme: (theme: Theme | null) => void;
}

const ThemeActionsForm: React.FC<ThemeActionsFormProps> = ({
  theme,
  mode,
  refreshThemes,
  setSelectedTheme,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");
  const form = useForm<ThemeSchema>({
    resolver: zodResolver(themeSchema),
    defaultValues: {
      title: theme.title || "",
      institutional_website_url: theme.institutional_website_url || "",
      app_store_url: theme.app_store_url || "",
      google_play_url: theme.google_play_url || "",
      primary_color_light: theme.primary_color_light || "#FFFFFF",
      secondary_color_light: theme.secondary_color_light || "#FFFFFF",
      primary_color_dark: theme.primary_color_dark || "#FFFFFF",
      secondary_color_dark: theme.secondary_color_dark || "#FFFFFF",
      active: theme.active || false,
    },
  });

  const onSubmit = async (values: ThemeSchema) => {
    setIsLoading(true);
    try {
      const updatedData = Object.fromEntries(
        Object.entries(values).filter(
          ([key, value]) => value !== theme[key as keyof Theme],
        ),
      ) as Partial<ThemeSchema>;

      const response = await themesService.update(theme.id, updatedData);
      if (response.status === 200) {
        if (values.active) {
          window.location.reload();
        } else {
          await refreshThemes();
          setSelectedTheme(response.data);
          toast({
            title: "Tema ativado com sucesso.",
            description: "O tema foi ativado e está disponível para uso.",
            variant: "success",
          });
        }
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      error={form.formState.errors.title}
                      disabled={mode === "view" || isLoading}
                      value={field.value || ""}
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
                      disabled={isLoading || mode === "view" || theme.active}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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
                          disabled={mode === "view" || isLoading}
                          field={field.name}
                          defaultPreview={theme.primary_logo_url}
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
                          disabled={mode === "view" || isLoading}
                          field={field.name}
                          defaultPreview={theme.contrast_primary_logo_url}
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
                            disabled={mode === "view" || isLoading}
                            defaultPreview={theme.reduced_logo_url}
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
                            disabled={mode === "view" || isLoading}
                            defaultPreview={theme.contrast_reduced_logo_url}
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
                          field={field.name}
                          disabled={mode === "view" || isLoading}
                          defaultPreview={theme.favicon_url}
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
                        disabled={mode === "view" || isLoading}
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
                        disabled={mode === "view" || isLoading}
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
                          disabled={mode === "view" || isLoading}
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
                          disabled={mode === "view" || isLoading}
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
          <div className="grid md:grid-cols-3 gap-6">
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
                      disabled={mode === "view" || isLoading}
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
                      disabled={mode === "view" || isLoading}
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
                      disabled={mode === "view" || isLoading}
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
          Salvar Alterações
        </Button>
      </div>
    </div>
  );
};

export default ThemeActionsForm;
