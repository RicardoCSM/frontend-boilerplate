"use client";

import RoleForm from "@/modules/Auth/Components/Forms/RoleForm";
import {
  Permission,
  PermissionModule,
  Role,
} from "@/modules/Auth/Interfaces/Role";
import permissionsService from "@/modules/Auth/Services/permissions.service";
import rolesService from "@/modules/Auth/Services/roles.service";
import NoResultsFounded from "@/modules/Common/Components/RootLayout/Icons/NoResultsFounded";
import { LoaderCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface RoleFormContainerProps {
  name?: string;
  mode: "create" | "edit" | "view";
}

const RoleFormContainer: React.FC<RoleFormContainerProps> = ({
  name,
  mode,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState<Role>();
  const [permissions, setPermission] = useState<Permission[]>();
  const [permissionModules, setPermissionModules] = useState<
    PermissionModule[]
  >([]);

  const fetchRole = useCallback(async () => {
    try {
      const response = await rolesService.show(name ?? "");
      if (response.status === 200) {
        const role: Role = response.data;
        await fetchRolePermissions(role.name);
        setRole(role);
      }
    } catch (e: unknown) {
      console.error(e);
      setIsLoading(false);
    }
  }, [name]);

  const fetchRolePermissions = async (role: string) => {
    try {
      const response = await rolesService.permissions(role);
      if (response.status === 200) {
        const permissions: Permission[] = response.data;
        setPermission(permissions);
      }
    } catch (e: unknown) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPermissionModules = useCallback(async () => {
    try {
      const response = await permissionsService.modules();
      if (response.status === 200) {
        const modules: PermissionModule[] = response.data.modules;
        setPermissionModules(modules);
      }
    } catch (e: unknown) {
      console.error(e);
    }

    if (mode === "create") {
      setIsLoading(false);
    }
  }, [mode]);

  useEffect(() => {
    fetchPermissionModules();
    if (name) {
      fetchRole();
    }
  }, [fetchPermissionModules, fetchRole, name]);

  return (
    <>
      {isLoading ? (
        <div className="w-full grow flex justify-center items-center">
          <LoaderCircle className="m-4 h-8 w-8 animate-spin text-tenant-primary" />
        </div>
      ) : (
        <>
          {mode === "create" ? (
            <RoleForm permissionModules={permissionModules} />
          ) : (
            <>
              {role ? (
                <RoleForm
                  role={role}
                  permissions={permissions}
                  mode={mode}
                  permissionModules={permissionModules}
                />
              ) : (
                <div className="w-full grow flex justify-center items-center">
                  <div className="w-full grow flex justify-center items-center">
                    <div className="flex flex-col items-center gap-6 text-center">
                      <div className="w-[148px]">
                        <NoResultsFounded />
                      </div>
                      <h2 className="font-semibold text-2xl text-tenant-primary">
                        Nenhum grupo encontrado!
                      </h2>
                    </div>
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

export default RoleFormContainer;
