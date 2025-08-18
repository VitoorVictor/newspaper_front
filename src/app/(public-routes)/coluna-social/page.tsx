import { BannerHorizontal, BannerVertical } from "@/components/ad-banners";
import { SimpleImageCarousel } from "@/components/custom-carousel-banner";
import { CustomPagination } from "@/components/custom-pagination";
import { PageHeader } from "@/components/page-header";
import { SocialEventCard } from "@/components/social-card";
import { sampleEvent } from "@/data";
import bannerService from "@/services/banner";
import socialColumnService from "@/services/social-column";

interface ColunaSocialPageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function ColunaSocialPage({
  searchParams,
}: ColunaSocialPageProps) {
  const { pesquisa, setor, pagina } = await searchParams;

  const { data } = await socialColumnService.getAll({
    search: pesquisa ?? "",
    page: Number(pagina) ?? 0,
  });
  const { data: dataAdBanners } = await bannerService.getAllTopSide();
  return (
    // <div className="container mx-auto my-8 px-4 space-y-6">
    //   <BannerHorizontal />
    //   <PageHeader
    //     title="Coluna Social"
    //     subtitle="Vejas eventos importantes que participamos na região."
    //     placeholder="Buscar eventos sociais, culturais, empresariais..."
    //     quickSearch={[
    //       "Feiras e Exposições",
    //       "Lançamentos de Produtos",
    //       "Eventos Corporativos",
    //       "Eventos Culturais",
    //       "Premiações e Homenagens",
    //     ]}
    //   />
    //   <div className="grid lg:grid-cols-4 gap-6">
    //     {/* 3 colunas de cards */}
    //     <div className="lg:col-span-3">
    //       <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
    //         <SocialEventCard {...sampleEvent} />
    //         <SocialEventCard {...sampleEvent} />
    //         <SocialEventCard {...sampleEvent} />
    //         <SocialEventCard {...sampleEvent} />
    //       </div>
    //     </div>

    //     {/* Banner lateral */}
    //     <div className="col-span-1 h-fit sticky top-20">
    //       <BannerVertical />
    //     </div>
    //   </div>
    //   <CustomPagination totalPages={0} currentPage={0} />
    // </div>
    <div>
      <div className="container mx-auto my-8 px-4 space-y-6">
        {dataAdBanners && dataAdBanners.top && dataAdBanners.top.length > 0 && (
          <SimpleImageCarousel
            images={dataAdBanners.top}
            variant="horizontal"
            autoPlay={true}
          />
        )}
        <PageHeader
          title="Coluna Social"
          subtitle="Vejas eventos importantes que participamos na região."
          placeholder="Buscar eventos sociais, culturais e etc..."
          searchMode="query"
          searchParamKey="pesquisa"
        />
        {data.data.length > 0 && (
          <>
            <div className="grid lg:grid-cols-4 gap-6">
              {/* 3 colunas de cards */}
              <div className="lg:col-span-3">
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {data.data.map((socialColumn) => (
                    <SocialEventCard
                      key={socialColumn.id}
                      title={socialColumn.title}
                      photoCount={socialColumn.images.length}
                      eventLogo={
                        socialColumn.images.find((sci) => sci.is_cover === 1)
                          ?.image_url || ""
                      }
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
              totalPages={data.last_page}
              currentPage={data.current_page}
            />
          </>
        )}
      </div>
    </div>
  );
}
