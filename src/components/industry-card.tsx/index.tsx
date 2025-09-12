"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Phone,
  Copy,
  Check,
  Instagram,
  Facebook,
  MessageCircle,
  Linkedin,
  Globe,
} from "lucide-react";
import { ISector } from "@/interfaces/sector";
import { useState } from "react";
import { toast } from "react-toastify";
import { formatPhone } from "@/utils/formatPhone";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
  description,
  address,
  number,
  slug,
  id,
  instagram_url,
  facebook_url,
  linkedin_url,
  website_url,
  whatsapp,
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
    <Card className="hover:shadow-xl transition-all duration-300 group bg-white h-full flex flex-col overflow-hidden border-0 shadow-md py-0 gap-0">
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

      <CardContent className="p-2 space-y-2 flex-1 flex flex-col">
        {/* Título */}
        <div>
          <h3 className="font-bold text-xl text-gray-900 transition-colors line-clamp-2 leading-tight">
            {title}
          </h3>
        </div>

        {/* Descrição */}
        {description && (
          <div className="flex-1">
            <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
              {description}
            </p>
            {description.length > 130 && (
              <Dialog>
                <DialogTrigger asChild>
                  <button className="ml-auto mt-2 text-xs text-gray-500 hover:text-gray-700 transition-colors duration-200 flex cursor-pointer items-center gap-1 group">
                    <span className="border-b border-dotted border-gray-300 group-hover:border-gray-500 transition-colors">
                      Ver descrição completa
                    </span>
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-gray-900">
                      {title}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-gray-600">
                      Descrição completa da empresa
                    </DialogDescription>
                  </DialogHeader>
                  <div className="mt-4">
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {description}
                    </p>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        )}

        {/* Informações de contato */}
        <div className="space-y-2">
          {/* Endereço */}
          {address && (
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
              <MapPin className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-gray-700 min-w-0 flex-1">
                <div className="font-medium mb-1">Endereço</div>
                <div className="text-gray-600 break-words leading-relaxed">
                  {address}
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

          {/* Mídias Sociais */}
          {(instagram_url ||
            facebook_url ||
            linkedin_url ||
            website_url ||
            whatsapp) && (
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="text-sm text-gray-600 mb-2 font-medium">
                Mídias Sociais
              </div>
              <div className="flex justify-center gap-2 flex-wrap">
                {instagram_url && (
                  <a
                    href={instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-medium rounded-full hover:from-pink-600 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <Instagram className="h-4 w-4" />
                  </a>
                )}
                {facebook_url && (
                  <a
                    href={facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white text-xs font-medium rounded-full hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <Facebook className="h-4 w-4" />
                  </a>
                )}
                {linkedin_url && (
                  <a
                    href={linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-2 bg-blue-700 text-white text-xs font-medium rounded-full hover:bg-blue-800 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                )}
                {website_url && (
                  <a
                    href={website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-2 bg-gray-700 text-white text-xs font-medium rounded-full hover:bg-gray-800 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <Globe className="h-4 w-4" />
                  </a>
                )}
                {whatsapp && (
                  <a
                    href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white text-xs font-medium rounded-full hover:bg-green-700 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
