"use client";

import { Button } from "@/components/ui/button";
import {
  Versa360Client,
  Versa360Scope,
} from "@/modules/Auth/Interfaces/Versa360Client";

interface Versa360ScopesListSidebar {
  versa360Client: Versa360Client;
  selectedVersa360Scope: Versa360Scope | null;
  setSelectedVersa360Scope: (scope: Versa360Scope | null) => void;
}

const Versa360ScopesListSidebar: React.FC<Versa360ScopesListSidebar> = ({
  versa360Client,
  selectedVersa360Scope,
  setSelectedVersa360Scope,
}) => {
  return (
    <aside className="-mx-4 lg:w-1/6 pr-2 h-full overflow-y-auto">
      <nav className="hidden lg:flex space-x-2 flex-col lg:space-x-0 lg:space-y-2 ">
        <h4 className="text-sm font-medium text-tenant-primary">Escopos</h4>
        {versa360Client.workspace?.scopes.map((scope) => (
          <div
            className="flex justify-between w-full items-center"
            key={scope.id}
          >
            <Button
              type="button"
              variant={
                selectedVersa360Scope?.id === scope.id
                  ? "tenantSecondary"
                  : "tenantOutline"
              }
              className="w-full flex justify-between"
              onClick={() => {
                setSelectedVersa360Scope(scope);
              }}
            >
              <p className="w-full text-left text-ellipsis overflow-hidden">
                {scope.name}
              </p>
            </Button>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Versa360ScopesListSidebar;
