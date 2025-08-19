import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: Array<{
    id: number;
    image_url: string;
    is_cover: number;
  }>;
  currentImageIndex: number;
  onImageChange: (index: number) => void;
}

export const ImageViewerModal = ({
  isOpen,
  onClose,
  images,
  currentImageIndex,
  onImageChange,
}: ImageViewerModalProps) => {
  const currentImage = images[currentImageIndex];
  const isFirstImage = currentImageIndex === 0;
  const isLastImage = currentImageIndex === images.length - 1;

  const goToPrevious = () => {
    if (!isFirstImage) {
      onImageChange(currentImageIndex - 1);
    }
  };

  const goToNext = () => {
    if (!isLastImage) {
      onImageChange(currentImageIndex + 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft" && !isFirstImage) {
      goToPrevious();
    } else if (e.key === "ArrowRight" && !isLastImage) {
      goToNext();
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 bg-black/95 border-0">
        <DialogTitle></DialogTitle>
        <div className="relative w-full h-full">
          {/* Botão de fechar */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white border-0"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </Button>

          {/* Imagem principal */}
          <div className="flex items-center justify-center w-full h-full min-h-[60vh]">
            <img
              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${currentImage?.image_url}`}
              alt={`Imagem ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
              onKeyDown={handleKeyDown}
              tabIndex={0}
            />
          </div>

          {/* Navegação por setas */}
          {!isFirstImage && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white border-0"
              onClick={goToPrevious}
            >
              <ChevronLeft className="w-8 h-8" />
            </Button>
          )}

          {!isLastImage && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white border-0"
              onClick={goToNext}
            >
              <ChevronRight className="w-8 h-8" />
            </Button>
          )}

          {/* Indicador de posição */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {currentImageIndex + 1} de {images.length}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
