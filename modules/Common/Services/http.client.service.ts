"use client";

import { logout } from "@/app/actions/auth";
import { createHttpClient } from "./http.service";
import { AxiosError } from "axios";

const httpClient = createHttpClient();

httpClient.interceptors.request.use((config) => {
  const host = window.location.hostname;
  config.headers["X-Domain"] = host;
  return config;
});

const authErrorInterceptor = async (error: AxiosError) => {
  if (error.response && error.response.status === 401) {
    await logout();
    window.location.replace("/auth/login");
  }

  return Promise.reject(error);
};

httpClient.interceptors.response.use((response) => {
  return response;
}, authErrorInterceptor);

export default httpClient;
