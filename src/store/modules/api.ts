import axios from "axios";

const configure: Record<string, unknown> = {
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json; charset=utf-8",
  },
  baseURL: process.env.VUE_APP_CONNECTIONSTRING,
};
const api = axios.create(configure);
export default api;
