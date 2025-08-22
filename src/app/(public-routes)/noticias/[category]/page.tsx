import bannerService from "@/services/banner";
import newsService from "@/services/news";
import { SimpleImageCarousel } from "@/components/custom-carousel-banner";
import { PageHeader } from "@/components/page-header";
import {
  NewsMain,
  NewsSecondary,
  NewsSecondaryEditorial,
} from "@/components/news";
import { ItemsSearch } from "@/components/items-seach";
import categoryService from "@/services/category";

interface NoticiasByCategoryPageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function NoticiasByCategoryPage({
  params,
  searchParams,
}: NoticiasByCategoryPageProps) {
  const { category } = await params;
  const { pesquisa, pagina } = await searchParams;

  const { data } = await newsService.getAllByCategory({
    category: category === "Todas%20Editorias" ? "" : category,
    search: pesquisa ?? "",
    page: Number(pagina) ?? 0,
  });
  const { data: dataCategories } = await categoryService.getAll();
  const { data: dataAdBanners } = await bannerService.getAllTopSide();
  return (
    <div>
      {dataCategories && (
        <ItemsSearch
          data={dataCategories}
          searchMode="redirect"
          redirectBasePath="/noticias"
        />
      )}
      <div className="container mx-auto my-8 px-4 space-y-6">
        {dataAdBanners && dataAdBanners.top && dataAdBanners.top.length > 0 && (
          <SimpleImageCarousel
            images={dataAdBanners.top}
            variant="horizontal"
            autoPlay={true}
          />
        )}
        <PageHeader
          title={`${
            decodeURIComponent(category) === "Todas Editorias"
              ? "Últimas Notícias"
              : `Editoria de ${decodeURIComponent(category)}`
          }`}
          subtitle={`${
            decodeURIComponent(category) === "Todas Editorias"
              ? "Fique por dentro das últimas notícias"
              : `Fique por dentro das últimas notícias de ${decodeURIComponent(
                  category
                )}`
          }`}
          placeholder="Buscar pelo título..."
        />
        <div className="grid grid-cols-12 grid-rows-3 gap-4 max-h-[500px]">
          {data &&
            data.data.map((news, index) => {
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
              if (index === 1 || index === 2 || index === 3)
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
        {data.data.length > 4 && (
          <div className="grid grid-cols-4 gap-8">
            <div className="col-span-3 space-y-8">
              <div className="grid grid-cols-3 gap-4">
                {data.data.slice(4).map((news) => (
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
            {/* Banner lateral fixo */}
            <div className="col-span-1 sticky top-40">
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
