"use client";

import httpClient from "@/modules/Common/Services/http.client.service";
import {
  ForgotPasswordSchema,
  ResetPasswordInterface,
} from "../Lib/Validations/password-recovery";

const authService = {
  async forgotPassword(data: ForgotPasswordSchema) {
    return httpClient.post(`auth/forgot-password`, {
      ...data,
      callback_url: `${window.location.origin}/auth/reset-password/`,
    });
  },
  async resetPassword(data: ResetPasswordInterface) {
    return httpClient.post(`auth/reset-password`, data);
  },
};

export default authService;
