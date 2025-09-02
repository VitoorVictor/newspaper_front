"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";

interface BannerItem {
  url: string;
  link: string;
}

interface SimpleImageCarouselProps {
  images: string[] | BannerItem[];
  variant?: "horizontal" | "vertical";
  autoPlay?: boolean;
  autoPlayInterval?: number;
  className?: string;
}

export function SimpleImageCarousel({
  images,
  variant = "horizontal",
  autoPlay = false,
  autoPlayInterval = 5000,
  className = "",
}: SimpleImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Verificar se é array de strings ou objetos com url/link
  const isBannerItems =
    images.length > 0 && typeof images[0] === "object" && "url" in images[0];
  const bannerItems = isBannerItems ? (images as BannerItem[]) : null;
  const stringImages = !isBannerItems ? (images as string[]) : null;

  const getImageUrl = (imagePath: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_IMAGE_URL || "";
    // Se a imagem já tem protocolo (http/https) ou é placeholder, retorna como está
    if (imagePath.startsWith("http") || imagePath.startsWith("/placeholder")) {
      return imagePath;
    }
    // Concatena com a URL base, garantindo que não há barras duplas
    return `${baseUrl}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
  };

  const getCurrentImageUrl = () => {
    if (bannerItems) {
      return getImageUrl(bannerItems[currentIndex]?.url || "");
    }
    return getImageUrl(stringImages?.[currentIndex] || "");
  };

  const getCurrentLink = () => {
    if (bannerItems) {
      return bannerItems[currentIndex]?.link || "";
    }
    return "";
  };

  const handleBannerClick = () => {
    const link = getCurrentLink();
    if (link) {
      window.open(link, "_blank", "noopener,noreferrer");
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto-play functionality
  useEffect(() => {
    if (autoPlay && images.length > 1) {
      const interval = setInterval(nextSlide, autoPlayInterval);
      return () => clearInterval(interval);
    }
  }, [autoPlay, autoPlayInterval, images.length]);

  if (!images.length) return null;

  const isHorizontal = variant === "horizontal";
  const hasLink = bannerItems && getCurrentLink();

  return (
    <div className={`relative group ${className}`}>
      <Card className="relative overflow-hidden p-0">
        <div
          className={`relative ${
            isHorizontal ? "aspect-[15/2]" : "aspect-[9/16]"
          }`}
        >
          {/* Current Image */}
          <div
            className={`relative w-full h-full ${
              hasLink ? "cursor-pointer" : ""
            }`}
            onClick={hasLink ? handleBannerClick : undefined}
          >
            <Image
              src={getCurrentImageUrl() || "/placeholder.svg"}
              alt={`Slide ${currentIndex + 1}`}
              fill
              className="object-contain transition-opacity duration-300"
              priority={currentIndex === 0}
            />
          </div>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                onClick={prevSlide}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                onClick={nextSlide}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>

        {/* Dots Indicator */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
            {images.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex
                    ? "bg-white"
                    : "bg-white/50 hover:bg-white/70"
                }`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
