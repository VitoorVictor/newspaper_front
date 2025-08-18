import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import socialColumnsService from "@/services/social-column";
import { toast } from "react-toastify";

export const useSocialColumns = (filters: { search: string; page: number }) => {
  return useQuery({
    queryKey: ["social-columns", filters],
    queryFn: () =>
      socialColumnsService.getAll(filters).catch((error) => {
        throw error;
      }),
  });
};

export const useSocialColumnsBySlug = (slug?: string) => {
  return useQuery({
    enabled: !!slug,
    queryKey: ["social-columns", slug],
    queryFn: () => {
      if (!slug) return null;
      return socialColumnsService.getBySlug(slug);
    },
  });
};

export const useCreateSocialColumns = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: socialColumnsService.create,
    onSuccess: () => {
      toast.success("Columna social criada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["social-columns"] });
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

export const useUpdateSocialColumns = (id: number) => {
  const queryClient = useQueryClient();

  if (!id) null;

  return useMutation({
    mutationFn: (data: FormData) => socialColumnsService.update(id, data),
    onSuccess: () => {
      toast.success("Columna social atualizada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["social-columns"] });
      queryClient.invalidateQueries({ queryKey: ["social-columns", id] });
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

export const useDeleteSocialColumns = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: socialColumnsService.delete,
    onSuccess: () => {
      toast.success("Columna social removida com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["social-columns"] });
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
export const useDeleteImgSocialColumns = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: socialColumnsService.deleteImg,
    onSuccess: () => {
      toast.success("Imagem de columna social removida com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["social-columns"] });
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
