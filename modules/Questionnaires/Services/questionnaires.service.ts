"use client";

import httpClient from "@/modules/Common/Services/http.client.service";
import { QuestionnairesSchema } from "../Lib/Validations/questionnaires";
import { Datatable } from "@/modules/Common/Interfaces/Datatable";
import supportService from "@/modules/Common/Services/support.service";
import { Filter } from "@/modules/Common/Interfaces/Filter";

const questionnairesService = {
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

    return httpClient.get("questionnaires", {
      params: { ...params, ...filterParams },
    });
  },
  async store(data: QuestionnairesSchema) {
    return httpClient.post(`questionnaires`, data);
  },
  async show(questionnaire_id: string, version?: string | null) {
    const params = version ? { version } : {};
    return httpClient.get(`questionnaires/${questionnaire_id}`, { params });
  },
  async update(questionnaire_id: string, data: Partial<QuestionnairesSchema>) {
    return httpClient.put(`questionnaires/${questionnaire_id}`, data);
  },
  async delete(questionnaire_id: string) {
    return httpClient.delete(`questionnaires/${questionnaire_id}`);
  },
};

export default questionnairesService;
