import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail } from "lucide-react";
import { ISector } from "@/interfaces/sector";

interface IndustryCardProps {
  image: string;
  title: string;
  sectors: ISector[];
  description: string;
  address: string;
  number: string;
  slug: string;
  id: number;
}

export function IndustryCard({
  image,
  title,
  sectors,
  description,
  address,
  number,
  slug,
  id,
}: IndustryCardProps) {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 group cursor-pointer bg-white h-full flex flex-col justify-between">
      <CardHeader className="pb-4">
        {/* Logo e Nome */}
        <div className="flex items-start gap-4 mb-3 max-w-full overflow-hidden">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
            <img
              src={image || "/placeholder.svg?height=64&width=64"}
              alt={`Logo ${title}`}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex-1 min-w-0 max-w-full">
            <h3 className="font-bold text-lg text-gray-900 line-clamp-2 w-full group-hover:text-[#182641] transition-colors break-words">
              {title}
            </h3>

            {sectors.map((sector) => (
              <Badge
                key={sector.id}
                variant="secondary"
                className="mt-1 mr-1 bg-[#182641]/10 text-[#182641] text-xs"
              >
                {sector.name}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Descrição */}
        {description && (
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}

        {/* Informações principais */}
        <div className="space-y-3">
          {/* Endereço */}
          {address && (
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-gray-600">
                <div>
                  {address} - {number}
                </div>
              </div>
            </div>
          )}

          {/* Contato */}
          {/* <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">{phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600 truncate">{email}</span>
            </div>
          </div> */}
        </div>

        {/* Botões de ação */}
        <div className="flex gap-2 pt-4 border-t border-gray-100">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 hover:bg-primary hover:text-white bg-transparent cursor-pointer"
          >
            Contatar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
