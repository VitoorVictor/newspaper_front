import {
  IIndustrialGuide,
  IIndustrialGuideWithUsersSectors,
} from "./../interfaces/industrial-guide";
import { getCookie } from "cookies-next";
import { createApi } from "./api";

function getApiClient() {
  const token = getCookie("access_token");
  return createApi(String(token));
}

const industrialGuideService = {
  getAll: (filters: { search: string; sector: number; page: number }) => {
    const { search, sector, page } = filters;
    const api = getApiClient();

    const url = `/industrial-guides-sector/${sector || "null"}/${
      search || "null"
    }${page ? `?page=${page}` : ""}`;

    return api.get<PaginatedResponse<IIndustrialGuideWithUsersSectors>>(url);
  },
  getById: (id: number) => {
    const api = getApiClient();
    return api.get<IIndustrialGuide>(`/industrial-guide/${id}`);
  },
  create: (formData: FormData) => {
    const api = getApiClient();
    return api.post<IIndustrialGuide>("/admin/industrial-guide", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  update: (id: number, formData: FormData) => {
    const api = getApiClient();
    return api.put<IIndustrialGuide>(
      `/admin/industrial-guide/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },
  delete: (id: number) => {
    const api = getApiClient();
    return api.delete(`/admin/industrial-guide/${id}`);
  },
};

export default industrialGuideService;
