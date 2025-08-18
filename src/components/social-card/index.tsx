import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Camera, Users, Eye } from "lucide-react";

interface SocialEventCardProps {
  title: string;
  // location: string;
  // date: string;
  photoCount: number;
  eventLogo: string;
  // category?: string;
  // views?: number;
  // featured?: boolean;
}

export function SocialEventCard({
  title,
  // location,
  // date,
  photoCount,
  eventLogo,
  // category = "Evento Social",
  // views,
  // featured = false,
}: SocialEventCardProps) {
  return (
    <Card className="hover:shadow-xl transition-all duration-300 group cursor-pointer bg-white h-full overflow-hidden py-0">
      {/* Header com logo do evento - MANTÉM IGUAL */}
      <CardHeader className="p-0 relative">
        <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
          <img
            src={
              `${process.env.NEXT_PUBLIC_IMAGE_URL}${eventLogo}` ||
              "/placeholder.svg?height=192&width=384"
            }
            alt={`Logo ${title}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
          {/* <Badge className="absolute top-3 left-3 bg-[#182641] text-white px-3 py-1 font-medium">
            {category}
          </Badge>
          {featured && (
            <Badge className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 font-medium">
              ⭐ Destaque
            </Badge>
          )} */}
          <div className="absolute bottom-3 right-3 bg-black/70 text-white px-3 py-1 rounded-full flex items-center gap-1 text-sm">
            <Camera className="h-4 w-4" />
            <span className="font-medium">{photoCount}</span>
          </div>
        </div>
      </CardHeader>

      {/* NOVA parte inferior - mais limpa e elegante */}
      <CardContent className="p-6">
        {/* Título */}
        <h3 className="font-bold text-xl text-gray-900 mb-4 line-clamp-2 group-hover:text-[#182641] transition-colors">
          {title}
        </h3>

        {/* Informações em linha simples */}
        {/* <div className="space-y-3 mb-6">
          <div className="flex items-center text-gray-600 text-sm">
            <Calendar className="h-4 w-4 mr-3 text-[#182641]" />
            <span>{date}</span>
          </div>

          <div className="flex items-center text-gray-600 text-sm">
            <MapPin className="h-4 w-4 mr-3 text-[#182641]" />
            <span className="truncate">{location}</span>
          </div>
        </div> */}

        {/* Estatísticas em linha horizontal */}
        {/* {views && (
          <div className="flex items-center justify-end text-xs text-gray-500 mb-4 py-2 border-t border-gray-100">
            {views && (
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span>{views} views</span>
              </div>
            )}
          </div>
        )} */}

        {/* Botão único */}
        <Button className="w-full bg-primary hover:bg-[#1e2d4a] text-white">
          Ver Galeria Completa
        </Button>
      </CardContent>
    </Card>
  );
}
