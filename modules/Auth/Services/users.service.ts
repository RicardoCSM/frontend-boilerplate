"use client";

import { Datatable } from "@/modules/Common/Interfaces/Datatable";
import httpClient from "@/modules/Common/Services/http.client.service";
import supportService from "@/modules/Common/Services/support.service";
import {
  CreateUserSchema,
  EditUserSchema,
} from "../Lib/Validations/user";
import { Filter } from "@/modules/Common/Interfaces/Filter";
import uploadFilesService from "@/modules/Common/Services/uploadFiles.service";
import { Dashboard } from "@/modules/Common/Interfaces/Dashboard";

const usersService = {
  async index(datatable: Datatable, filters?: Filter[]) {
    const params = supportService.mountParams(
      datatable as Record<string, string>,
    );
    const filterParams = filters?.reduce(
      (acc, filter) => {
        acc[filter.key] = filter.value;
        return acc;
      },
      {} as Record<string, string>,
    );

    return httpClient.get("users", {
      params: { ...params, ...filterParams },
    });
  },
  async store(data: CreateUserSchema) {
    return httpClient.post("users", data);
  },
  async show(user_id: string) {
    return httpClient.get(`users/${user_id}`);
  },
  async update(user_id: string, data: Partial<EditUserSchema>) {
    return httpClient.put(`users/${user_id}`, data);
  },
  async delete(user_id: string) {
    return httpClient.delete(`users/${user_id}`);
  },
  async dashboard(dashboard: Dashboard, filters?: Filter[]) {
    const params = supportService.mountParams(
      dashboard as Record<string, string>,
    );
    const filterParams = filters?.reduce(
      (acc, filter) => {
        acc[filter.key] = filter.value;
        return acc;
      },
      {} as Record<string, string>,
    );

    return httpClient.get("users/dashboard", {
      params: { ...params, ...filterParams },
    });
  },
  async changePassword(user_id: string, data: Partial<EditUserSchema>) {
    return httpClient.put(`users/${user_id}/password`, data);
  },
  async syncRoles(user_id: string, data: Partial<EditUserSchema>) {
    return httpClient.post(`users/${user_id}/roles`, data);
  },
  async changeAvatar(user_id: string, avatar: File) {
    const uploadedFile = await uploadFilesService.storeFile(avatar);

    return httpClient.post(`users/${user_id}/avatar`, {
      file: uploadedFile,
    });
  },
};

export default usersService;
