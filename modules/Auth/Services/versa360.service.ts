import httpClient from "@/modules/Common/Services/http.client.service";
import { versa360ScopePermissionMapSchema } from "../Lib/Validations/versa360ScopePermissionMap";
import { z } from "zod";

const versa360Service = {
  async store(data: z.infer<typeof versa360ScopePermissionMapSchema>) {
    return httpClient.post("versa360", data);
  },
  async show(scope_id: string) {
    return httpClient.get(`versa360/${scope_id}`);
  },
  async update(
    scope_id: string,
    data: Partial<z.infer<typeof versa360ScopePermissionMapSchema>>,
  ) {
    return httpClient.put(`versa360/${scope_id}`, data);
  },
  async delete(scope_id: string) {
    return httpClient.delete(`versa360/${scope_id}`);
  },
  async client() {
    return httpClient.get("versa360/client");
  },
  async redirect() {
    return httpClient.post("versa360/redirect");
  },
};

export default versa360Service;
