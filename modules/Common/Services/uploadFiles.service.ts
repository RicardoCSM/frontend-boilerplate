import axios from "axios";
import { AwsResponse } from "../Interfaces/AwsResponse";
import httpClient from "./http.client.service";

const uploadFilesService = {
  async storeFile(file: File, visibility?: string) {
    const response: AwsResponse = await httpClient.post(
      "/uploads/signed-storage-url",
      {
        content_type: file.type,
        visibility,
      },
    );

    const headers = response.data.headers;

    if ("Host" in headers) {
      delete headers.Host;
    }

    await axios.put(response.data.url, file, {
      headers,
    });

    response.data.extension = file.name.split(".").pop();

    return response.data;
  },
};

export default uploadFilesService;
