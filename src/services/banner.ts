import { IBanner } from "./../interfaces/banner";
import { getCookie } from "cookies-next";
import { createApi } from "./api";
import axios from "axios";

function getApiClient() {
  const token = getCookie("access_token");
  return createApi(String(token));
}

const bannerService = {
  getAllTopSide: () => {
    return axios.get<IBanner>("/banners/top-e-side");
  },
  getAll: () => {
    const api = getApiClient();
    return api.get<IBanner[]>("/admin/banners/");
  },
  getById: (id: number) => {
    const api = getApiClient();
    return api.get<IBanner>(`/admin/banners/${id}`);
  },
  create: (data: { name: string }) => {
    const api = getApiClient();
    return api.post<IBanner>("/admin/banners", data);
  },
  delete: (id: number) => {
    const api = getApiClient();
    return api.delete(`/admin/banners/${id}`);
  },
};

export default bannerService;
