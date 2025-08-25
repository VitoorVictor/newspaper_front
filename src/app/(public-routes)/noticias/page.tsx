import {
  NewsMain,
  NewsSecondary,
  NewsSecondaryEditorial,
} from "@/components/news";
import { ItemsSearch } from "@/components/items-seach";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import categoryService from "@/services/category";
import newsService from "@/services/news";
import { ArrowRight } from "lucide-react";
import { SimpleImageCarousel } from "@/components/custom-carousel-banner";
import bannerService from "@/services/banner";
import SeeMoreBtn from "@/components/custom-btns/see-more-btn";

export default async function NoticiasPage() {
  const { data: dataNews } = await newsService.getAll();
  const { data: dataCategories } = await categoryService.getAll();
  const { data: dataAdBanners } = await bannerService.getAllTopSide();
  const { principais, editorias } = dataNews;

  const hasNewsByCategory = Boolean(
    editorias.find((editoria) => editoria.news.length > 0)
  );

  return (
    <div>
      {dataCategories && (
        <ItemsSearch
          data={dataCategories}
          searchMode="redirect"
          redirectBasePath="/noticias"
        />
      )}
      <div className="container mx-auto my-4 md:my-8 px-4 space-y-4 md:space-y-6">
        {/* Banner superior - apenas em desktop */}
        {dataAdBanners && dataAdBanners.top && dataAdBanners.top.length > 0 && (
          <SimpleImageCarousel
            images={dataAdBanners.top}
            variant="horizontal"
            autoPlay={true}
          />
        )}

        <PageHeader
          title="Notícias"
          subtitle="Fique por dentro das últimas notícias"
          placeholder="Buscar notícias, empresas, temas..."
          quickSearch={dataCategories
            .slice(0, 5)
            .map((category) => category.name)}
          searchMode="redirect"
          redirectBasePath="/noticias"
        />

        {/* Layout Principal com Secundárias ao lado - Responsivo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 md:gap-6">
          {principais &&
            principais.map((news, index) => {
              if (index === 0)
                return (
                  <NewsMain
                    key={news.id}
                    title={news.title}
                    description={news.sub_title}
                    badge={news.badge}
                    time={news.created_at}
                    image={`${process.env.NEXT_PUBLIC_IMAGE_URL}${news.image_url}`}
                    className="col-span-1 md:col-span-2 lg:col-span-7 lg:row-span-3"
                    slug={news.slug}
                  />
                );
              return (
                <NewsSecondary
                  key={news.id}
                  title={news.title}
                  description={news.sub_title}
                  badge={news.badge}
                  time={news.created_at}
                  image={`${process.env.NEXT_PUBLIC_IMAGE_URL}${news.image_url}`}
                  className="col-span-1 md:col-span-2 lg:col-span-5"
                  slug={news.slug}
                />
              );
            })}
        </div>

        {hasNewsByCategory && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Conteúdo principal - Full width em mobile, 3 colunas em desktop */}
            <div className="lg:col-span-3 space-y-8 md:space-y-10">
              {editorias.map((section, idx) => {
                if (section.news.length === 0) return null;
                return (
                  <div key={idx} className="space-y-4 md:space-y-6">
                    {/* Banner da seção - apenas em desktop */}
                    {section.banners && section.banners.length > 0 && (
                      <SimpleImageCarousel
                        images={section.banners}
                        variant="horizontal"
                        autoPlay={true}
                      />
                    )}

                    {/* Header da seção */}
                    <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                        {section.name}
                      </h2>
                      <SeeMoreBtn path={`/noticias/${section.name}`} />
                    </div>

                    {/* Grid de cards - Responsivo */}
                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                      {section.news.map((news) => (
                        <NewsSecondaryEditorial
                          key={news.id}
                          title={news.title}
                          badge={news.badge}
                          time={news.created_at}
                          image={`${process.env.NEXT_PUBLIC_IMAGE_URL}${news.image_url}`}
                          slug={news.slug}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Banner lateral - Full width em mobile, 1 coluna em desktop */}
            <div className="lg:col-span-1 order-first lg:order-last">
              {dataAdBanners &&
                dataAdBanners.side &&
                dataAdBanners.side.length > 0 && (
                  <div className="lg:sticky lg:top-40">
                    <SimpleImageCarousel
                      images={dataAdBanners.side}
                      variant="vertical"
                      autoPlay={true}
                    />
                  </div>
                )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
