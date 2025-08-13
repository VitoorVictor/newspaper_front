import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import industrialGuideService from "@/services/industrial-guide";
import { toast } from "react-toastify";

export const useIndustrialGuide = (filters: {
  search: string;
  sector: string;
  page: number;
}) => {
  return useQuery({
    queryKey: ["industrial-guide", filters],
    queryFn: () =>
      industrialGuideService.getAll(filters).catch((error) => {
        throw error;
      }),
  });
};

export const useIndustrialGuideBySlug = (slug?: string) => {
  return useQuery({
    enabled: !!slug,
    queryKey: ["industrial-gusluge", slug],
    queryFn: () => {
      if (!slug) return null;
      return industrialGuideService.getBySlug(slug);
    },
  });
};

export const useCreateIndustrialGuide = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: industrialGuideService.create,
    onSuccess: () => {
      toast.success("Guia industrial criado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["industrial-guide"] });
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

export const useUpdateIndustrialGuide = (id: number) => {
  const queryClient = useQueryClient();

  if (!id) null;

  return useMutation({
    mutationFn: (data: FormData) => industrialGuideService.update(id, data),
    onSuccess: () => {
      toast.success("Guia industrial atualizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["industrial-guide"] });
      queryClient.invalidateQueries({ queryKey: ["industrial-guide", id] });
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

export const useDeleteIndustrialGuide = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: industrialGuideService.delete,
    onSuccess: () => {
      toast.success("Guia industrial removido com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["industrial-guide"] });
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
