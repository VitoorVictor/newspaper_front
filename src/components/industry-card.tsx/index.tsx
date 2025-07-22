import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail } from "lucide-react";

interface IndustryCardProps {
  logo: string;
  name: string;
  cnpj: string;
  address: string;
  city: string;
  state: string;
  sector: string;
  phone: string;
  email: string;
  description?: string;
  //   specialties?: string[];
}

export function IndustryCard({
  logo,
  name,
  cnpj,
  address,
  city,
  state,
  sector,
  phone,
  email,
  description,
}: //   specialties = [],
IndustryCardProps) {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 group cursor-pointer bg-white h-full flex flex-col justify-between">
      <CardHeader className="pb-4">
        {/* Logo e Nome */}
        <div className="flex items-start gap-4 mb-3">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
            <img
              src={logo || "/placeholder.svg?height=64&width=64"}
              alt={`Logo ${name}`}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-gray-900 line-clamp-2 group-hover:text-[#182641] transition-colors">
              {name}
            </h3>
            <Badge
              variant="secondary"
              className="mt-1 bg-[#182641]/10 text-[#182641] text-xs"
            >
              {sector}
            </Badge>
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
          {/* CNPJ */}
          <div className="text-xs text-gray-500">
            <span className="font-medium">CNPJ:</span> {cnpj}
          </div>

          {/* Endereço */}
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-gray-600">
              <div>{address}</div>
              <div>
                {city}, {state}
              </div>
            </div>
          </div>

          {/* Contato */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">{phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600 truncate">{email}</span>
            </div>
          </div>

          {/* Especialidades
          {specialties.length > 0 && (
            <div className="pt-2">
              <div className="text-xs font-medium text-gray-700 mb-2">
                Especialidades:
              </div>
              <div className="flex flex-wrap gap-1">
                {specialties.slice(0, 3).map((specialty, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-xs px-2 py-0.5"
                  >
                    {specialty}
                  </Badge>
                ))}
                {specialties.length > 3 && (
                  <Badge
                    variant="outline"
                    className="text-xs px-2 py-0.5 text-gray-500"
                  >
                    +{specialties.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          )} */}
        </div>

        {/* Botões de ação */}
        <div className="flex gap-2 pt-4 border-t border-gray-100">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 hover:bg-primary hover:text-white bg-transparent"
          >
            Contatar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
