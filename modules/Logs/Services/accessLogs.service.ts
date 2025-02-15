import { Datatable } from "@/modules/Common/Interfaces/Datatable";
import { Filter } from "@/modules/Common/Interfaces/Filter";
import httpClient from "@/modules/Common/Services/http.client.service";
import supportService from "@/modules/Common/Services/support.service";

const accessLogsService = {
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

    return httpClient.get("logs/access", {
      params: { ...params, ...filterParams },
    });
  },
};

export default accessLogsService;
