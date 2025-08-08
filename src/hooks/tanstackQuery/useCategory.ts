import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import categoryService from "@/services/category";
import { toast } from "react-toastify";
import { ICategory } from "@/interfaces/category";

export const useCategories = () => {
  return useQuery({
    queryKey: ["category"],
    queryFn: () =>
      categoryService.getAll().catch((error) => {
        throw error;
      }),
  });
};

export const useCategoriesPanel = () => {
  return useQuery({
    queryKey: ["category", "panel"],
    queryFn: () =>
      categoryService.getAllPanel().catch((error) => {
        throw error;
      }),
  });
};

export const useCategoryById = (id?: number) => {
  return useQuery({
    enabled: !!id,
    queryKey: ["category", id],
    queryFn: () => {
      if (!id) return null;
      return categoryService.getById(id);
    },
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: categoryService.create,
    onSuccess: () => {
      toast.success("Editoria criada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["category"] });
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

export const useUpdateCategory = (id: number) => {
  const queryClient = useQueryClient();

  if (!id) null;

  return useMutation({
    mutationFn: (data: Partial<ICategory>) => categoryService.update(id, data),
    onSuccess: () => {
      toast.success("Editoria atualizada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["category"] });
      queryClient.invalidateQueries({ queryKey: ["category", id] });
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

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoryService.delete,
    onSuccess: () => {
      toast.success("Editoria removida com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["category"] });
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
