"use client";

import httpClient from "@/modules/Common/Services/http.client.service";
import { QuestionnaireResponseSchema } from "../Lib/Validations/questionnaireResponses";
import supportService from "@/modules/Common/Services/support.service";
import { Filter } from "@/modules/Common/Interfaces/Filter";
import { Datatable } from "@/modules/Common/Interfaces/Datatable";

const questionnaireResponsesService = {
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

    return httpClient.get("questionnaires/responses", {
      params: { ...params, ...filterParams },
    });
  },
  async store(data: QuestionnaireResponseSchema) {
    return httpClient.post("questionnaires/responses", data);
  },
  async show(response_id: string) {
    return httpClient.get(`questionnaires/responses/${response_id}`);
  },
};

export default questionnaireResponsesService;
