"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { clsx } from "clsx";
import ShareBtn from "@/components/custom-btns/share-btn";
import { formatTimeAgo } from "@/utils/formatTimeAgo";
import ReadMoreBtn from "../custom-btns/read-more-btn";
import { useRouter } from "next/navigation";

interface NewsProps {
  title: string;
  description?: string;
  badge?: string;
  time: string;
  image: string;
  className?: string;
  slug: string;
}

export function NewsMain({
  title,
  description = "",
  badge,
  time,
  image,
  className,
  slug,
}: NewsProps) {
  const router = useRouter();
  return (
    <Card
      onClick={() => router.push(`/noticia/${slug}`)}
      className={clsx(
        "relative h-full overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer border-0 bg-white py-0 bg-cover bg-center",
        className
      )}
      style={{
        backgroundImage: image ? `url(${image})` : undefined,
      }}
    >
      <div className="relative h-full lg:aspect-video overflow-hidden bg-gradient-to-t from-black/80 via-black/40 to-black/20">
        {badge && (
          <Badge className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-secondary text-white font-medium px-2 sm:px-3 py-0.5 sm:py-1 z-10">
            {badge}
          </Badge>
        )}

        <ShareBtn url={`${process.env.NEXT_PUBLIC_APP_URL}/noticias/${slug}`} />

        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white z-10">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 line-clamp-2">
            {title}
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-white/90 leading-relaxed mb-4 line-clamp-2">
            {description}
          </p>
          <div className="flex justify-between items-center gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-1 text-white/80">
              <Clock className="h-4 w-4" />
              Publicada {formatTimeAgo(time)}
            </div>
            <ReadMoreBtn path={`/noticia/${slug}`} />
          </div>
        </div>
      </div>
    </Card>
  );
}

export function NewsSecondary({
  title,
  badge,
  time,
  image,
  className,
  slug,
}: NewsProps) {
  const router = useRouter();
  return (
    <Card
      onClick={() => router.push(`/noticia/${slug}`)}
      className={clsx(
        "flex flex-row h-full w-full overflow-hidden bg-white p-0 gap-1 transition-all duration-300 hover:shadow-lg group cursor-pointer",
        className
      )}
    >
      {/* Imagem do lado esquerdo */}
      <div className="w-32 sm:w-40 md:w-52 lg:w-60 h-full flex-shrink-0 overflow-hidden relative">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* ShareBtn ajustado: botão flutuante no canto superior direito da imagem */}
        <ShareBtn url={`${process.env.NEXT_PUBLIC_APP_URL}/noticias/${slug}`} />
      </div>

      {/* Conteúdo do lado direito */}
      <div className="flex flex-col justify-between p-3 flex-1 min-w-0">
        <div className="flex flex-col flex-1 min-h-0">
          {badge && (
            <Badge className="mb-2 text-xs px-2 py-0.5 bg-secondary">
              {badge}
            </Badge>
          )}

          <h3
            className="w-full overflow-hidden text-ellipsis line-clamp-2 font-bold text-gray-900 text-lg group-hover:text-[#182641] transition-colors duration-200"
            title={title}
          >
            {title}
          </h3>
        </div>

        <div className="flex justify-end items-center gap-1 text-xs text-gray-500">
          <Clock className="h-3 w-3" />
          <span>Publicada {formatTimeAgo(time)}</span>
        </div>
      </div>
    </Card>
  );
}

export function NewsMainEditorial({
  title,
  description,
  badge,
  time,
  image,
  slug,
}: NewsProps) {
  const router = useRouter();
  return (
    <Card
      onClick={() => router.push(`/noticia/${slug}`)}
      className="overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer bg-white"
    >
      {/* Imagem */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Badge da categoria */}
        <Badge className="absolute top-3 left-3 bg-[#182641] text-white text-xs px-2 py-1 z-10">
          {badge}
        </Badge>

        {/* Botão de compartilhar */}
        <ShareBtn url={`${process.env.NEXT_PUBLIC_APP_URL}/noticias/${slug}`} />
      </div>

      {/* Conteúdo fora da imagem */}
      <div className="p-4">
        {/* Título */}
        <h2 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-[#182641] transition-colors">
          {title}
        </h2>

        {/* Descrição */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>

        {/* Metadados */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="h-3 w-3" />
            <span>Publicada {formatTimeAgo(time)}</span>
          </div>
          <ReadMoreBtn path={`/noticia/${slug}`} />
        </div>
      </div>
    </Card>
  );
}

export function NewsSecondaryEditorial({
  title,
  badge,
  time,
  image,
  className,
  slug,
}: NewsProps) {
  const router = useRouter();
  return (
    <Card
      onClick={() => router.push(`/noticia/${slug}`)}
      className={clsx(
        "relative h-full overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer border-0 bg-white py-0 bg-cover bg-center",
        className
      )}
      style={{
        backgroundImage: image ? `url(${image})` : undefined,
      }}
    >
      <div className="relative h-48 sm:h-56 lg:h-52 overflow-hidden bg-gradient-to-t from-black/70 via-black/30 to-transparent">
        <Badge className="absolute top-2 left-2 bg-secondary text-white font-medium px-2 py-0.5 z-10">
          {badge}
        </Badge>

        <ShareBtn url={`${process.env.NEXT_PUBLIC_APP_URL}/noticias/${slug}`} />

        <div className="absolute bottom-0 left-0 right-0 p-3 text-white z-10">
          <h3 className="text-base sm:text-lg font-semibold line-clamp-2">
            {title}
          </h3>
          <div className="flex items-center gap-1 text-xs mt-2 text-white/80">
            <Clock className="h-3.5 w-3.5" />
            Publicada {formatTimeAgo(time)}
          </div>
        </div>
      </div>
    </Card>
  );
}
