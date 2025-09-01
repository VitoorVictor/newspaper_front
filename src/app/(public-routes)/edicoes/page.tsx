import {
  BannerSideSection,
  BannerTopSection,
} from "@/components/banner-section";
import { CustomPagination } from "@/components/custom-pagination";
import { MagazineCard } from "@/components/magazine-card";
import { PageHeader } from "@/components/page-header";
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

  return (
    <div>
      <div className="container mx-auto my-8 px-4 space-y-6">
        <BannerTopSection />
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
              <div className="hidden lg:block col-span-1 order-last">
                <BannerSideSection />
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
