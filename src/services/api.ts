import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Trata erros 4xx/5xx
      const message = error.response.data?.message || error.message;
      return Promise.reject(new Error(message));
    }
    return Promise.reject(error);
  }
);
