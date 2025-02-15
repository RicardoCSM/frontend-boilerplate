"use client";

import { Datatable } from "@/modules/Common/Interfaces/Datatable";
import httpClient from "@/modules/Common/Services/http.client.service";
import supportService from "@/modules/Common/Services/support.service";
import { Filter } from "@/modules/Common/Interfaces/Filter";
import { AdsReorderSchema, AdsSchema } from "../Lib/Validations/ads";
import uploadFilesService from "@/modules/Common/Services/uploadFiles.service";

const adsService = {
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

    return httpClient.get("tenant/ads", {
      params: { ...params, ...filterParams },
    });
  },
  async store(data: AdsSchema) {
    const dataWithFiles: Record<string, unknown> = { ...data };
    await Promise.all(
      Object.entries(data).map(async ([key, value]) => {
        if (typeof value === "object" && value instanceof File) {
          dataWithFiles[key as keyof AdsSchema] =
            await uploadFilesService.storeFile(value);
        }
      }),
    );

    return httpClient.post("tenant/ads", dataWithFiles);
  },
  async show(ads_id: string) {
    return httpClient.get(`tenant/ads/${ads_id}`);
  },
  async update(ads_id: string, data: Partial<AdsSchema>) {
    const dataWithFiles: Record<string, unknown> = { ...data };
    await Promise.all(
      Object.entries(data).map(async ([key, value]) => {
        if (typeof value === "object" && value instanceof File) {
          dataWithFiles[key as keyof AdsSchema] =
            await uploadFilesService.storeFile(value);
        }
      }),
    );

    return httpClient.put(`tenant/ads/${ads_id}`, dataWithFiles);
  },
  async delete(ads_id: string) {
    return httpClient.delete(`tenant/ads/${ads_id}`);
  },
  async reorder(data: AdsReorderSchema) {
    return httpClient.post("tenant/ads/reorder", data);
  },
};

export default adsService;
