"use client";

import { cn, isAxiosError } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ResetPasswordInterface,
  ResetPasswordSchema,
  resetPasswordSchema,
} from "../../Lib/Validations/password-recovery";
import { toast } from "@/hooks/use-toast";
import { PasswordInput } from "@/components/ui/password-input";
import authService from "../../Services/auth.service";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ApiError } from "@/modules/Common/Interfaces/ApiError";

interface ResetPasswordFormProps extends React.HTMLAttributes<HTMLDivElement> {
  token: string;
}

const ResetPasswordForm = ({
  className,
  token,
  ...props
}: ResetPasswordFormProps) => {
  const form = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      password_confirmation: "",
    },
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const login = searchParams.get("login");

  async function onSubmit(values: ResetPasswordSchema) {
    setIsLoading(true);
    try {
      if (login && token) {
        const updatedData: ResetPasswordInterface = {
          login: login,
          token: token,
          password: values.password,
          password_confirmation: values.password_confirmation,
        };

        await authService.resetPassword(updatedData);
        toast({
          title: "Senha redefinida com sucesso!",
        });
        router.push("/login");
      }
    } catch (e: unknown) {
      if (isAxiosError<ApiError>(e)) {
        form.setError("password", {});
        toast({
          title: "Algo deu errado.",
          description: e.response?.data.message || "",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={cn("grid gap-6 w-full", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nova Senha</FormLabel>
                <FormControl>
                  <PasswordInput
                    error={form.formState.errors?.password}
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
            name="password_confirmation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmar Senha</FormLabel>
                <FormControl>
                  <PasswordInput
                    error={form.formState.errors?.password_confirmation}
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button variant="tenantPrimary" disabled={isLoading}>
            {isLoading && (
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            )}
            Redefinir senha
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ResetPasswordForm;
