"use client";

import { useTheme } from "next-themes";
import {
  Versa360Client,
  Versa360Scope,
} from "../../../Interfaces/Versa360Client";
import Image from "next/image";
import Icon from "@/modules/Common/Components/RootLayout/_partials/Icon";
import DeleteVersa360ScopePermissionMapDialog from "../../Dialogs/DeleteVersa360ScopePermissionMapDialog";
import { Versa360ScopePermissionMap } from "@/modules/Auth/Interfaces/Versa360ScopePermissionMap";
import useAuth from "@/modules/Auth/Hooks/useAuth";

interface Versa360ScopeGeneralInfoProps {
  versa360Client: Versa360Client;
  selectedVersa360Scope: Versa360Scope;
  versa360ScopePermissionMap: Versa360ScopePermissionMap | null;
  refreshVersa360ScopePermissionMap: () => void;
}

const Versa360ScopeGeneralInfo: React.FC<Versa360ScopeGeneralInfoProps> = ({
  versa360Client,
  selectedVersa360Scope,
  versa360ScopePermissionMap,
  refreshVersa360ScopePermissionMap,
}) => {
  const { userData } = useAuth();
  const { resolvedTheme } = useTheme();

  return (
    <div className="flex flex-col">
      <h3 className="flex justify-between scroll-m-20 items-center gap-1 font-semibold text-xl md:text-3xl tracking-tight">
        <span className="flex items-center">
          <span className="mr-2">
            {resolvedTheme === "dark" ? (
              <Image
                src="/images/contrast-reduced-versa360.svg"
                alt="Versa 360"
                width={32}
                height={32}
              />
            ) : (
              <Image
                src="/images/reduced-versa360.svg"
                alt="Versa 360"
                width={32}
                height={32}
              />
            )}
          </span>
          Configuração do Escopo: {selectedVersa360Scope.name}
        </span>
        {versa360ScopePermissionMap &&
          userData?.permissions.includes(
            "ALL-delete-versa360-scope-permission-map",
          ) && (
            <DeleteVersa360ScopePermissionMapDialog
              selectedVersa360Scope={selectedVersa360Scope}
              refreshVersa360ScopePermissionMap={
                refreshVersa360ScopePermissionMap
              }
            />
          )}
      </h3>
      <p className="text-tenant-primary text-md flex items-center">
        Workspace:
        {versa360Client.workspace?.icon && (
          <span>
            <Icon
              name={versa360Client.workspace.icon}
              className="size-4 mx-2"
            />
          </span>
        )}
        {versa360Client.workspace?.name}
      </p>
    </div>
  );
};

export default Versa360ScopeGeneralInfo;
