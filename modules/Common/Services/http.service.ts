import { getToken } from "@/app/actions/auth";
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

const API_ENDPOINT: string =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost/api/v1";

const config: AxiosRequestConfig = {
  baseURL: API_ENDPOINT,
};

export const createHttpClient = (): AxiosInstance => {
  const httpClient: AxiosInstance = axios.create(config);

  const authInterceptor = async (config: InternalAxiosRequestConfig) => {
    const token = await getToken();
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  };

  httpClient.interceptors.request.use(authInterceptor);

  httpClient.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error) => {
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized access");
      }
      return Promise.reject(error);
    },
  );

  return httpClient;
};
