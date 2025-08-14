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
      {dataCategories && <ItemsSearch data={dataCategories} />}
      <div className="container mx-auto my-8 px-4 space-y-6">
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
        />

        {/* Layout Principal com Secundárias ao lado */}
        <div className="grid grid-cols-10 grid-rows-3 gap-4 max-h-[500px]">
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
                    className="col-span-6 row-span-3"
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
                  className="col-span-4"
                />
              );
            })}
        </div>

        {hasNewsByCategory && (
          <div className="grid grid-cols-4 gap-8">
            <div className="col-span-3 space-y-10">
              {editorias.map((section, idx) => {
                if (section.news.length === 0) return null;
                return (
                  <div key={idx} className="space-y-4">
                    {section.banners && section.banners.length > 0 && (
                      <SimpleImageCarousel
                        images={section.banners}
                        variant="horizontal"
                        autoPlay={true}
                      />
                    )}
                    {/* Header da seção */}
                    <div className="w-full flex justify-between items-center">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {section.name}
                      </h2>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="border border-transparent hover:border-primary transition-colors duration-300 cursor-pointer"
                      >
                        <span className="mr-2">Veja mais</span>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Grid de cards */}
                    <div className="w-full flex justify-between gap-4">
                      {section.news.map((news) => (
                        <NewsSecondaryEditorial
                          key={news.id}
                          title={news.title}
                          badge={news.badge}
                          time={news.created_at}
                          image={`${process.env.NEXT_PUBLIC_IMAGE_URL}${news.image_url}`}
                          className="w-full"
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Banner lateral fixo */}
            <div className="col-span-1 h-fit sticky top-40">
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
        )}
      </div>
    </div>
  );
}
