import { BannerHorizontal, BannerVertical } from "@/components/ad-banners";
import { CustomPagination } from "@/components/custom-pagination";
import { IndustryCard } from "@/components/industry-card.tsx";
import { PageHeader } from "@/components/page-header";
import { industriesData } from "@/data";
import industrialGuideService from "@/services/industrial-guide";
import sectorService from "@/services/sector";

interface GuiaIndustrialPageProps {
  searchParams?: {
    [key: string]: string | undefined;
  };
}

export default async function GuiaIndustrialPage({
  searchParams = {},
}: GuiaIndustrialPageProps) {
  const search = searchParams.search ?? "";
  const sector = searchParams.sector ? Number(searchParams.sector) : 0;
  const page = searchParams.page ? Number(searchParams.page) : 1;

  const { data: dataSectors } = await sectorService.getAll();
  const { data: dataIndustrialGuide } = await industrialGuideService.getAll({
    search,
    sector,
    page,
  });

  return (
    <div className="container mx-auto my-8 px-4 space-y-6">
      <BannerHorizontal />
      <PageHeader
        title="Guia Industrial"
        subtitle="Vejas as industrias de Umuarama e região."
        placeholder="Buscar industrias, ramos, cnpjs..."
        quickSearch={dataSectors.slice(0, 5).map((sector) => sector.name)}
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
              <BannerVertical />
            </div>
          </div>
          <CustomPagination />
        </>
      )}
    </div>
  );
}
