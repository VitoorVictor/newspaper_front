import { ICategory } from "./../interfaces/category";
import { getCookie } from "cookies-next";
import { createApi } from "./api";
import axios from "axios";

function getApiClient() {
  const token = getCookie("access_token");
  return createApi(String(token));
}

const categoryService = {
  getAll: () => {
    return axios.get<ICategory[]>(`${process.env.API_URL}/categories`);
  },
  getById: (id: number) => {
    const api = getApiClient();
    return api.get<ICategory>(`/categories/${id}`);
  },
  getAllPanel: () => {
    const api = getApiClient();
    return api.get<PaginatedResponse<ICategory>>("/admin/categories");
  },
  create: (data: { name: string }) => {
    const api = getApiClient();
    return api.post<ICategory>("/admin/categories", data);
  },
  update: (id: number, data: Partial<{ name: string }>) => {
    const api = getApiClient();
    return api.put<ICategory>(`/admin/categories/${id}`, data);
  },
  delete: (id: number) => {
    const api = getApiClient();
    return api.delete(`/admin/categories/${id}`);
  },
};

export default categoryService;
