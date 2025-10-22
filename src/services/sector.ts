import axios from "axios";
import { getCookie } from "cookies-next";
import { ISector } from "./../interfaces/sector";
import { createApi } from "./api";

function getApiClient() {
  const token = getCookie("access_token");
  return createApi(String(token));
}

const sectorService = {
  getAll: () => {
    return axios.get<ISector[]>(`${process.env.NEXT_PUBLIC_API_URL}/sectors`);
  },
  getById: (id: number) => {
    const api = getApiClient();
    return api.get<ISector>(`/admin/sectors/${id}`);
  },
  getAllPanel: () => {
    const api = getApiClient();
    return api.get<PaginatedResponse<ISector>>("/admin/sectors");
  },
  create: (formData: FormData) => {
    const api = getApiClient();
    return api.post<ISector>("/admin/sectors", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  update: (id: number, formData: FormData) => {
    const api = getApiClient();
    return api.post<ISector>(`/admin/sectors/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  delete: (id: number) => {
    const api = getApiClient();
    return api.delete(`/admin/sectors/${id}`);
  },
};

export default sectorService;
