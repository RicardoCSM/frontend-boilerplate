"use client";

import { Datatable } from "@/modules/Common/Interfaces/Datatable";
import httpClient from "@/modules/Common/Services/http.client.service";
import supportService from "@/modules/Common/Services/support.service";
import { Filter } from "@/modules/Common/Interfaces/Filter";
import { QuestionnairesGroupSchema } from "../Lib/Validations/questionnairesGroup";

const questionnairesGroupsService = {
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

    return httpClient.get("questionnaires/groups", {
      params: { ...params, ...filterParams },
    });
  },
  async store(data: QuestionnairesGroupSchema) {
    return httpClient.post("questionnaires/groups", data);
  },
  async show(group_id: string) {
    return httpClient.get(`questionnaires/groups/${group_id}`);
  },
  async update(group_id: string, data: Partial<QuestionnairesGroupSchema>) {
    return httpClient.put(`questionnaires/groups/${group_id}`, data);
  },
  async delete(group_id: string) {
    return httpClient.delete(`questionnaires/groups/${group_id}`);
  },
};

export default questionnairesGroupsService;
