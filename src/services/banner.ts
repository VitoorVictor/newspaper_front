import { IBanner, IBannerTopSidePopUp } from "./../interfaces/banner";
import { getCookie } from "cookies-next";
import { createApi } from "./api";
import axios from "axios";

function getApiClient() {
  const token = getCookie("access_token");
  return createApi(String(token));
}

const bannerService = {
  getAllTopSide: () => {
    return axios.get<IBannerTopSidePopUp>(`${process.env.NEXT_PUBLIC_API_URL}/banners/top-e-side`);
  },
  getAll: () => {
    return axios.get<IBanner[]>(`${process.env.NEXT_PUBLIC_API_URL}/banners`);
  },
  getById: (id: number) => {
    const api = getApiClient();
    return api.get<IBanner>(`/admin/banners/${id}`);
  },
  create: (formData: FormData) => {
    const api = getApiClient();
    return api.post<IBanner>("/admin/banners", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  delete: (id: number) => {
    const api = getApiClient();
    return api.delete(`/admin/banners/${id}`);
  },
};

export default bannerService;
