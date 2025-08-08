import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import sectorService from "@/services/sector";
import { toast } from "react-toastify";
import { ISector } from "@/interfaces/sector";

export const useSectors = () => {
  return useQuery({
    queryKey: ["sector"],
    queryFn: () =>
      sectorService.getAll().catch((error) => {
        throw error;
      }),
  });
};

export const useSectorsPanel = () => {
  return useQuery({
    queryKey: ["sector"],
    queryFn: () =>
      sectorService.getAllPanel().catch((error) => {
        throw error;
      }),
  });
};

export const useSectorById = (id?: number) => {
  return useQuery({
    enabled: !!id,
    queryKey: ["sector", id],
    queryFn: () => {
      if (!id) return null;
      return sectorService.getById(id);
    },
  });
};

export const useCreateSector = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: sectorService.create,
    onSuccess: () => {
      toast.success("Setor criado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["sector"] });
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

export const useUpdateSector = (id: number) => {
  const queryClient = useQueryClient();

  if (!id) null;

  return useMutation({
    mutationFn: (data: Partial<ISector>) => sectorService.update(id, data),
    onSuccess: () => {
      toast.success("Setor atualizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["sector"] });
      queryClient.invalidateQueries({ queryKey: ["sector", id] });
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

export const useDeleteSector = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sectorService.delete,
    onSuccess: () => {
      toast.success("Setor removido com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["sector"] });
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
