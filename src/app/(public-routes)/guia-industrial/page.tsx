import {
  BannerSideSection,
  BannerTopSection,
} from "@/components/banner-section";
import { CustomPagination } from "@/components/custom-pagination";
import { IndustryCard } from "@/components/industry-card.tsx";
import { ItemsSearch } from "@/components/items-seach";
import { PageHeader } from "@/components/page-header";
import industrialGuideService from "@/services/industrial-guide";
import sectorService from "@/services/sector";
import Image from "next/image";

interface GuiaIndustrialPageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function GuiaIndustrialPage({
  searchParams,
}: GuiaIndustrialPageProps) {
  const { pesquisa, setor, pagina } = await searchParams;

  const { data: dataSectors } = await sectorService.getAll();
  const { data: dataIndustrialGuide } = await industrialGuideService.getAll({
    search: pesquisa ?? "",
    sector: setor ?? "",
    page: Number(pagina) ?? 0,
  });

  return (
    <div className="space-y-0">
      {dataSectors && (
        <ItemsSearch
          data={dataSectors}
          searchParamKeyQS="setor"
          searchMode="query"
        />
      )}
      <div className="bg-gray-100 p-2">
        <div className="container mx-auto space-y-2 md:space-y-4">
          <div className="flex gap-4">
            <div className="relative w-[30%] h-auto min-h-[100px] hidden lg:block">
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
          <PageHeader
            title="Guia Industrial"
            subtitle="Vejas as industrias de Umuarama e região."
            placeholder="Buscar industrias, setores, nome..."
            quickSearch={dataSectors.slice(0, 5).map((sector) => sector.name)}
            searchMode="query"
            searchParamKey="pesquisa"
            searchParamKeyQS="setor"
          />
          {dataIndustrialGuide.data.length > 0 && (
            <>
              <div className="grid lg:grid-cols-4 gap-6">
                {/* 3 colunas de cards */}
                <div className="lg:col-span-3">
                  <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {dataIndustrialGuide.data.map((industry) => (
                      <IndustryCard
                        key={industry.id}
                        id={industry.id}
                        sectors={industry.sectors}
                        title={industry.name}
                        slug={industry.slug}
                        image={`${process.env.NEXT_PUBLIC_IMAGE_URL}${industry.image_url}`}
                        address={industry.address}
                        number={industry.number}
                        description={industry.description}
                        instagram_url={industry.instagram_url}
                        facebook_url={industry.facebook_url}
                        linkedin_url={industry.linkedin_url}
                        website_url={industry.website_url}
                        whatsapp={industry.whatsapp}
                      />
                    ))}
                  </div>
                </div>

                {/* Banner lateral */}
                <div className="hidden lg:block col-span-1 order-last">
                  <BannerSideSection />
                </div>
              </div>
              <CustomPagination
                totalPages={dataIndustrialGuide.last_page}
                currentPage={dataIndustrialGuide.current_page}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
