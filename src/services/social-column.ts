import { ISocialColumn } from "../interfaces/social-column";
import { getCookie } from "cookies-next";
import { createApi } from "./api";
import axios from "axios";

function getApiClient() {
  const token = getCookie("access_token");
  return createApi(String(token));
}

const socialColumnService = {
  getAll: (filters: { search: string; page: number }) => {
    const { search, page } = filters;

    const url = `${process.env.NEXT_PUBLIC_API_URL}/social-columns/${
      search || "null"
    }${page ? `?page=${page}` : ""}`;

    return axios.get<PaginatedResponse<ISocialColumn>>(url);
  },

  getBySlug: (slug: string) => {
    return axios.get<ISocialColumn>(
      `${process.env.NEXT_PUBLIC_API_URL}/social-column/${slug}`
    );
  },

  create: (formData: FormData) => {
    const api = getApiClient();
    return api.post<ISocialColumn>("/admin/social-columns", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  update: (id: number, formData: FormData) => {
    const api = getApiClient();
    return api.post<ISocialColumn>(`/admin/social-columns/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  delete: (id: number) => {
    const api = getApiClient();
    return api.delete(`/admin/social-columns/${id}`);
  },

  deleteImg: (id: number) => {
    const api = getApiClient();
    return api.delete(`/admin/social-columns/images/${id}`);
  },
};

export default socialColumnService;
