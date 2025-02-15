"use client";

import React, {
  createContext,
  ReactNode,
  useState,
  useEffect,
  useCallback,
} from "react";
import { AuthData } from "../Interfaces/Auth";
import {
  clearToken,
  getCurrentUserInfo,
  logout as serverLogout,
} from "@/app/actions/auth";
import User from "../Interfaces/User";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

export const AuthContext = createContext({} as AuthData);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [userData, setUserData] = useState<User | undefined>(undefined);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const refreshUserData = useCallback(async () => {
    if (
      window.location.pathname.startsWith("/auth") ||
      window.location.pathname.startsWith("/questionnaires")
    ) {
      return;
    }

    try {
      const user = await getCurrentUserInfo();
      if (user) {
        setUserData(user);
        setIsAuthenticated(true);
      } else {
        throw new Error("Sessão inválida");
      }
    } catch {
      await clearToken();
      setIsAuthenticated(false);
      router.push("/auth/login");
    }
  }, [router]);

  const logout = async () => {
    try {
      await serverLogout();
      setUserData(undefined);
      setIsAuthenticated(false);
      router.push("/auth/login");
    } catch {
      toast({
        title: "Algo deu errado.",
        description: "Não foi possível deslogar.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    refreshUserData();
  }, [refreshUserData]);

  return (
    <AuthContext.Provider
      value={{
        logout,
        isAuthenticated,
        userData,
        refreshUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
