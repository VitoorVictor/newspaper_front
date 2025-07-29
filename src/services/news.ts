import { getCookie } from "cookies-next";
import { createApi } from "./api";
import { INews } from "@/interfaces/news";

function getApiClient() {
  const token = getCookie("access_token");
  return createApi(String(token));
}

const newsService = {
  getAll: () => {
    const api = getApiClient();
    return api.get<INews[]>("/news");
  },
  getAllAdmin: () => {
    const api = getApiClient();
    return api.get<INews[]>("/admin/news/");
  },
  getById: (id: number) => {
    const api = getApiClient();
    return api.get<INews>(`/news/${id}`);
  },
  create: (data: any) => {
    const api = getApiClient();
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
    const api = getApiClient();
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value);
      }
    });
    return api.put<INews>(`/news/${id}`, formData);
  },
  delete: (id: number) => {
    const api = getApiClient();
    return api.delete(`/news/${id}`);
  },
};

export default newsService;
