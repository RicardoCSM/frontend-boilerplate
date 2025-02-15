"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import ThemeToggle from "@/modules/Common/Components/RootLayout/_partials/ThemeToggle";
import Logo from "@/modules/Common/Components/RootLayout/_partials/Logo";

interface PasswordRecoveryLayoutProps {
  children: React.ReactNode;
  back_url?: string;
  next_url?: string;
  next_label?: string;
  title: string;
  description: string;
}

const PasswordRecoveryLayout: React.FC<PasswordRecoveryLayoutProps> = ({
  children,
  back_url,
  title,
  description,
  next_url,
  next_label,
}) => {

  return (
    <div className="w-full flex h-screen flex-col items-center justify-center ">
      {back_url && (
        <Link
          href={back_url}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "absolute left-4 top-4 md:left-8 md:top-8",
          )}
        >
          <>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Voltar
          </>
        </Link>
      )}
      <div className="absolute right-4 top-4 md:right-8 md:top-8">
        <ThemeToggle />
      </div>
      <div className="mx-auto flex w-full flex-col justify-center sm:w-[350px]">
        <div className="space-y-6">
          <div className="flex flex-col space-y-2 items-center">
            <div
              className="flex w-full justify-center"
            >
              <Logo />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            <p className="text-sm text-muted-foreground text-center">
              {description}
            </p>
          </div>
          {children}
          {next_url && next_label && (
            <p className="p-8 text-center text-sm text-muted-foreground">
              <Link
                href={next_url}
                className="hover:text-brand underline underline-offset-4"
              >
                {next_label}
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PasswordRecoveryLayout;
