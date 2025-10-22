import {
  BannerSideSection,
  BannerTopSection,
} from "@/components/banner-section";
import { CustomPagination } from "@/components/custom-pagination";
import { MagazineCard } from "@/components/magazine-card";
import { PageHeader } from "@/components/page-header";
import magazineService from "@/services/magazine";
import Image from "next/image";

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
    <div className="space-y-0">
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
                  <div className="sticky top-18">
                    <BannerSideSection />
                  </div>
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
    </div>
  );
}
