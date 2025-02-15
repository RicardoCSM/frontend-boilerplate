"use client";

import { LoaderCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import User from "../../Interfaces/User";
import usersService from "../../Services/users.service";
import rolesService from "../../Services/roles.service";
import { Role } from "../../Interfaces/Role";
import CreateUserForm from "../Forms/CreateUserForm";
import UserActionsForm from "../Forms/UserActionsForm";
import NoResultsFounded from "@/modules/Common/Components/RootLayout/Icons/NoResultsFounded";

interface UserFormContainerProps {
  id?: string;
  mode: "create" | "edit" | "view";
}

const UserFormContainer: React.FC<UserFormContainerProps> = ({
  id,
  mode,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User>();
  const [roles, setRoles] = useState<Role[]>([]);

  const fetchUser = useCallback(async () => {
    try {
      const response = await usersService.show(id ?? "");
      if (response.status === 200) {
        const user: User = response.data;
        setUser(user);
      }
    } catch (e: unknown) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const fetchRoles = useCallback(async () => {
    try {
      const response = await rolesService.index({ per_page: "all" });
      if (response.status === 200) {
        const roles: Role[] = response.data;
        setRoles(roles);
      }
    } catch (e: unknown) {
      console.error(e);
    }
    if (mode === "create") {
      setIsLoading(false);
    }
  }, [mode]);

  useEffect(() => {
    fetchRoles();
    if (id) {
      fetchUser();
    }
  }, [fetchUser, fetchRoles, id]);

  return (
    <>
      {isLoading ? (
        <div className="w-full grow flex justify-center items-center">
          <LoaderCircle className="m-4 h-8 w-8 animate-spin text-tenant-primary" />
        </div>
      ) : (
        <>
          {mode === "create" ? (
            <CreateUserForm roles={roles} />
          ) : (
            <>
              {user ? (
                <UserActionsForm
                  mode={mode}
                  roles={roles}
                  user={user}
                />
              ) : (
                <div className="w-full grow flex justify-center items-center">
                  <div className="flex flex-col items-center gap-6 text-center">
                    <div className="w-[148px]">
                      <NoResultsFounded />
                    </div>
                    <h2 className="font-semibold text-2xl text-tenant-primary">
                      Nenhum usuário encontrado!
                    </h2>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default UserFormContainer;
