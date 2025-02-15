"use client";

import { Datatable } from "@/modules/Common/Interfaces/Datatable";
import { Filter } from "@/modules/Common/Interfaces/Filter";
import httpClient from "@/modules/Common/Services/http.client.service";
import supportService from "@/modules/Common/Services/support.service";
import { ThemeSchema } from "../Lib/Validations/themes";
import uploadFilesService from "@/modules/Common/Services/uploadFiles.service";

const themesService = {
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

    return httpClient.get("tenant/themes", {
      params: { ...params, ...filterParams },
    });
  },
  async store(data: ThemeSchema) {
    const dataWithFiles: Record<string, unknown> = { ...data };
    await Promise.all(
      Object.entries(data).map(async ([key, value]) => {
        if (typeof value === "object" && value instanceof File) {
          dataWithFiles[key as keyof ThemeSchema] =
            await uploadFilesService.storeFile(value);
        }
      }),
    );

    return httpClient.post("tenant/themes", dataWithFiles);
  },
  async show(theme_id: string) {
    return httpClient.get(`tenant/themes/${theme_id}`);
  },
  async update(theme_id: string, data: Partial<ThemeSchema>) {
    const dataWithFiles: Record<string, unknown> = { ...data };
    await Promise.all(
      Object.entries(data).map(async ([key, value]) => {
        if (typeof value === "object" && value instanceof File) {
          dataWithFiles[key as keyof ThemeSchema] =
            await uploadFilesService.storeFile(value);
        }
      }),
    );

    return httpClient.put(`tenant/themes/${theme_id}`, dataWithFiles);
  },
  async delete(theme_id: string) {
    return httpClient.delete(`tenant/themes/${theme_id}`);
  },
};

export default themesService;
