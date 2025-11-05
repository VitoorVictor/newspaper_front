import { IBanner } from "@/interfaces/banner";
import bannerService from "@/services/banner";
import { create } from "zustand";

interface BannerStore {
  // Estado separado para cada tipo de banner
  topBanners: { url: string; link: string }[];
  industrialBanners: { url: string; link: string }[];
  empresarialBanners: { url: string; link: string }[];
  comercialBanners: { url: string; link: string }[];
  popUpBanners: { url: string; link: string }[];
  allBanners: IBanner[];

  // Estados de controle
  isLoading: boolean;
  error: string | null;
  lastFetch: number | null;

  // Ações
  fetchBanners: () => Promise<void>;
  clearError: () => void;
}

// Tempo de cache em milissegundos (5 minutos)
const CACHE_DURATION = 5 * 60 * 1000;

export const useBannerStore = create<BannerStore>((set: any, get: any) => ({
  // Estado inicial
  topBanners: [],
  industrialBanners: [],
  empresarialBanners: [],
  comercialBanners: [],
  popUpBanners: [],
  allBanners: [],
  isLoading: false,
  error: null,
  lastFetch: null,

  // Buscar banners top e side
  fetchBanners: async () => {
    const {
      lastFetch,
      topBanners,
      industrialBanners,
      empresarialBanners,
      comercialBanners,
      popUpBanners,
    } = get();

    // Verificar se já temos dados em cache e se ainda são válidos
    if (
      (topBanners.length > 0 ||
        industrialBanners.length > 0 ||
        empresarialBanners.length > 0 ||
        comercialBanners.length > 0 ||
        popUpBanners.length > 0) &&
      lastFetch &&
      Date.now() - lastFetch < CACHE_DURATION
    ) {
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const response = await bannerService.getAllTopSide();
      console.log(response.data);
      set({
        topBanners: response.data.top || [],
        industrialBanners: response.data["lateral industrial"] || [],
        empresarialBanners: response.data["lateral empresarial"] || [],
        comercialBanners: response.data["lateral comercial"] || [],
        popUpBanners: response.data["pop up"] || [],
        isLoading: false,
        lastFetch: Date.now(),
        error: null,
      });
    } catch (error) {
      set({
        isLoading: false,
        error:
          error instanceof Error ? error.message : "Erro ao buscar banners",
      });
    }
  },

  // Limpar erro
  clearError: () => {
    set({ error: null });
  },
}));
