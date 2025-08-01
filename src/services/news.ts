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
  update: (id: number, formData: FormData) => {
    const api = getApiClient();
    return api.put<INews>(`/news/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  delete: (id: number) => {
    const api = getApiClient();
    return api.delete(`/news/${id}`);
  },
};

export default newsService;
