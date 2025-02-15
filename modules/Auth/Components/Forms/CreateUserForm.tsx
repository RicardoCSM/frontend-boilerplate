"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import FormLayout from "@/modules/Common/Components/AdminLayout/FormLayout/FormLayout";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { SettingsIcon } from "lucide-react";
import UserPermissionsDialog from "./_partials/UserPermissionsDialog";
import {
  CreateUserSchema,
  createUserSchema,
} from "../../Lib/Validations/user";
import { Role } from "../../Interfaces/Role";
import usersService from "../../Services/users.service";
import { toast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import supportService from "@/modules/Common/Services/support.service";
import { Combobox } from "@/components/ui/combobox";
import { isAxiosError } from "@/lib/utils";
import { ApiError } from "@/modules/Common/Interfaces/ApiError";

interface CreateUserFormProps {
  roles: Role[];
}

const CreateUserForm: React.FC<CreateUserFormProps> = ({
  roles,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUserPermissionsDialogOpen, setIsUserPermissionsDialogOpen] =
    useState<boolean>(false);
  const [avatarPreview, setAvatarPreview] = useState<string>("");

  const form = useForm<CreateUserSchema>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      login: "",
      email: "",
      role: "",
      password: "",
      password_confirmation: "",
      extra_permissions: [],
    },
  });

  async function onSubmit(values: CreateUserSchema) {
    setIsLoading(true);
    try {
      const data = supportService.removeEmptyValues(values);
      const response = await usersService.store(data);
      if (response.status === 201) {
        if (data.avatar && data.avatar[0]) {
          await usersService.changeAvatar(response.data.id, data.avatar[0]);
        }

        setAvatarPreview("");
        form.reset();
        toast({
          title: "Usuário adicionado com sucesso",
        });
      }
    } catch (e: unknown) {
      if (isAxiosError<ApiError>(e)) {
        if (e.response?.data.errors) {
          Object.entries(e.response.data.errors).forEach(([key, value]) => {
            form.setError(key as keyof CreateUserSchema, {
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
  }

  return (
    <>
      <FormLayout
        title="Usuário"
        isLoading={isLoading}
        form={form}
        onSubmit={onSubmit}
        mode="create"
        backUrl="/admin/access/users"
      >
        <div className="grid md:grid-cols-3 gap-6">
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
        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <PasswordInput
                    type="password"
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
                    type="password"
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
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Grupo</FormLabel>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full">
                  <Combobox
                    error={form.formState.errors.role}
                    options={roles.map((role) => ({
                      value: role.name,
                      label: role.name,
                    }))}
                    selected={field.value ?? ""}
                    onChange={(value) =>
                      form.setValue("role", value as string)
                    }
                  />
                  <FormDescription>
                    Grupo de permissões padrão do usuário
                  </FormDescription>
                  <FormMessage />
                </div>
                <div className="flex w-full md:w-auto justify-start">
                  <Button
                    variant="ghost"
                    disabled={form.watch("role") === ""}
                    onClick={() => setIsUserPermissionsDialogOpen(true)}
                    type="button"
                  >
                    <SettingsIcon className="mr-2 h-4 w-4" />
                    Gerenciar permissões
                  </Button>
                </div>
              </div>
            </FormItem>
          )}
        />
        <UserPermissionsDialog
          isOpen={isUserPermissionsDialogOpen}
          setIsOpen={setIsUserPermissionsDialogOpen}
          roles={[form.watch("role")]}
        />
      </FormLayout>
    </>
  );
};

export default CreateUserForm;
