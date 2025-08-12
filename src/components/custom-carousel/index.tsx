import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { IBannerImage } from "@/interfaces/banner";

interface CustomCarouselProps {
  bannerImages: IBannerImage[];
  direction?: "horizontal" | "vertical";
  className?: string;
  showControls?: boolean;
  renderCustomButton?: (id: number, image: IBannerImage) => React.ReactNode;
}

export const CustomCarousel = ({
  bannerImages,
  direction = "horizontal",
  className,
  showControls = true,
  renderCustomButton,
  ...props
}: CustomCarouselProps) => {
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
    <Carousel
      orientation={direction}
      className={cn("w-full max-w-xs", className)}
      {...props}
    >
      <CarouselContent>
        {bannerImages.map((image, index) => {
          const url = `${process.env.NEXT_PUBLIC_IMAGE_URL}${image.image_url}`;
          return (
            <CarouselItem key={image.id} className="relative">
              <div className="p-1">
                <div className="relative">
                  <img
                    src={url || "/placeholder.svg"}
                    alt={`Slide ${index + 1}`}
                    className="w-full h-64 object-cover rounded-lg"
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
      {showControls && bannerImages.length > 1 && (
        <>
          <CarouselPrevious />
          <CarouselNext />
        </>
      )}
    </Carousel>
  );
};
