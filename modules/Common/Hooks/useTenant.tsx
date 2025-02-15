"use client";

import { useContext } from "react";
import { TenantContext } from "@/modules/Common/Providers/TenantProvider";

const useTenant = () => {
  const context = useContext(TenantContext);

  if (!context) {
    throw new Error("useTenant must be used within a TenantProvider");
  }

  return context;
};

export default useTenant;
