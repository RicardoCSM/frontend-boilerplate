"use client";

import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import ThemeColorsPreview from "./ThemeColorsPreview";
import { ThemeSchema } from "../../../Lib/Validations/themes";
import { useFormContext } from "react-hook-form";

interface SelectThemeFormFieldsProps {
  themeMode: "light" | "dark";
  setThemeMode: (mode: "light" | "dark") => void;
}

const SelectThemeFormFields: React.FC<SelectThemeFormFieldsProps> = ({
  themeMode,
  setThemeMode,
}) => {
  const form = useFormContext<ThemeSchema>();

  return (
    <FormItem className="space-y-1 col-span-2 md:col-span-1">
      <FormLabel>Modo</FormLabel>
      <FormDescription>
        Selecione o modo do tema para fazer as configurações.
      </FormDescription>
      <FormMessage />
      <RadioGroup
        className="grid max-w-md grid-cols-2 gap-8 pt-2"
        value={themeMode}
        onValueChange={setThemeMode}
      >
        <FormItem>
          <FormLabel
            className={cn(
              (form.formState.errors.primary_color_light ||
                form.formState.errors.secondary_color_light ||
                form.formState.errors.primary_logo ||
                form.formState.errors.reduced_logo ||
                form.formState.errors.favicon) &&
                "[&>div]:border-destructive",
              "[&:has([data-state=checked])>div]:border-primary",
            )}
          >
            <FormControl>
              <RadioGroupItem value="light" className="sr-only" />
            </FormControl>
            <ThemeColorsPreview
              primaryColor={form.watch("primary_color_light")}
              secondaryColor={form.watch("secondary_color_light")}
            />
            <span className="block w-full p-2 text-center font-normal">
              Claro
            </span>
          </FormLabel>
        </FormItem>
        <FormItem>
          <FormLabel
            className={cn(
              (form.formState.errors.primary_color_dark ||
                form.formState.errors.secondary_color_dark ||
                form.formState.errors.contrast_primary_logo ||
                form.formState.errors.contrast_reduced_logo) &&
                "[&>div]:border-destructive",
              "[&:has([data-state=checked])>div]:border-primary",
            )}
          >
            <FormControl>
              <RadioGroupItem value="dark" className="sr-only" />
            </FormControl>
            <ThemeColorsPreview
              primaryColor={form.watch("primary_color_dark")}
              secondaryColor={form.watch("secondary_color_dark")}
              dark
            />
            <span className="block w-full p-2 text-center font-normal">
              Escuro
            </span>
          </FormLabel>
        </FormItem>
      </RadioGroup>
    </FormItem>
  );
};

export default SelectThemeFormFields;
