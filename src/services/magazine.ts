import { getCookie } from "cookies-next";
import { createApi } from "./api";
import axios from "axios";
import { IMagazine } from "@/interfaces/magazine";

function getApiClient() {
  const token = getCookie("access_token");
  return createApi(String(token));
}

const magazineService = {
  getAll: (filters: { search: string; page: number }) => {
    const { search, page } = filters;

    const url = `${process.env.NEXT_PUBLIC_API_URL}/magazines/${
      search || "null"
    }${page ? `?page=${page}` : ""}`;

    return axios.get<PaginatedResponse<IMagazine>>(url);
  },
  getBySlug: (slug: string) => {
    return axios.get<{ magazine: IMagazine; related: IMagazine[] }>(
      `${process.env.NEXT_PUBLIC_API_URL}/magazine/${slug}`
    );
  },

  create: (formData: FormData) => {
    const api = getApiClient();
    return api.post<IMagazine>("/admin/magazines", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  update: (id: number, formData: FormData) => {
    const api = getApiClient();
    return api.put<IMagazine>(`/admin/magazines/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  delete: (id: number) => {
    const api = getApiClient();
    return api.delete(`/admin/magazines/${id}`);
  },
};

export default magazineService;
