import { getCookie } from "cookies-next";
import { createApi } from "./api";
import { INews } from "@/interfaces/news";
import axios from "axios";
import { ICategoryWithNewsBanners } from "@/interfaces/category";

function getApiClient() {
  const token = getCookie("access_token");
  return createApi(String(token));
}

const newsService = {
  getAll: () => {
    return axios.get<{
      principais: INews[];
      editorias: ICategoryWithNewsBanners[];
    }>(`${process.env.NEXT_PUBLIC_API_URL}/news`);
  },
  getAllByCategory: (filters: {
    category: string;
    search: string;
    page: number;
  }) => {
    const { search, category, page } = filters;

    const url = `${process.env.NEXT_PUBLIC_API_URL}/news-category/${
      category === "" ? "null" : category
    }/${search || "null"}${page ? `?page=${page}` : ""}`;

    console.log(url);

    return axios.get<PaginatedResponse<INews>>(url);
  },
  getBySlug: (slug: string) => {
    return axios.get<INews>(`${process.env.NEXT_PUBLIC_API_URL}/news/${slug}`);
  },
  getAllPanel: (filters: {
    search: string;
    category: number;
    page: number;
  }) => {
    const { search, category, page } = filters;
    const api = getApiClient();
    return api.get<PaginatedResponse<INews>>(
      `/admin/news/panel/${filters.category ? category : "null"}/${
        filters.search ? search : "null"
      }${page ? `?page=${page}` : ""}`
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
