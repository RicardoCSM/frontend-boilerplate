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
import { Role } from "../../Interfaces/Role";
import {
  EditUserSchema,
  editUserSchema,
} from "../../Lib/Validations/user";
import User from "../../Interfaces/User";
import { Switch } from "@/components/ui/switch";
import { MultiSelect } from "@/components/ui/multi-select";
import UserPermissionsDialog from "./_partials/UserPermissionsDialog";
import usersService from "../../Services/users.service";
import { toast } from "@/hooks/use-toast";
import supportService from "@/modules/Common/Services/support.service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useAuth from "../../Hooks/useAuth";
import { isAxiosError } from "@/lib/utils";
import { ApiError } from "@/modules/Common/Interfaces/ApiError";

interface UserActionsFormProps {
  roles: Role[];
  mode: "edit" | "view";
  user: User;
}

const UserActionsForm: React.FC<UserActionsFormProps> = ({
  roles,
  user,
  mode,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUserPermissionsDialogOpen, setIsUserPermissionsDialogOpen] =
    useState<boolean>(false);
  const [avatarPreview, setAvatarPreview] = useState<string>(
    user.avatar ?? "",
  );
  const { userData, refreshUserData } = useAuth();

  const form = useForm<EditUserSchema>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      name: user.name ?? "",
      login: user.login ?? "",
      email: user.email ?? "",
      password: "",
      password_confirmation: "",
      active: user.active ?? false,
      roles: user.roles ?? [],
      extra_permissions: [],
    },
  });

  async function onSubmit(values: EditUserSchema) {
    setIsLoading(true);
    try {
      const excludedKeys = [
        "password",
        "password_confirmation",
        "roles",
        "extra_permissions",
        "avatar",
      ];
      const updatedData = Object.fromEntries(
        Object.entries(values).filter(
          ([key, value]) =>
            !excludedKeys.includes(key) &&
            value !== user[key as keyof User],
        ),
      ) as Partial<EditUserSchema>;

      const response = await usersService.update(user.id, updatedData);
      if (response.status === 200) {
        if (values.avatar && values.avatar[0]) {
          await usersService.changeAvatar(
            response.data.id,
            values.avatar[0],
          );
        }

        await changeuserPassword(values);
        await syncRolesAndPermissions(values);
        toast({
          title: "Usuário atualizado com sucesso",
        });
      }

      if (userData?.id === user.id) {
        await refreshUserData();
      }
    } catch (e: unknown) {
      if (isAxiosError<ApiError>(e)) {
        if (e.response?.data.errors) {
          Object.entries(e.response.data.errors).forEach(([key, value]) => {
            form.setError(key as keyof EditUserSchema, {
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

  const changeuserPassword = async (values: EditUserSchema) => {
    try {
      if (values.password !== "" && values.password_confirmation !== "") {
        await usersService.changePassword(user.id, {
          password: values.password,
          password_confirmation: values.password_confirmation,
        });
        form.setValue("password", "");
        form.setValue("password_confirmation", "");
      }
    } catch (e: unknown) {
      if (isAxiosError<ApiError>(e)) {
        if (e.response?.data.errors) {
          Object.entries(e.response.data.errors).forEach(([key, value]) => {
            form.setError(key as keyof EditUserSchema, {
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
    }
  };

  const syncRolesAndPermissions = async (values: EditUserSchema) => {
    try {
      await usersService.syncRoles(user.id, {
        roles: values.roles,
        extra_permissions: values.extra_permissions,
      });
    } catch (e: unknown) {
      if (isAxiosError<ApiError>(e)) {
        if (e.response?.data.errors) {
          Object.entries(e.response.data.errors).forEach(([key, value]) => {
            form.setError(key as keyof EditUserSchema, {
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
    }
  };

  return (
    <>
      <FormLayout
        title="Usuário"
        isLoading={isLoading}
        form={form}
        onSubmit={onSubmit}
        mode={mode}
        backUrl="/admin/access/users"
      >
        {mode == "view" && (
          <div className="flex w-full justify-center items-center">
            <Avatar className="w-[100px] h-[100px]">
              <AvatarImage src={avatarPreview} />
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
          </div>
        )}
        <div
          className={`grid gap-6 ${mode == "view" ? "md:grid-cols-2" : "md:grid-cols-3"}`}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input
                    error={form.formState.errors.name}
                    disabled={mode == "view" || isLoading}
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
                    disabled={mode == "view" || isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {mode !== "view" && (
            <FormField
              control={form.control}
              name="avatar"
              render={() => (
                <FormItem>
                  <FormLabel>Avatar</FormLabel>
                  <div className="w-full flex items-center gap-6">
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
          )}
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
                  disabled={mode == "view" || isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {mode !== "view" && (
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
        )}
        <div className="grid lg:grid-cols-5 gap-6 items-center">
          <FormField
            control={form.control}
            name="active"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Status</FormLabel>
                  <FormDescription>
                    Selecione se o usuário está ativo ou não
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isLoading || mode === "view"}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="roles"
            render={({ field }) => (
              <FormItem className="lg:col-span-4">
                <FormLabel>Grupos</FormLabel>
                <div className="flex flex-col md:flex-row gap-6 ">
                  <div className="w-full flex-1">
                    <FormControl>
                      <MultiSelect
                        className={`w-full ${form.formState.errors.roles ? "border-destructive" : ""}`}
                        options={roles.map((role) => ({
                          value: role.name,
                          label: role.name,
                        }))}
                        isdisabled={mode == "view" || isLoading}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        placeholder="Selecione os grupos de permissões"
                        variant="tenantPrimary"
                        maxCount={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                  {mode !== "view" && (
                    <div className="flex w-full md:w-auto justify-start">
                      <Button
                        variant="ghost"
                        disabled={isLoading}
                        onClick={() => setIsUserPermissionsDialogOpen(true)}
                        type="button"
                      >
                        <SettingsIcon className="mr-2 h-4 w-4" />
                        Gerenciar permissões
                      </Button>
                    </div>
                  )}
                </div>
              </FormItem>
            )}
          />
        </div>
        <UserPermissionsDialog
          isOpen={isUserPermissionsDialogOpen}
          setIsOpen={setIsUserPermissionsDialogOpen}
          roles={form.watch("roles")}
          userPermissions={user.permissions}
          userRoles={user.roles}
        />
      </FormLayout>
    </>
  );
};

export default UserActionsForm;
