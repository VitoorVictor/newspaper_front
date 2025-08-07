import { ISector } from "./../interfaces/sector";
import { getCookie } from "cookies-next";
import { createApi } from "./api";

function getApiClient() {
  const token = getCookie("access_token");
  return createApi(String(token));
}

const sectorService = {
  getAll: () => {
    const api = getApiClient();
    return api.get<ISector[]>("/sectors");
  },
  getById: (id: number) => {
    const api = getApiClient();
    return api.get<ISector>(`/sectors/${id}`);
  },
  getAllPanel: () => {
    const api = getApiClient();
    return api.get<PaginatedResponse<ISector>>("/admin/sectors");
  },
  create: (data: { name: string }) => {
    const api = getApiClient();
    return api.post<ISector>("/admin/sectors", data);
  },
  update: (id: number, data: Partial<{ name: string }>) => {
    const api = getApiClient();
    return api.put<ISector>(`/admin/sectors/${id}`, data);
  },
  delete: (id: number) => {
    const api = getApiClient();
    return api.delete(`/admin/sectors/${id}`);
  },
};

export default sectorService;
