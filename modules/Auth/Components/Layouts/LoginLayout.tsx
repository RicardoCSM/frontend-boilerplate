"use client";

import ThemeToggle from "@/modules/Common/Components/RootLayout/_partials/ThemeToggle";
import Link from "next/link";
import { ReactNode } from "react";
import AdsCarousel from "./_partials/AdsCarousel";
import Logo from "@/modules/Common/Components/RootLayout/_partials/Logo";
import ThemeUrls from "./_partials/ThemeUrls";
import useTenant from "@/modules/Common/Hooks/useTenant";
import { cn } from "@/lib/utils";

interface LoginLayoutProps {
  children: ReactNode;
}

export function LoginLayout({ children }: LoginLayoutProps) {
  const {
    tenant: { ads },
  } = useTenant();

  return (
    <div className={cn("w-full min-h-screen lg:grid", ads.length > 0 && "lg:grid-cols-2")}>
      <div className="m-1 absolute left-4 top-4 md:left-8 md:top-8">
        <ThemeToggle align="start" />
      </div>
      <div className="flex min-h-screen items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <div
              className="flex w-full justify-center"
            >
              <Logo />
            </div>
            <h1 className="text-3xl font-bold">Seja bem-vindo</h1>
            <p className="text-balance text-muted-foreground">
              Insira suas credenciais abaixo para entrar
            </p>
          </div>
          {children}
          <div className="mt-4 text-center text-sm">
            Esqueceu sua senha?{" "}
            <Link href="/auth/forgot-password" className="underline">
              Recuperar
            </Link>
          </div>
        </div>
      </div>
      <ThemeUrls />
      <div className="hidden lg:block">
        <AdsCarousel ads={ads} />
      </div>
    </div>
  );
}
