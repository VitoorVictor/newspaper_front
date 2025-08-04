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
      `/users/${filters.search ? search : "null"}`
    );
  },
  getById: (id: number) => {
    const api = getApiClient();
    return api.get<IUser>(`/users/${id}`);
  },
  create: (data: any) => {
    const api = getApiClient();
    return api.post<IUser>("/users", data);
  },
  update: (id: number, data: Partial<any>) => {
    const api = getApiClient();
    return api.put<IUser>(`/users/${id}`, data);
  },
  delete: (id: number) => {
    const api = getApiClient();
    return api.delete(`/users/${id}`);
  },
};

export default userService;
