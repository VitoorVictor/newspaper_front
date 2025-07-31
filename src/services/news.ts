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
  getAllAdmin: (filters: { search: string; category: string }) => {
    const { search, category } = filters;
    const api = getApiClient();
    return api.get<PaginatedResponse<INews>>(
      `/admin/news/${filters.search ? search : "null"}/${
        filters.category ? category : "null"
      } `
    );
  },
  getById: (id: number) => {
    const api = getApiClient();
    return api.get<INews>(`/news/${id}`);
  },
  create: (formData: FormData) => {
    const api = getApiClient();
    return api.post<INews>("/news", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
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
