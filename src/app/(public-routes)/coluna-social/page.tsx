import {
  BannerSideSection,
  BannerTopSection,
} from "@/components/banner-section";
import { CustomPagination } from "@/components/custom-pagination";
import { PageHeader } from "@/components/page-header";
import { SocialEventCard } from "@/components/social-card";
import socialColumnService from "@/services/social-column";
import Image from "next/image";

interface ColunaSocialPageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function ColunaSocialPage({
  searchParams,
}: ColunaSocialPageProps) {
  const { pesquisa, pagina } = await searchParams;

  const { data } = await socialColumnService.getAll({
    search: pesquisa ?? "",
    page: Number(pagina) ?? 0,
  });
  return (
    <div>
      <div className="container mx-auto my-8 px-4 space-y-6">
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
          title="Coluna Empresarial"
          subtitle="Vejas eventos importantes que participamos na região."
          placeholder="Buscar eventos sociais, culturais e etc..."
          searchMode="query"
          searchParamKey="pesquisa"
        />
        {data.data.length > 0 && (
          <>
            <div className="grid lg:grid-cols-5 gap-6">
              {/* 3 colunas de cards */}
              <div className="lg:col-span-4">
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {data.data.map((socialColumn) => (
                    <SocialEventCard
                      key={socialColumn.id}
                      title={socialColumn.title}
                      slug={socialColumn.slug}
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
  );
}
