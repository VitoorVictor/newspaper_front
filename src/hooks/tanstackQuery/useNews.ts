import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import newsService from "@/services/news";
import { toast } from "react-toastify";

export const useNews = () => {
  return useQuery({
    queryKey: ["news"],
    queryFn: () =>
      newsService.getAll().catch((error) => {
        throw error;
      }),
  });
};

export const useNewsPanel = (filters: { search: string; category: number }) => {
  return useQuery({
    queryKey: ["news", filters],
    queryFn: () =>
      newsService.getAllPanel(filters).catch((error) => {
        throw error;
      }),
  });
};

export const useNewsBySlug = (slug?: string) => {
  return useQuery({
    enabled: !!slug,
    queryKey: ["news", slug],
    queryFn: () => {
      if (!slug) return null;
      return newsService.getBySlug(slug);
    },
  });
};

export const useCreateNews = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: newsService.create,
    onSuccess: () => {
      toast.success("Notícia criada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["news"] });
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else if (typeof error === "object" && error !== null) {
        const axiosError = error as any;
        toast.error(
          axiosError.response?.data?.message ||
            axiosError.message ||
            "Ocorreu um erro inesperado"
        );
      }
    },
  });
};

export const useUpdateNews = (id: number) => {
  const queryClient = useQueryClient();

  if (!id) null;

  return useMutation({
    mutationFn: (data: FormData) => newsService.update(id, data),
    onSuccess: () => {
      toast.success("Notícia atualizada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["news"] });
      queryClient.invalidateQueries({ queryKey: ["news", id] });
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else if (typeof error === "object" && error !== null) {
        const axiosError = error as any;
        toast.error(
          axiosError.response?.data?.message ||
            axiosError.message ||
            "Ocorreu um erro inesperado"
        );
      }
    },
  });
};

export const useDeleteNews = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: newsService.delete,
    onSuccess: () => {
      toast.success("Notícia removida com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["news"] });
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else if (typeof error === "object" && error !== null) {
        const axiosError = error as any;
        toast.error(
          axiosError.response?.data?.message ||
            axiosError.message ||
            "Ocorreu um erro inesperado"
        );
      }
    },
  });
};
