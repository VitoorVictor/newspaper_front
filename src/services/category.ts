import { ICategory } from "./../interfaces/category";
import { api } from "./api";

const categoryService = {
  getAll: () => api.get<ICategory[]>("/categories"),
  getById: (id: number) => api.get<ICategory>(`/categories/${id}`),
  create: (data: { name: string }) => {
    return api.post<ICategory>("/categories", data);
  },
  update: (id: number, data: Partial<{ name: string }>) => {
    return api.put<ICategory>(`/categories/${id}`, data);
  },
  delete: (id: number) => api.delete(`/categories/${id}`),
};

export default categoryService;
