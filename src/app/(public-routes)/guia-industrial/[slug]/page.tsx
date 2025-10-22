import {
  BannerSideSection,
  BannerTopSection,
} from "@/components/banner-section";
import industrialGuideService from "@/services/industrial-guide";
import { formatDateTime } from "@/utils/formatDateTime";
import { formatPhone } from "@/utils/formatPhone";
import {
  Facebook,
  Globe,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import Image from "next/image";

interface GuiaIndustrialBySlugPageProps {
  params: Promise<{ slug: string }>;
}

export default async function GuiaIndustrialBySlugPage({
  params,
}: GuiaIndustrialBySlugPageProps) {
  const { slug } = await params;

  const { data } = await industrialGuideService.getBySlug(slug);
  return (
    <div className="space-y-0">
      <div className="bg-gray-100 p-1 sm:p-2">
        <div className="container mx-auto space-y-2 md:space-y-4">
          <div className="flex gap-2 sm:gap-4">
            <div className="relative w-[30%] h-auto min-h-[80px] sm:min-h-[100px] hidden lg:block">
              <Image
                src="/orange_logo.png"
                alt="Logo"
                fill
                className="object-contain transition-opacity duration-300"
              />
            </div>
            <div className="w-full lg:w-[70%]">
              <BannerTopSection />
            </div>
          </div>
          {/* Layout Principal com Conteúdo da Notícia e Banner Lateral */}
          <div className="grid lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
            {/* Conteúdo do Guia Industrial - 3 colunas */}
            <div className="lg:col-span-4">
              <article className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
                  {/* Logo e informações da empresa */}
                  <div className="flex items-start gap-3 sm:gap-4 lg:gap-6">
                    {/* Logo da empresa fixo à esquerda */}
                    <div className="flex-shrink-0">
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gray-50 rounded-lg border-2 border-gray-200 flex items-center justify-center">
                        {data.image_url ? (
                          <Image
                            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${data.image_url}`}
                            alt={data.name}
                            fill
                            className="object-contain rounded-lg"
                          />
                        ) : (
                          <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-400">
                            {data.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Título e setores */}
                    <div className="flex-1 min-w-0">
                      <h1 className="text-lg sm:text-2xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 break-words">
                        {data.name}
                      </h1>

                      {/* Setores */}
                      {data.sectors && data.sectors.length > 0 && (
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                          {data.sectors.map((sector: any) => (
                            <span
                              key={sector.id}
                              className="bg-blue-100 text-blue-800 px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium"
                            >
                              {sector.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Descrição da empresa */}
                  {data.description && (
                    <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                        Sobre a Empresa
                      </h2>
                      <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {data.description}
                      </p>
                    </div>
                  )}

                  {/* Informações de contato */}
                  <div className="space-y-3 sm:space-y-4">
                    {/* Endereço */}
                    {data.address && (
                      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                        <div className="flex items-start gap-2 sm:gap-3">
                          <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 mt-0.5 sm:mt-1 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1 sm:mb-2">
                              Endereço
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed break-words">
                              {data.address}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Telefone */}
                    {data.number && (
                      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                        <div className="flex items-start gap-2 sm:gap-3">
                          <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 mt-0.5 sm:mt-1 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1 sm:mb-2">
                              Telefone
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-700 font-medium">
                              {formatPhone(data.number)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Website */}
                    {data.website_url && (
                      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                        <div className="flex items-start gap-2 sm:gap-3">
                          <Globe className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 mt-0.5 sm:mt-1 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1 sm:mb-2">
                              Website
                            </h3>
                            <a
                              href={data.website_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 underline break-all"
                            >
                              {data.website_url}
                            </a>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Email */}
                    {data.email && (
                      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                        <div className="flex items-start gap-2 sm:gap-3">
                          <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-0.5 sm:mt-1 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1 sm:mb-2">
                              Email
                            </h3>
                            <a
                              href={`mailto:${data.email}`}
                              className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 underline break-all"
                            >
                              {data.email}
                            </a>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Redes Sociais */}
                  {(data.instagram_url ||
                    data.facebook_url ||
                    data.linkedin_url ||
                    data.whatsapp) && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 sm:p-6">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 text-center">
                        Redes Sociais
                      </h3>
                      <div className="flex justify-center gap-2 sm:gap-3 lg:gap-4 flex-wrap">
                        {data.instagram_url && (
                          <a
                            href={data.instagram_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 sm:gap-2 px-2 py-1.5 sm:px-3 sm:py-2 lg:px-4 lg:py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md text-xs sm:text-sm"
                          >
                            <Instagram className="h-4 w-4 sm:h-5 sm:w-5" />
                            <span className="font-medium hidden md:inline">
                              Instagram
                            </span>
                          </a>
                        )}
                        {data.facebook_url && (
                          <a
                            href={data.facebook_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 sm:gap-2 px-2 py-1.5 sm:px-3 sm:py-2 lg:px-4 lg:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md text-xs sm:text-sm"
                          >
                            <Facebook className="h-4 w-4 sm:h-5 sm:w-5" />
                            <span className="font-medium hidden md:inline">
                              Facebook
                            </span>
                          </a>
                        )}
                        {data.linkedin_url && (
                          <a
                            href={data.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 sm:gap-2 px-2 py-1.5 sm:px-3 sm:py-2 lg:px-4 lg:py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-all duration-200 shadow-sm hover:shadow-md text-xs sm:text-sm"
                          >
                            <Linkedin className="h-4 w-4 sm:h-5 sm:w-5" />
                            <span className="font-medium hidden md:inline">
                              LinkedIn
                            </span>
                          </a>
                        )}
                        {data.whatsapp && (
                          <a
                            href={`https://wa.me/${data.whatsapp.replace(
                              /\D/g,
                              ""
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 sm:gap-2 px-2 py-1.5 sm:px-3 sm:py-2 lg:px-4 lg:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 shadow-sm hover:shadow-md text-xs sm:text-sm"
                          >
                            <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                            <span className="font-medium hidden md:inline">
                              WhatsApp
                            </span>
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Informações de cadastro */}
                  <div className="border-t pt-4 sm:pt-6 text-center text-xs sm:text-sm text-gray-500">
                    <p className="break-words">
                      Cadastrado em: {formatDateTime(data.created_at, false)} •
                      Atualizado em: {formatDateTime(data.updated_at, false)}
                    </p>
                  </div>
                </div>
              </article>
            </div>

            {/* Banner lateral - 1 coluna */}
            <div className="hidden lg:block col-span-1 order-last">
              <div className="sticky top-18">
                <BannerSideSection />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
