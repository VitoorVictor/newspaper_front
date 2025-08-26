import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import magazineService from "@/services/magazine";
import { toast } from "react-toastify";

export const useMagazines = (filters: { search: string; page: number }) => {
  return useQuery({
    queryKey: ["magazines", filters],
    queryFn: () =>
      magazineService.getAll(filters).catch((error) => {
        throw error;
      }),
  });
};

export const useMagazineBySlug = (slug?: string) => {
  return useQuery({
    enabled: !!slug,
    queryKey: ["magazines", slug],
    queryFn: () => {
      if (!slug) return null;
      return magazineService.getBySlug(slug);
    },
  });
};

export const useCreateMagazine = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: magazineService.create,
    onSuccess: () => {
      toast.success("Revista criada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["magazines"] });
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

export const useUpdateMagazine = (id: number) => {
  const queryClient = useQueryClient();

  if (!id) null;

  return useMutation({
    mutationFn: (data: FormData) => magazineService.update(id, data),
    onSuccess: () => {
      toast.success("Revista atualizada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["magazines"] });
      queryClient.invalidateQueries({ queryKey: ["magazines", id] });
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

export const useDeleteMagazine = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: magazineService.delete,
    onSuccess: () => {
      toast.success("Revista removida com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["magazines"] });
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
