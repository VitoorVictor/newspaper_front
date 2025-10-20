"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ISector } from "@/interfaces/sector";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface IndustryCardProps {
  image: string;
  title: string;
  sectors: ISector[];
  description: string;
  address: string;
  number: string;
  slug: string;
  id: number;
  instagram_url?: string;
  facebook_url?: string;
  linkedin_url?: string;
  website_url?: string;
  whatsapp?: string;
}

export function IndustryCard({
  image,
  title,
  sectors,
  slug,
  id,
}: IndustryCardProps) {
  const router = useRouter();

  return (
    <Card
      className="hover:shadow-xl transition-all duration-300 group bg-white w-full h-full flex flex-col overflow-hidden border-0 p-0 shadow-md cursor-pointer"
      onClick={() => router.push(`/guia-industrial/${slug}`)}
    >
      {/* Imagem de capa */}
      <div className="relative w-full h-48 bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-20 h-20 bg-white/80 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-400">
                {title.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        )}

        {/* Overlay gradiente sutil */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
      </div>

      <CardContent className="p-4 flex-1 flex flex-col justify-center">
        {/* Nome da empresa */}
        <h3 className="font-bold text-lg text-gray-900 text-center transition-colors line-clamp-2 leading-tight">
          {title}
        </h3>
      </CardContent>
    </Card>
  );
}
