"use server";

import { headers } from "next/headers";
import { createHttpClient } from "./http.service";

const httpClient = createHttpClient();

httpClient.interceptors.request.use((config) => {
  const requestHeaders = headers();
  const host = requestHeaders.get("host")?.split(":")[0] ?? "";

  config.headers["X-Domain"] = host;
  return config;
});

export default httpClient;
