"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { FieldValues, UseFormReturn } from "react-hook-form";

interface FormLayoutProps<T extends FieldValues> {
  title: string;
  mode: "create" | "edit" | "view";
  form: UseFormReturn<T>;
  onSubmit?: (values: T) => Promise<void>;
  isLoading: boolean;
  children: React.ReactNode;
  customMessage?: string;
  backUrl?: string;
}

const FormLayout = <T extends FieldValues>({
  title,
  mode,
  form,
  onSubmit,
  children,
  isLoading,
  customMessage,
  backUrl,
}: FormLayoutProps<T>) => {
  return (
    <div className="flex w-full grow flex-col justify-between p-4 space-y-6">
      <div>
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">
          {customMessage || (
            <>
              {mode === "create"
                ? `Adicionar um novo ${title.toLowerCase()} ao sistema`
                : mode === "edit"
                  ? `Editar as informações do ${title.toLowerCase()} no sistema`
                  : `Visualizar as informações do ${title.toLowerCase()} selecionado`}
            </>
          )}
        </p>
      </div>
      <Separator />
      <div className="flex-1">
        <Form {...form}>
          <form>
            <div className="space-y-8">{children}</div>
          </form>
        </Form>
      </div>
      {mode !== "view" && (
        <div className="flex w-full justify-center gap-4 mt-auto pt-4">
          {backUrl && (
            <Button
              type="button"
              variant="tenantOutline"
              size="lg"
              disabled={isLoading}
              asChild
            >
              <Link href={backUrl}>Cancelar</Link>
            </Button>
          )}
          {onSubmit && (
            <Button
              variant="tenantPrimary"
              size="lg"
              disabled={isLoading}
              onClick={form.handleSubmit(onSubmit)}
            >
              {isLoading && (
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              )}
              {mode === "create" ? `Adicionar ${title}` : "Salvar Alterações"}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default FormLayout;
