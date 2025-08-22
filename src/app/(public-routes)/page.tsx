import SeeMoreBtn from "@/components/custom-btns/see-more-btn";
import { SimpleImageCarousel } from "@/components/custom-carousel-banner";
import { IndustryCard } from "@/components/industry-card.tsx";
import { NewsMain, NewsSecondary } from "@/components/news";
import { SocialEventCard } from "@/components/social-card";
import { Button } from "@/components/ui/button";
import bannerService from "@/services/banner";
import homeService from "@/services/home";
import { ArrowRight } from "lucide-react";

export default async function HomePage() {
  const { data: dataAdBanners } = await bannerService.getAllTopSide();
  const { data } = await homeService.get();

  const { news, social_columns, magazines, industrial_guides } = data;
  return (
    <div className="min-h-full my-8">
      <div className="px-[10.5%] mx-auto space-y-6 pb-6">
        {dataAdBanners && dataAdBanners.top && dataAdBanners.top.length > 0 && (
          <SimpleImageCarousel
            images={dataAdBanners.top}
            variant="horizontal"
            autoPlay={true}
          />
        )}

        <div className="grid grid-cols-12 grid-rows-3 gap-4 max-h-[500px]">
          {news &&
            news.map((news, index) => {
              if (index === 0)
                return (
                  <NewsMain
                    key={news.id}
                    title={news.title}
                    description={news.sub_title}
                    badge={news.badge}
                    time={news.created_at}
                    image={`${process.env.NEXT_PUBLIC_IMAGE_URL}${news.image_url}`}
                    className="col-span-7 row-span-3"
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
                  className="col-span-5"
                  slug={news.slug}
                />
              );
            })}
        </div>
        <div className="flex justify-center">
          <SeeMoreBtn
            path="/noticias"
            label="Ver todas as notícias"
            className="h-10 border border-primary/20 bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50"
            variant="outline"
          />
        </div>
      </div>
      <div className="px-[10.5%] mx-auto space-y-6 py-6 bg-white">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Guia Industrial
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Vejas as principais industrias e empresas da região
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {industrial_guides.map((industry) => (
            <IndustryCard
              key={industry.id}
              id={industry.id}
              sectors={[{ id: 1, name: "dadad" }]}
              title={industry.name}
              slug={industry.slug}
              image={`${process.env.NEXT_PUBLIC_IMAGE_URL}${industry.image_url}`}
              address={industry.address}
              number={industry.number}
              description={industry.description}
            />
          ))}
        </div>
        <div className="flex justify-center">
          <SeeMoreBtn
            path="/guias-industriais"
            label="Ver guia completo"
            className="h-10 border border-primary/20 bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50"
            variant="outline"
          />
        </div>
      </div>
      <div className="px-[10.5%] mx-auto space-y-6 pt-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Coluna Social
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Acompanhe os principais eventos sociais e culturais da região
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {social_columns.map((socialColumn) => (
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
        <div className="flex justify-center">
          <SeeMoreBtn
            path="/coluna-social"
            label="Ver todos os eventos"
            className="h-10 border border-primary/20 bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50"
            variant="outline"
          />
        </div>
      </div>
    </div>
  );
}
