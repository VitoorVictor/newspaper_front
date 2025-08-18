import { SocialColumnImageCard } from "../social-column-image-card";

interface SocialColumnImagesSectionProps {
  images: Array<{
    id: number;
    image_url: string;
    is_cover: number;
  }>;
  onImageClick: (index: number) => void;
}

export const SocialColumnImagesSection = ({
  images,
  onImageClick,
}: SocialColumnImagesSectionProps) => {
  if (!images || images.length === 0) {
    return (
      <div className="col-span-full text-center py-12 text-gray-500">
        <svg
          className="w-16 h-16 mx-auto mb-4 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <p className="text-lg font-medium">Nenhuma imagem encontrada</p>
        <p className="text-sm">Esta coluna social ainda não possui imagens.</p>
      </div>
    );
  }

  return (
    <>
      {images.map((image, index) => (
        <SocialColumnImageCard
          key={image.id}
          image={image}
          index={index}
          onClick={() => onImageClick(index)}
        />
      ))}
    </>
  );
};
