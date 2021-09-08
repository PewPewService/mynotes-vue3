import axios, { AxiosRequestConfig } from "axios";
import { getCookie } from "../../utils/cookie control/cookie";

const configure: Record<string, unknown> = {
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json; charset=utf-8",
  },
  baseURL: process.env.VUE_APP_CONNECTIONSTRING,
};
const api = axios.create(configure);
api.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    if (
      Object.getPrototypeOf(new FormData()) ===
      Object.getPrototypeOf(config.data)
    ) {
      config.data.append("jwt", getCookie("myNotesJWT"));
    } else config.data.jwt = getCookie("myNotesJWT");
    return config;
  },
  (error) => Promise.reject(error)
);
export default api;
