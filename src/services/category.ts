import { ICategory } from "./../interfaces/category";
import { getCookie } from "cookies-next";
import { createApi } from "./api";

function getApiClient() {
  const token = getCookie("access_token");
  return createApi(String(token));
}

const categoryService = {
  getAll: () => {
    const api = getApiClient();
    return api.get<ICategory[]>("/categories");
  },
  getById: (id: number) => {
    const api = getApiClient();
    return api.get<ICategory>(`/categories/${id}`);
  },
  create: (data: { name: string }) => {
    const api = getApiClient();
    return api.post<ICategory>("/categories", data);
  },
  update: (id: number, data: Partial<{ name: string }>) => {
    const api = getApiClient();
    return api.put<ICategory>(`/categories/${id}`, data);
  },
  delete: (id: number) => {
    const api = getApiClient();
    return api.delete(`/categories/${id}`);
  },
};

export default categoryService;
