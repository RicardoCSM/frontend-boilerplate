"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface ErrorLayoutProps {
  statusCode: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const ErrorLayout: React.FC<ErrorLayoutProps> = ({
  statusCode,
  title,
  description,
  icon,
}) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col w-full items-center h-screen justify-center md:px-20 ">
      <div className="grid md:grid-cols-2 w-full md:h-[400px]">
        <div className="flex flex-col w-full h-full space-y-6 justify-center">
          <div className="flex w-full justify-center md:justify-normal">
            <Badge
              variant="tenantPrimary"
              className="h-10 w-16 text-lg font-bold justify-center"
            >
              {statusCode}
            </Badge>
          </div>
          <div className="space-y-3 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-tenant-primary">
              Opss!
              <br className="md:hidden" /> {title}.
            </h1>
            <p className="px-16 md:px-0 text-md md:text-2xl text-tenant-primary">
              Desculpe, {description}.
            </p>
          </div>
          {!isMobile && (
            <div>
              <Button
                variant="tenantSecondary"
                onClick={() => window.history.back()}
              >
                <h1 className="text-lg font-bold text-tenant-primary">
                  Voltar
                </h1>
              </Button>
            </div>
          )}
        </div>
        <div className="flex w-full h-full justify-center items-center p-8">
          <div className="w-[300px]">{icon}</div>
        </div>
        {isMobile && (
          <div className="flex w-full justify-center">
            <Button
              variant="tenantSecondary"
              onClick={() => window.history.back()}
            >
              <h1 className="text-lg font-bold text-tenant-primary">Voltar</h1>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorLayout;
