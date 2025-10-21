import {
  BannerSideSection,
  BannerTopSection,
} from "@/components/banner-section";
import SeeMoreBtn from "@/components/custom-btns/see-more-btn";
import { SimpleImageCarousel } from "@/components/custom-carousel-banner";
import { MagazineCard } from "@/components/magazine-card";
import { NewsMain, NewsSecondary } from "@/components/news";
import { SectorCard } from "@/components/sector-card";
import { SocialEventCard } from "@/components/social-card";
import homeService from "@/services/home";
import Image from "next/image";

export default async function HomePage() {
  const { data } = await homeService.get();

  const {
    principais_noticias,
    social_columns,
    magazines,
    sectors,
    banners_home,
  } = data;

  return (
    <div className="bg-gray-100">
      <div className="container mx-auto space-y-2 lg:space-y-8 p-2">
        {/* Seção de Banner */}
        <div className="flex items-center gap-4">
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

        {/* Grid principal com conteúdo e banner lateral */}
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Conteúdo principal - 3 colunas */}
          <div className="lg:col-span-4 space-y-2 lg:space-y-8">
            {/* Notícias Principais */}
            {principais_noticias && principais_noticias.length > 0 && (
              <div className="space-y-4">
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

                <div className="flex justify-center">
                  <SeeMoreBtn
                    path="/noticias"
                    label="Ver todas as notícias"
                    className="h-10 border border-primary/20 bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50"
                    variant="outline"
                  />
                </div>
              </div>
            )}

            {/* Banner Home 1 */}
            {banners_home &&
              banners_home["home_1"] &&
              banners_home["home_1"].length > 0 && (
                <SimpleImageCarousel
                  images={banners_home["home_1"]}
                  variant="horizontal"
                  autoPlay={true}
                />
              )}

            {/* Seção do Guia Industrial */}
            {sectors && sectors.length > 0 && (
              <div className="space-y-4">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Setores Industriais
                  </h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Conheça os principais setores industriais da região
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {sectors.map((sector: any) => (
                    <SectorCard
                      key={sector.id}
                      id={sector.id}
                      name={sector.name}
                      image={
                        sector.image_url
                          ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${sector.image_url}`
                          : undefined
                      }
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
            )}

            {/* Banner Home 2 */}
            {banners_home &&
              banners_home["home_2"] &&
              banners_home["home_2"].length > 0 && (
                <SimpleImageCarousel
                  images={banners_home["home_2"]}
                  variant="horizontal"
                  autoPlay={true}
                />
              )}

            {/* Seção da Coluna Empresarial */}
            {social_columns && social_columns.length > 0 && (
              <div className="space-y-4">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Coluna Empresarial
                  </h2>
                </div>

                <div className="grid lg:grid-cols-4 gap-6">
                  {social_columns.map((socialColumn: any) => (
                    <SocialEventCard
                      key={socialColumn.id}
                      title={socialColumn.title}
                      slug={socialColumn.slug}
                      photoCount={socialColumn.images.length}
                      eventLogo={
                        socialColumn.images.find(
                          (sci: any) => sci.is_cover === 1
                        )?.image_url || ""
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

            {/* Banner Home 3 */}
            {banners_home &&
              banners_home["home_3"] &&
              banners_home["home_3"].length > 0 && (
                <SimpleImageCarousel
                  images={banners_home["home_3"]}
                  variant="horizontal"
                  autoPlay={true}
                />
              )}

            {/* Seção de Edições */}
            {magazines && magazines.length > 0 && (
              <div className="space-y-4">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Edições
                  </h2>
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

          {/* Banner lateral - 1 coluna, sticky */}
          <div className="hidden lg:block col-span-1">
            <div className="sticky top-18">
              <BannerSideSection />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
