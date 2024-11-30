import axios, {AxiosRequestConfig, ResponseType} from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface Client {
  data?: unknown | undefined;
  method?: string | undefined;
  url: string | undefined;
  params?: string | undefined;
  body?: unknown | undefined;
  headers?:
    | {
        [key: string]: string;
      }
    | undefined;
  responseType?: ResponseType;
}

const REQUEST_TIMEOUT = 5000;

const API = axios.create({
  baseURL: API_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": true,
  },
});

export const ApiClient = async ({
  data,
  method = "GET",
  url,
  params,
  headers,
  responseType = "json",
}: Client) => {
  const requestParams: AxiosRequestConfig = {
    method,
    url,
    params,
    data,
    responseType,
  };

  API.defaults.headers = {...API.defaults.headers, ...headers};

  return API(requestParams)
    .then((res: axios.AxiosResponse) => ({data: res.data, status: res.status}))
    .catch((err) => {
      console.error(
        "\nERROR MESSAGE:",
        err.response.data.message,
        `\nSTATUS: ${err.response.data.status}`
      );

      return {data: "isError", status: err.response.status};
    });
};
