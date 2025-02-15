"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import useAuth from "@/modules/Auth/Hooks/useAuth";
import { cn } from "@/lib/utils";

interface DatatableCreateButtonProps {
  disabled?: boolean;
  href: string;
  requiredPermission: string;
}

const DatatableCreateButton: React.FC<DatatableCreateButtonProps> = ({
  disabled,
  href,
  requiredPermission,
}) => {
  const { userData } = useAuth();

  return (
    <>
      {userData?.permissions.includes(
        `ALL-create-${requiredPermission}`,
      ) && (
          <Button
            variant="outline"
            className={cn(disabled && "pointer-events-none opacity-50")}
            asChild
          >
            <Link href={href}>
              <PlusCircle className="w-4 h-4 mr-2" />
              Adicionar
            </Link>
          </Button>
        )}
    </>
  );
};

export default DatatableCreateButton;
