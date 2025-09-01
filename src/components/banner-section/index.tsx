"use client";

import { SimpleImageCarousel } from "@/components/custom-carousel-banner";
import { useBannerStore } from "@/stores";
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import { XIcon } from "lucide-react";

// Componente para banner top
function BannerTopSection() {
  const { topBanners, fetchBanners, isLoading, error } = useBannerStore();

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  // Se não há dados e não está carregando, retorna null
  if (!isLoading && (!topBanners || topBanners.length === 0)) {
    return null;
  }

  return (
    <>
      {/* Loading state para banners */}
      {isLoading && (
        <div className="container mx-auto my-4 md:my-8 p-4">
          <div className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>
        </div>
      )}

      {/* Error state para banners */}
      {error && (
        <div className="container mx-auto my-4 md:my-8 p-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            Erro ao carregar banners: {error}
          </div>
        </div>
      )}

      {/* Seção de Banner Top */}
      {topBanners && topBanners.length > 0 && (
        <div className="container mx-auto my-4 md:my-8 p-4 space-y-4 md:space-y-6">
          <SimpleImageCarousel
            images={topBanners}
            variant="horizontal"
            autoPlay={true}
          />
        </div>
      )}
    </>
  );
}

// Componente para banner lateral
function BannerSideSection() {
  const { sideBanners, fetchBanners, isLoading, error } = useBannerStore();

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  // Se não há dados e não está carregando, retorna null
  if (!isLoading && (!sideBanners || sideBanners.length === 0)) {
    return null;
  }

  return (
    <>
      {/* Loading state para banners */}
      {isLoading && (
        <div className="w-full">
          <div className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>
        </div>
      )}

      {/* Error state para banners */}
      {error && (
        <div className="w-full p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          Erro ao carregar banner lateral: {error}
        </div>
      )}

      {/* Seção de Banner Lateral */}
      {sideBanners && sideBanners.length > 0 && (
        <div className="sticky top-40">
          <SimpleImageCarousel
            images={sideBanners}
            variant="vertical"
            autoPlay={true}
          />
        </div>
      )}
    </>
  );
}

// Componente para banner pop-up
function BannerPopUpSection() {
  const { popUpBanners, fetchBanners, isLoading, error } = useBannerStore();
  const [isVisible, setIsVisible] = useState(false);
  const [api, setApi] = useState<any>(null);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  useEffect(() => {
    if (popUpBanners && popUpBanners.length > 0) {
      // Mostrar pop-up após 15 segundos inicialmente
      const initialTimer = setTimeout(() => {
        setIsVisible(true);
      }, 15000);

      // Configurar timer para mostrar pop-up a cada 3 minutos
      const intervalTimer = setInterval(() => {
        setIsVisible(true);
      }, 300000); // 5 minutos

      return () => {
        clearTimeout(initialTimer);
        clearInterval(intervalTimer);
      };
    }
  }, [popUpBanners]);

  // Auto-play para o carousel
  useEffect(() => {
    if (isVisible && api && popUpBanners && popUpBanners.length > 1) {
      const autoPlayTimer = setInterval(() => {
        api.scrollNext();
      }, 10000); // 3 segundos

      return () => clearInterval(autoPlayTimer);
    }
  }, [isVisible, api, popUpBanners]);

  // Se não há dados e não está carregando, retorna null
  if (!isLoading && (!popUpBanners || popUpBanners.length === 0)) {
    return null;
  }

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleBannerClick = (banner: { url: string; link: string }) => {
    if (banner && banner.link) {
      window.open(banner.link, "_blank", "noopener,noreferrer");
    }
  };

  return (
    isVisible &&
    popUpBanners &&
    popUpBanners.length > 0 &&
    !error &&
    !isLoading && (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
        <div className="relative max-w-4xl w-full max-h-[90vh]">
          {/* Botão fechar */}
          <button
            onClick={handleClose}
            className="cursor-pointer absolute top-2 right-2 z-10 rounded-full w-6 h-6 bg-red-600 flex justify-center items-center"
          >
            <XIcon className="w-4 h-4 text-white" />
          </button>

          {/* Carousel de Banners */}
          <Card className="p-0 overflow-hidden">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              setApi={setApi}
              className="w-full"
            >
              <CarouselContent>
                {popUpBanners.map((banner, index) => (
                  <CarouselItem key={index} className="pl-0">
                    <div className="p-0">
                      <div
                        className="cursor-pointer"
                        onClick={() => handleBannerClick(banner)}
                      >
                        <div
                          className="relative w-full aspect-square overflow-hidden rounded-lg"
                          style={{ maxHeight: "60vh" }}
                        >
                          <img
                            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${banner.url}`}
                            alt={`Banner pop-up ${index + 1}`}
                            className="w-full h-full object-cover"
                            style={{ maxHeight: "60vh" }}
                          />
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              {/* Navegação do carousel */}
              {popUpBanners.length > 1 && (
                <>
                  <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90" />
                  <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90" />
                </>
              )}
            </Carousel>
          </Card>
        </div>
      </div>
    )
  );
}

// Exportações dos componentes
export { BannerTopSection, BannerSideSection, BannerPopUpSection };
