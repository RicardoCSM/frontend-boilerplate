"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { getCurrentUserInfo, login } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoginSchema, loginSchema } from "../../Lib/Validations/auth";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/password-input";
import useAuth from "../../Hooks/useAuth";

const LoginForm = () => {
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      login: "",
      password: "",
    },
  });
  const { refreshUserData } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  async function onSubmit(values: LoginSchema) {
    setIsLoading(true);
    const response = await login({
      login: values.login,
      password: values.password,
    });
    if (response?.success) {
      toast({
        title: response?.message,
      });

      await refreshUserData();
      await redirectUser();
    } else {
      form.setError("login", { message: "" });
      toast({
        title: "Algo deu errado.",
        description: response?.message || "",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  }

  const redirectUser = async () => {
    try {
      const user = await getCurrentUserInfo();
      if (user?.permissions.includes("ALL-access-admin-panel")) {
        router.push("/admin");
      } else {
        router.push("/home");
      }
    } catch {
      throw new Error("Erro ao redirecionar usuário.");
    }
  };

  return (
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
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
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
        <Button type="submit" className="w-full" variant="tenantPrimary">
          {isLoading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
          Entrar
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
