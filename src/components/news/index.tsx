import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NewsProps {
  title: string;
  description: string;
  category: string;
  time: string;
  image: string;
}

export function NewsMain({
  title,
  description,
  category,
  time,
  image,
}: NewsProps) {
  return (
    <Card className="max-w-4xl overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer border-0 bg-white py-0">
      {/* Imagem com texto sobreposto */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Overlay escuro para melhor legibilidade */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

        {/* Badge da categoria */}
        <Badge className="absolute top-4 left-4 bg-secondary text-white font-medium px-3 py-1 z-10">
          {category}
        </Badge>

        {/* Botão de compartilhar */}
        <Button
          size="icon"
          variant="ghost"
          className="cursor-pointer absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white hover:text-white backdrop-blur-sm z-10"
        >
          <Share2 className="h-4 w-4" />
        </Button>

        {/* Conteúdo sobreposto */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
          {/* Título */}
          <h2 className="text-3xl font-bold mb-3 line-clamp-2 transition-colors duration-200">
            {title}
          </h2>

          {/* Descrição */}
          <p className="text-white/90 text-lg leading-relaxed mb-4 line-clamp-2">
            {description}
          </p>

          {/* Autor e metadados */}
          <div className="flex justify-between items-center gap-3">
            <div className="flex items-center gap-1 text-sm text-white/80">
              <Clock className="h-4 w-4" />
              {time}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer text-primary hover:bg-white/80 backdrop-blur-sm transition-all duration-200"
            >
              Ler mais
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function NewsSecondary({ title, category, time, image }: NewsProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer bg-white p-0 w-full">
      <div className="flex gap-4">
        {/* Imagem do lado esquerdo */}
        <div className="w-50 h-38 flex-shrink-0 overflow-hidden">
          <img
            src={image || "/placeholder.svg"}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Conteúdo do lado direito */}
        <div className="flex-1 py-3 pr-4 min-w-0">
          {/* Badge da categoria */}
          <Badge className="mb-2 text-xs px-2 py-0.5 bg-secondary">
            {category}
          </Badge>

          {/* Título */}
          <h3 className="font-bold text-gray-900 text-xl leading-tight mb-3 line-clamp-2 group-hover:text-[#182641] transition-colors duration-200">
            {title}
          </h3>

          {/* Hora */}
          <div className="flex items-center gap-1 text-xs text-gray-500 mt-auto">
            <Clock className="h-3 w-3" />
            <span>{time}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
