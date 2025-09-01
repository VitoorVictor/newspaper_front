import SeeMoreBtn from "@/components/custom-btns/see-more-btn";
import { SimpleImageCarousel } from "@/components/custom-carousel-banner";
import { IndustryCard } from "@/components/industry-card.tsx";
import { MagazineCard } from "@/components/magazine-card";
import { NewsMain, NewsSecondary } from "@/components/news";
import { SocialEventCard } from "@/components/social-card";
import { BannerTopSection } from "@/components/banner-section";
import homeService from "@/services/home";

export default async function HomePage() {
  const { data } = await homeService.get();

  const {
    principais_noticias,
    social_columns,
    magazines,
    industrial_guides,
    banners_home,
  } = data;

  return (
    <div className="space-y-0">
      {/* Seção de Banner - usando store Zustand */}
      <BannerTopSection />

      {/* Notícias Principais */}
      {principais_noticias && principais_noticias.length > 0 && (
        <div className="container mx-auto my-4 md:my-8 p-4 space-y-4 md:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 lg:grid-rows-3 gap-4 lg:max-h-[500px]">
            {principais_noticias.map((news: any, index: number) => {
              if (index === 0)
                return (
                  <NewsMain
                    key={news.id}
                    title={news.title}
                    description={news.sub_title}
                    badge={news.badge}
                    time={news.created_at}
                    image={`${process.env.NEXT_PUBLIC_IMAGE_URL}${news.image_url}`}
                    className="sm:col-span-2 lg:col-span-7 lg:row-span-3"
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
                  className="sm:col-span-1 lg:col-span-5"
                  slug={news.slug}
                />
              );
            })}
          </div>

          <div className="flex justify-center mt-8">
            <SeeMoreBtn
              path="/noticias"
              label="Ver todas as notícias"
              className="h-10 border border-primary/20 bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50"
              variant="outline"
            />
          </div>
        </div>
      )}

      {/* Seção do Guia Industrial - com cor de fundo que cobre toda a largura */}
      {industrial_guides && industrial_guides.length > 0 && (
        <div className="bg-gray-100 py-8 md:py-12 mt-8">
          {banners_home &&
            banners_home["home_1"] &&
            banners_home["home_1"].length > 0 && (
              <div className="container mx-auto my-4 md:my-8 p-4 space-y-4 md:space-y-6">
                <SimpleImageCarousel
                  images={banners_home["home_1"]}
                  variant="horizontal"
                  autoPlay={true}
                />
              </div>
            )}
          <div className="container mx-auto px-4 space-y-4 md:space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Guia Industrial
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Vejas as principais industrias e empresas da região
              </p>
            </div>

            <div className="grid lg:grid-cols-4 gap-6">
              {industrial_guides.map((industry: any) => (
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
            <div className="flex justify-center">
              <SeeMoreBtn
                path="/guias-industriais"
                label="Ver guia completo"
                className="h-10 border border-primary/20 bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50"
                variant="outline"
              />
            </div>
          </div>
        </div>
      )}

      {/* Seção da Coluna Social */}
      {social_columns && social_columns.length > 0 && (
        <div className="container mx-auto my-4 md:my-8 p-4 space-y-4 md:space-y-6">
          {banners_home &&
            banners_home["home_2"] &&
            banners_home["home_2"].length > 0 && (
              <div className="container mx-auto my-4 md:my-8 p-4 space-y-4 md:space-y-6">
                <SimpleImageCarousel
                  images={banners_home["home_2"]}
                  variant="horizontal"
                  autoPlay={true}
                />
              </div>
            )}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Coluna Social
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Acompanhe os principais eventos sociais e culturais da região
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {social_columns.map((socialColumn: any) => (
              <SocialEventCard
                key={socialColumn.id}
                title={socialColumn.title}
                slug={socialColumn.slug}
                photoCount={socialColumn.images.length}
                eventLogo={
                  socialColumn.images.find((sci: any) => sci.is_cover === 1)
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
      )}

      {/* Seção da Coluna Social */}
      {magazines && magazines.length > 0 && (
        <div className="container mx-auto my-4 md:my-8 p-4 space-y-4 md:space-y-6">
          {banners_home &&
            banners_home["home_3"] &&
            banners_home["home_3"].length > 0 && (
              <div className="container mx-auto my-4 md:my-8 p-4 space-y-4 md:space-y-6">
                <SimpleImageCarousel
                  images={banners_home["home_3"]}
                  variant="horizontal"
                  autoPlay={true}
                />
              </div>
            )}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Edições</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Acompanhe as edições da revista Imagem Industrial
            </p>
          </div>
          <div className="grid lg:grid-cols-4 gap-6">
            {magazines.map((magazine: any) => (
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
          <div className="flex justify-center">
            <SeeMoreBtn
              path="/edicoes"
              label="Ver todas as edições"
              className="h-10 border border-primary/20 bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50"
              variant="outline"
            />
          </div>
        </div>
      )}
    </div>
  );
}
