import axios from "axios";

export const createApi = (token?: string, onLogout?: () => void) => {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // if (typeof window !== "undefined") {
        //   if (onLogout) onLogout();
        //   else {
        //     localStorage.removeItem("accessToken");
        //     window.location.href = "/admin/entrar";
        //   }
        // }
      }
      return Promise.reject(error);
    }
  );

  return instance;
};
