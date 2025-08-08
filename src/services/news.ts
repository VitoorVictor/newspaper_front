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
  getById: (id: number) => {
    const api = getApiClient();
    return api.get<INews>(`/news/${id}`);
  },
  getAllPanel: (filters: { search: string; category: string }) => {
    const { search, category } = filters;
    const api = getApiClient();
    return api.get<PaginatedResponse<INews>>(
      `/admin/news/panel/${filters.search ? search : "null"}/${
        filters.category ? category : "null"
      } `
    );
  },
  create: (formData: FormData) => {
    const api = getApiClient();
    return api.post<INews>("/admin/news", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  update: (id: number, formData: FormData) => {
    const api = getApiClient();
    return api.post<INews>(`/admin/news/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  delete: (id: number) => {
    const api = getApiClient();
    return api.delete(`/admin/news/${id}`);
  },
};

export default newsService;
