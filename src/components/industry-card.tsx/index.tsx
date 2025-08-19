"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Copy, Check } from "lucide-react";
import { ISector } from "@/interfaces/sector";
import { useState } from "react";
import { toast } from "react-toastify";
import { formatPhone } from "@/utils/formatPhone";

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
  const [copied, setCopied] = useState(false);

  const handleCopyPhone = async () => {
    try {
      await navigator.clipboard.writeText(number);
      setCopied(true);
      toast.success("Telefone copiado para a área de transferência!");

      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Erro ao copiar telefone");
    }
  };

  return (
    <Card className="hover:shadow-xl transition-all duration-300 group cursor-pointer bg-white h-full flex flex-col overflow-hidden border-0 shadow-md py-0">
      {/* Imagem de capa centralizada */}
      <div className="relative w-full h-48 bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={`${title}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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

        {/* Badges dos setores no topo da imagem */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
          {sectors.slice(0, 2).map((sector) => (
            <Badge
              key={sector.id}
              variant="secondary"
              className="bg-white/90 text-gray-800 text-xs font-medium border-0 shadow-sm"
            >
              {sector.name}
            </Badge>
          ))}
          {sectors.length > 2 && (
            <Badge
              variant="secondary"
              className="bg-white/90 text-gray-800 text-xs font-medium border-0 shadow-sm"
            >
              +{sectors.length - 2}
            </Badge>
          )}
        </div>
      </div>

      <CardContent className="p-6 space-y-4 flex-1 flex flex-col">
        {/* Título */}
        <div>
          <h3 className="font-bold text-xl text-gray-900 transition-colors line-clamp-2 leading-tight">
            {title}
          </h3>
        </div>

        {/* Descrição */}
        {description && (
          <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed flex-1">
            {description}
          </p>
        )}

        {/* Informações de contato */}
        <div className="space-y-3 pt-2">
          {/* Endereço */}
          {address && (
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <MapPin className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-gray-700">
                <div className="font-medium">Endereço</div>
                <div className="text-gray-600">
                  {address} - {number}
                </div>
              </div>
            </div>
          )}

          {/* Telefone */}
          {number && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
              <Phone className="h-4 w-4 text-gray-500 flex-shrink-0" />
              <div className="flex-1">
                <div className="text-sm text-gray-600 mb-1">Telefone</div>
                <div className="text-base font-medium text-gray-700">
                  {formatPhone(number)}
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCopyPhone}
                className="h-8 w-8 p-0 hover:bg-gray-100 text-gray-600 rounded-full cursor-pointer"
                title="Copiar telefone"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
