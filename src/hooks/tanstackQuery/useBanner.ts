import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import bannerService from "@/services/banner";
import { toast } from "react-toastify";

export const useBanners = () => {
  return useQuery({
    queryKey: ["banner"],
    queryFn: () =>
      bannerService.getAll().catch((error) => {
        throw error;
      }),
  });
};

export const useBannerById = (id?: number) => {
  return useQuery({
    enabled: !!id,
    queryKey: ["banner", id],
    queryFn: () => {
      if (!id) return null;
      return bannerService.getById(id);
    },
  });
};

export const useCreateBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bannerService.create,
    onSuccess: () => {
      toast.success("Banner criado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["banner"] });
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

export const useDeleteBanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bannerService.delete,
    onSuccess: () => {
      toast.success("Banner removido com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["banner"] });
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
