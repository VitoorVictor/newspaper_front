import { SimpleImageCarousel } from "@/components/custom-carousel-banner";
import { CustomPagination } from "@/components/custom-pagination";
import { MagazineCard } from "@/components/magazine-card";
import { PageHeader } from "@/components/page-header";
import bannerService from "@/services/banner";
import magazineService from "@/services/magazine";

interface EdicoesPageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function EdicoesPage({ searchParams }: EdicoesPageProps) {
  const { pesquisa, pagina } = await searchParams;

  const { data } = await magazineService.getAll({
    search: pesquisa ?? "",
    page: Number(pagina) ?? 0,
  });
  const { data: dataAdBanners } = await bannerService.getAllTopSide();

  return (
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
          title="Edições"
          subtitle="Veja as edições da revista Imagem Industrial."
          placeholder="Buscar por edições..."
          searchMode="query"
          searchParamKey="pesquisa"
        />
        {data.data.length > 0 && (
          <>
            <div className="grid lg:grid-cols-5 gap-6">
              {/* 3 colunas de cards */}
              <div className="lg:col-span-4">
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {data.data.map((magazine) => (
                    <MagazineCard
                      key={magazine.id}
                      id={magazine.id}
                      title={magazine.title}
                      slug={magazine.slug}
                      image={`${process.env.NEXT_PUBLIC_IMAGE_URL}${magazine.image_url}`}
                      description={magazine.description}
                      created_at={magazine.created_at}
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
