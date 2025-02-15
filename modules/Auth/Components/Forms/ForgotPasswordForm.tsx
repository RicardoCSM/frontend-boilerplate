"use client";

import { cn, isAxiosError } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import {
  ForgotPasswordSchema,
  forgotPasswordSchema,
} from "../../Lib/Validations/password-recovery";
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

const ForgotPasswordForm = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      login: "",
    },
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function onSubmit(values: ForgotPasswordSchema) {
    setIsLoading(true);
    try {
      await authService.forgotPassword(values);
      toast({
        title: "Email enviado para recuperação!",
      });
      form.reset();
    } catch (e: unknown) {
      if (isAxiosError<ApiError>(e)) {
        form.setError("login", {});
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
            name="login"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Login</FormLabel>
                <FormControl>
                  <Input
                    error={form.formState.errors?.login}
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
            Enviar Email
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ForgotPasswordForm;
