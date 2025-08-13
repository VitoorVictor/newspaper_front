import { SimpleImageCarousel } from "@/components/custom-carousel-banner";
import { CustomPagination } from "@/components/custom-pagination";
import { IndustryCard } from "@/components/industry-card.tsx";
import { ItemsSearch } from "@/components/items-seach";
import { PageHeader } from "@/components/page-header";
import bannerService from "@/services/banner";
import industrialGuideService from "@/services/industrial-guide";
import sectorService from "@/services/sector";

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
  const { data: dataAdBanners } = await bannerService.getAllTopSide();

  return (
    <div>
      {dataSectors && (
        <ItemsSearch
          data={dataSectors}
          searchParamKeyQS="setor"
          searchMode="query"
        />
      )}
      <div className="container mx-auto my-8 px-4 space-y-6">
        {dataAdBanners && dataAdBanners.top && dataAdBanners.top.length > 0 && (
          <SimpleImageCarousel
            images={dataAdBanners.top}
            variant="horizontal"
            autoPlay={true}
          />
        )}
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
                    />
                  ))}
                </div>
              </div>

              {/* Banner lateral */}
              <div className="col-span-1 h-fit sticky top-20">
                {dataAdBanners &&
                  dataAdBanners.side &&
                  dataAdBanners.side.length > 0 && (
                    <SimpleImageCarousel
                      images={dataAdBanners.side}
                      variant="vertical"
                      autoPlay={true}
                    />
                  )}
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
  );
}
