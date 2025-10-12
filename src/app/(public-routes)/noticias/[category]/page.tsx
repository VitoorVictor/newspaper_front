import newsService from "@/services/news";
import { PageHeader } from "@/components/page-header";
import {
  NewsMain,
  NewsSecondary,
  NewsSecondaryEditorial,
} from "@/components/news";
import { ItemsSearch } from "@/components/items-seach";
import categoryService from "@/services/category";
import { CustomPagination } from "@/components/custom-pagination";
import {
  BannerSideSection,
  BannerTopSection,
} from "@/components/banner-section";
import Image from "next/image";

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

  return (
    <div className="space-y-0">
      {dataCategories && (
        <ItemsSearch
          data={dataCategories}
          searchMode="redirect"
          redirectBasePath="/noticias"
        />
      )}
      <div className="bg-gray-100 p-2">
        <div className="container mx-auto space-y-2 md:space-y-4">
          {/* Banner superior - apenas em desktop */}
          <div className="flex gap-4">
            <div className="relative w-[30%] h-auto min-h-[100px]">
              <Image
                src="/orange_logo.png"
                alt="Logo"
                fill
                className="object-contain transition-opacity duration-300"
              />
            </div>
            <div className="w-[70%]">
              <BannerTopSection />
            </div>
          </div>

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

          {/* Layout Principal das Notícias - Responsivo */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 md:gap-6">
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
                      className="col-span-1 md:col-span-2 lg:col-span-7 lg:row-span-3"
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
                      className="col-span-1 md:col-span-2 lg:col-span-5"
                      slug={news.slug}
                    />
                  );
              })}
          </div>

          {data.data.length > 4 && (
            <div className="grid lg:grid-cols-4 gap-6 lg:gap-8">
              {/* Conteúdo principal - Full width em mobile, 3 colunas em desktop */}
              <div className="lg:col-span-3 space-y-6 md:space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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

              {/* Banner lateral - Full width em mobile, 1 coluna em desktop */}
              <div className="hidden lg:block col-span-1 order-last">
                <BannerSideSection />
              </div>
            </div>
          )}
          <CustomPagination
            totalPages={data.last_page}
            currentPage={data.current_page}
          />
        </div>
      </div>
    </div>
  );
}
