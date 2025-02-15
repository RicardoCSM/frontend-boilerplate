import httpClient from "@/modules/Common/Services/http.client.service";

const permissionsService = {
  async modules() {
    return httpClient.get("/permissions/modules");
  },
};

export default permissionsService;
