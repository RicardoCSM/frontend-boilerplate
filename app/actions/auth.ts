"use server";

import { cookies } from "next/headers";
import CryptoJS from "crypto-js";
import httpClient from "@/modules/Common/Services/http.server.service";
import { ApiError } from "@/modules/Common/Interfaces/ApiError";
import { isAxiosError } from "@/lib/utils";

interface loginData {
  login: string;
  password: string;
}

const SECRET_KEY = process.env.AUTH_SECRET_KEY || "";

export async function getToken() {
  const encryptedToken = cookies().get("access_token")?.value;
  if (encryptedToken) {
    const bytes = CryptoJS.AES.decrypt(encryptedToken, SECRET_KEY);
    const originalToken = bytes.toString(CryptoJS.enc.Utf8);
    return originalToken;
  }
  return null;
}

export async function clearToken() {
  cookies().set("access_token", "", { expires: new Date(0) });
  cookies().set("selected_unit", "", { expires: new Date(0) });
}

export async function getCurrentUserInfo() {
  try {
    if (!cookies().get("access_token")) {
      return null;
    }

    const res = await httpClient.get(`auth/me`);
    const response = res.data;

    if (response.id) {
      return response;
    } else {
      await logout();
      return null;
    }
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function login(loginData: loginData) {
  try {
    const res = await httpClient.post("auth/login", loginData);
    const response = res.data;
    if (response.token) {
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const encryptedToken = CryptoJS.AES.encrypt(
        response.token,
        SECRET_KEY,
      ).toString();
      cookies().set("access_token", encryptedToken, {
        expires,
        httpOnly: true,
        sameSite: "lax",
      });
    }

    return {
      success: true,
      message: "Usuário logado com sucesso!",
    };
  } catch (e: unknown) {
    if (isAxiosError<ApiError>(e)) {
      return {
        success: false,
        message: e.response?.data?.message || "",
      };
    }
  }
}

export async function logout() {
  try {
    await httpClient.post(`auth/logout`);
    await clearToken();

    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}
