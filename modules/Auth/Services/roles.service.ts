"use client";

import { Datatable } from "@/modules/Common/Interfaces/Datatable";
import httpClient from "@/modules/Common/Services/http.client.service";
import supportService from "@/modules/Common/Services/support.service";
import { RoleSchema } from "../Lib/Validations/role";

const rolesService = {
  async index(datatable: Datatable) {
    const params = supportService.mountParams(
      datatable as Record<string, string>,
    );

    return httpClient.get("roles", { params: { ...params } });
  },
  async store(data: Partial<RoleSchema>) {
    return httpClient.post("roles", data);
  },
  async show(role: string) {
    return httpClient.get(`roles/${role}`);
  },
  async update(role: string, data: Partial<RoleSchema>) {
    return httpClient.put(`roles/${role}`, data);
  },
  async delete(role: string) {
    return httpClient.delete(`roles/${role}`);
  },
  async permissions(role: string) {
    return httpClient.get(`roles/${role}/permissions`);
  },
  async syncPermissions(role: string, permissions: string[]) {
    return httpClient.post(`roles/${role}/permissions`, { permissions });
  },
};

export default rolesService;
