"use client";
import { useState } from "react";
import { SocialColumnImagesSection } from "../social-column-images-section";
import { ImageViewerModal } from "../modals/modal-image-viewer";

interface SocialColumnImageGalleryProps {
  images: Array<{
    id: number;
    image_url: string;
    is_cover: number;
  }>;
}

export const SocialColumnImageGallery = ({
  images,
}: SocialColumnImageGalleryProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  return (
    <>
      <SocialColumnImagesSection
        images={images}
        onImageClick={handleImageClick}
      />

      {/* Modal de visualização de imagens */}
      {images && images.length > 0 && (
        <ImageViewerModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          images={images}
          currentImageIndex={currentImageIndex}
          onImageChange={setCurrentImageIndex}
        />
      )}
    </>
  );
};
