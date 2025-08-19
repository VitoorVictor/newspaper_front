interface SocialColumnImageCardProps {
  image: {
    id: number;
    image_url: string;
    is_cover: number;
  };
  index: number;
  onClick: () => void;
}

export const SocialColumnImageCard = ({
  image,
  index,
  onClick,
}: SocialColumnImageCardProps) => {
  return (
    <div
      className="group cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-lg"
      onClick={onClick}
    >
      <div className="relative overflow-hidden rounded-lg bg-gray-100">
        <img
          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${image.image_url}`}
          alt={`Imagem ${index + 1}`}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {image.is_cover === 1 && (
          <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            Capa
          </div>
        )}
      </div>
    </div>
  );
};
