"use client";

import type { CarouselApi } from "@/components/ui/carousel";

import { CarouselNext } from "@/components/ui/carousel";

import { CarouselPrevious } from "@/components/ui/carousel";

import { CarouselItem } from "@/components/ui/carousel";

import { CarouselContent } from "@/components/ui/carousel";

import { Carousel } from "@/components/ui/carousel";

import * as React from "react";

import { cn } from "@/lib/utils";
// corrigindo import para usar o caminho correto das interfaces
import type { IBannerImage } from "@/interfaces/banner";

interface CustomCarouselProps {
  bannerImages: IBannerImage[];
  direction?: "horizontal" | "vertical";
  className?: string;
  showControls?: boolean;
  renderCustomButton?: (id: number, image: IBannerImage) => React.ReactNode;
}

const CustomCarousel = React.forwardRef<HTMLDivElement, CustomCarouselProps>(
  (
    {
      bannerImages,
      direction = "horizontal",
      className,
      showControls = true,
      renderCustomButton,
      ...props
    },
    ref
  ) => {
    if (!bannerImages || bannerImages.length === 0) {
      return (
        <div
          className={cn(
            "flex items-center justify-center bg-gray-100 rounded-lg",
            direction === "horizontal" ? "h-48" : "w-48 h-64",
            className
          )}
        >
          <p className="text-gray-500">Nenhuma imagem disponível</p>
        </div>
      );
    }

    return (
      // sempre usar orientação horizontal para manter rolagem horizontal
      <Carousel
        ref={ref}
        orientation="horizontal"
        className={cn("w-full max-w-xs", className)}
        {...props}
      >
        <CarouselContent>
          {bannerImages.map((image, index) => {
            const url = `${process.env.NEXT_PUBLIC_IMAGE_URL}${image.image_url}`;
            const isVertical = direction === "vertical";

            return (
              <CarouselItem key={image.id} className="relative">
                <div className="p-1">
                  <div
                    className={`relative mx-auto ${
                      isVertical
                        ? "aspect-[9/16] h-[65vh] max-h-[800px]"
                        : "aspect-[16/9] h-64"
                    }`}
                  >
                    <img
                      src={url || "/placeholder.svg"}
                      alt={`Slide ${index + 1}`}
                      className={`w-full h-full object-cover rounded-lg`}
                    />
                    {renderCustomButton && (
                      <div className="absolute top-2 right-2">
                        {renderCustomButton(image.id, image)}
                      </div>
                    )}
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        {/* controles só aparecem no modo horizontal quando há múltiplas imagens */}
        {showControls && bannerImages.length > 1 && (
          <>
            <CarouselPrevious />
            <CarouselNext />
          </>
        )}
      </Carousel>
    );
  }
);
CustomCarousel.displayName = "CustomCarousel";

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CustomCarousel,
};
