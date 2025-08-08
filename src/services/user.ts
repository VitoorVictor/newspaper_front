import { IUser } from "./../interfaces/user";
import { getCookie } from "cookies-next";
import { createApi } from "./api";

function getApiClient() {
  const token = getCookie("access_token");
  return createApi(String(token));
}

const userService = {
  getAll: (filters: { search: string }) => {
    const { search } = filters;
    const api = getApiClient();
    return api.get<PaginatedResponse<IUser>>(
      `/admin/users/${filters.search ? search : "null"}`
    );
  },
  getById: (id: number) => {
    const api = getApiClient();
    return api.get<IUser>(`/admin/user/${id}`);
  },
  create: (data: any) => {
    const api = getApiClient();
    return api.post<IUser>("/admin/users", data);
  },
  update: (id: number, data: Partial<any>) => {
    const api = getApiClient();
    return api.put<IUser>(`/admin/users/${id}`, data);
  },
  delete: (id: number) => {
    const api = getApiClient();
    return api.delete(`/admin/users/${id}`);
  },
};

export default userService;
