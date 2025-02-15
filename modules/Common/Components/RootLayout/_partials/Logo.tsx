"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";
import useTenant from "@/modules/Common/Hooks/useTenant";
import { cn } from "@/lib/utils";
import { CodeXml } from "lucide-react";

interface LogoProps extends React.HTMLAttributes<HTMLImageElement> {
  reduced?: boolean;
  contrast?: boolean;
  width?: number;
  height?: number;
}

const Logo: React.FC<LogoProps> = ({
  reduced = false,
  contrast = false,
  ...props
}) => {
  const { resolvedTheme } = useTheme();
  const {
    tenant: { theme: theme },
  } = useTenant();

  const [isThemeResolved, setIsThemeResolved] = useState(false);

  useEffect(() => {
    if (resolvedTheme) {
      setIsThemeResolved(true);
    }
  }, [resolvedTheme]);

  if (!isThemeResolved) {
    return null;
  }

  return (
    <>
      {reduced ? (
        <>
          {resolvedTheme === "dark" || contrast ? (
            // <Image
            //   priority
            //   src={
            //     theme.contrast_reduced_logo_url ??
            //     "/images/contrast-reduced-logo.svg"
            //   }
            //   alt="Reduced Logo"
            //   className="w-[36px] h-[36px]"
            //   width={36}
            //   height={36}
            // />
            <>
              {theme.contrast_reduced_logo_url ? (
                <Image
                  priority
                  src={theme.contrast_reduced_logo_url}
                  alt="Reduced Logo"
                  className="w-[36px] h-[36px]"
                  width={36}
                  height={36}
                />
              ) : (
                <CodeXml className="size-8" />
              )}
            </>
          ) : (
            // <Image
            //   priority
            //   src={theme.reduced_logo_url ?? "/images/reduced-logo.svg"}
            //   alt="Reduced Logo"
            //   className="w-[36px] h-[36px]"
            //   width={36}
            //   height={36}
            // />
            <>
              {theme.reduced_logo_url ? (
                <Image
                  priority
                  src={theme.reduced_logo_url}
                  alt="Reduced Logo"
                  className="w-[36px] h-[36px]"
                  width={36}
                  height={36}
                />
              ) : (
                <CodeXml className="size-8 text-tenant-primary" />
              )}
            </>
          )}
        </>
      ) : (
        <>
          {resolvedTheme === "dark" || contrast ? (
            // <Image
            //   priority
            //   src={
            //     theme.contrast_primary_logo_url ?? "/images/contrast-logo.svg"
            //   }
            //   alt="Logo"
            //   className={cn(
            //     "max-h-full max-w-[275px]",
            //     props.className,
            //     `w-[${props.width ?? 275}px] h-[${props.height ?? 100}px]`,
            //   )}
            //   width={props.width ?? 275}
            //   height={props.height ?? 100}
            //   {...props}
            // />
            <>
              {theme.contrast_primary_logo_url ? (
                <Image
                  priority
                  src={theme.contrast_primary_logo_url}
                  alt="Logo"
                  className={cn(
                    "max-h-full max-w-[275px]",
                    props.className,
                    `w-[${props.width ?? 275}px] h-[${props.height ?? 100}px]`,
                  )}
                  width={props.width ?? 275}
                  height={props.height ?? 100}
                  {...props}
                />
              ) : (
                <div className="flex justify-center gap-2 items-end w-full">
                  <CodeXml className="w-9 h-9" />
                  <h2 className="text-5xl font-bold text tracking-tighter">
                    versatec
                  </h2>
                </div>
              )}
            </>
          ) : (
            // <Image
            //   priority
            //   src={theme.primary_logo_url ?? "/images/logo.svg"}
            //   alt="Logo"
            //   className={cn(
            //     "max-h-full max-w-[275px]",
            //     props.className,
            //     `w-[${props.width ?? 275}px] h-[${props.height ?? 100}px]`,
            //   )}
            //   width={props.width ?? 275}
            //   height={props.height ?? 100}
            //   {...props}
            // />
            <>
              {theme.primary_logo_url ? (
                <Image
                  priority
                  src={theme.primary_logo_url}
                  alt="Logo"
                  className={cn(
                    "max-h-full max-w-[275px]",
                    props.className,
                    `w-[${props.width ?? 275}px] h-[${props.height ?? 100}px]`,
                  )}
                  width={props.width ?? 275}
                  height={props.height ?? 100}
                  {...props}
                />
              ) : (
                <div className="flex justify-center gap-2 items-end w-full text-tenant-primary">
                  <CodeXml className="w-9 h-9" />
                  <h2 className="text-5xl font-bold text tracking-tighter">
                    versatec
                  </h2>
                </div>
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default Logo;
