"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import User from "../../Interfaces/User";
import {
  EditCurrentUserSchema,
  editCurrentUserSchema,
} from "../../Lib/Validations/user";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/password-input";
import usersService from "../../Services/users.service";
import { toast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import supportService from "@/modules/Common/Services/support.service";
import useAuth from "../../Hooks/useAuth";
import { isAxiosError } from "@/lib/utils";
import { ApiError } from "@/modules/Common/Interfaces/ApiError";

interface CurrentUserEditDialogProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  user: User;
}

const CurrentUserEditDialog: React.FC<CurrentUserEditDialogProps> = ({
  isOpen,
  setIsOpen,
  user,
}) => {
  const form = useForm<EditCurrentUserSchema>({
    resolver: zodResolver(editCurrentUserSchema),
    defaultValues: {
      name: user.name,
      login: user.login,
      email: user.email,
      current_password: "",
      password: "",
      password_confirmation: "",
    },
  });
  const { refreshUserData } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [avatarPreview, setAvatarPreview] = useState<string>(
    user.avatar ?? "",
  );

  async function onSubmit(values: EditCurrentUserSchema) {
    setIsLoading(true);
    try {
      const excludedKeys = [
        "current_password",
        "password",
        "password_confirmation",
      ];

      const updatedData = Object.fromEntries(
        Object.entries(values).filter(
          ([key, value]) =>
            !excludedKeys.includes(key) &&
            value !== user[key as keyof User],
        ),
      ) as Partial<EditCurrentUserSchema>;

      if (values.password !== "" && values.password_confirmation !== "") {
        updatedData.current_password = values.current_password;
        updatedData.password = values.password;
        updatedData.password_confirmation = values.password_confirmation;
      }

      const response = await usersService.update(user.id, updatedData);
      if (response.status === 200) {
        if (values.avatar && values.avatar[0]) {
          await usersService.changeAvatar(
            response.data.id,
            values.avatar[0],
          );
        }

        form.setValue("name", values.name);
        form.setValue("login", values.login);
        form.setValue("email", values.email);
        form.setValue("current_password", "");
        form.setValue("password", "");
        form.setValue("password_confirmation", "");
        await refreshUserData();
        setIsOpen(false);
        toast({
          title: "Usuário atualizado com sucesso",
        });
      }
    } catch (e: unknown) {
      if (isAxiosError<ApiError>(e)) {
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
    <Dialog
      open={isOpen}
      onOpenChange={isOpen ? () => setIsOpen(false) : () => setIsOpen(true)}
    >
      <DialogContent className="max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle autoFocus tabIndex={0}>
            Editar informações
          </DialogTitle>
          <DialogDescription>
            Editar informações do usuário atual
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <FormField
            control={form.control}
            name="avatar"
            render={() => (
              <FormItem>
                <FormLabel>Avatar</FormLabel>
                <div className="w-full flex justify-center items-center gap-6">
                  <Avatar>
                    <AvatarImage src={avatarPreview} />
                    <AvatarFallback>A</AvatarFallback>
                  </Avatar>
                  <FormControl>
                    <Input
                      type="file"
                      error={form.formState.errors.avatar}
                      disabled={isLoading}
                      {...form.register("avatar")}
                      onChange={(event) => {
                        const displayUrl = supportService.getImageData(event);
                        setAvatarPreview(displayUrl);
                      }}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input
                      error={form.formState.errors.name}
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
              name="login"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Login</FormLabel>
                  <FormControl>
                    <Input
                      error={form.formState.errors.login}
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    error={form.formState.errors.email}
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
            name="current_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha Atual</FormLabel>
                <FormControl>
                  <PasswordInput
                    error={form.formState.errors.current_password}
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <PasswordInput
                      error={form.formState.errors.password}
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
                  <FormLabel>Confirmação da senha</FormLabel>
                  <FormControl>
                    <PasswordInput
                      error={form.formState.errors.password_confirmation}
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Form>
        <DialogFooter className="gap-3">
          <DialogClose asChild>
            <Button disabled={isLoading} type="button" variant="outline">
              Cancelar
            </Button>
          </DialogClose>
          <Button
            variant="tenantPrimary"
            disabled={isLoading}
            onClick={form.handleSubmit(onSubmit)}
          >
            {isLoading && (
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            )}
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CurrentUserEditDialog;
