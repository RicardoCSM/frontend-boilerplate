import { AxiosHeaders } from "axios";

export interface AwsResponse {
  data: {
    bucket: string;
    extension: string | undefined;
    headers: AxiosHeaders;
    key: string;
    url: string;
    uuid: string;
  };
}

export type AwsResponseData = AwsResponse["data"];
