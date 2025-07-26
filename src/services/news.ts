import { INews } from "@/interfaces/news";
import { api } from "./api";

//criar CreateNewsData

const newsService = {
  getAll: () => api.get<INews[]>("/news"),
  getById: (id: number) => api.get<INews>(`/news/${id}`),
  create: (data: any) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "category_ids") {
        formData.append(key, JSON.stringify(value));
      } else if (value !== undefined) {
        formData.append(key, String(value));
      }
    });
    return api.post<INews>("/news", formData);
  },
  update: (id: number, data: Partial<any>) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value);
      }
    });
    return api.put<INews>(`/news/${id}`, formData);
  },
  delete: (id: number) => api.delete(`/news/${id}`),
};

export default newsService;
