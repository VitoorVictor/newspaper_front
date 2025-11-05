import {
  BannerIndustrialSection,
  BannerTopSection,
} from "@/components/banner-section";
import { NewsSecondaryEditorial } from "@/components/news";
import newsService from "@/services/news";
import { formatDateTime } from "@/utils/formatDateTime";
import Image from "next/image";

interface NoticiasByCategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function NoticiasByCategoryPage({
  params,
}: NoticiasByCategoryPageProps) {
  const { slug } = await params;

  const { data } = await newsService.getBySlug(slug);
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
          {/* Layout Principal com Conteúdo da Notícia e Banner Lateral */}
          <div className="grid lg:grid-cols-5 gap-6">
            {/* Conteúdo da Notícia - 3 colunas */}
            <div className="lg:col-span-4">
              <article className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Imagem de capa */}
                {data.image_url && (
                  <div className="w-full h-64 md:h-96 bg-gray-100 relative">
                    <img
                      src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${data.image_url}`}
                      alt={data.title}
                      className="w-full h-full object-cover object-center"
                    />
                    {data.badge && (
                      <span className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow">
                        {data.badge}
                      </span>
                    )}
                  </div>
                )}

                <div className="p-6 space-y-4">
                  {/* Categorias */}
                  {data.categories && data.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {data.categories.map((cat: any) => (
                        <span
                          key={cat.id}
                          className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium"
                        >
                          {cat.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Título e subtítulo */}
                  <h1 className="text-3xl font-bold text-gray-900">
                    {data.title}
                  </h1>
                  {data.sub_title && (
                    <h2 className="text-lg text-gray-600 font-medium">
                      {data.sub_title}
                    </h2>
                  )}

                  {/* Informações do autor e data */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mt-2">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>
                        Publicado em: {formatDateTime(data.created_at, false)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      <span>
                        Atualizado em: {formatDateTime(data.updated_at, false)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-purple-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <span>
                        Por:{" "}
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                          {data.user?.name || "Desconhecido"}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Conteúdo da notícia */}
                  <div
                    className="prose prose-lg max-w-none text-gray-800 mt-6"
                    dangerouslySetInnerHTML={{ __html: data.content || "" }}
                  />
                </div>
              </article>
            </div>

            {/* Banner lateral - 1 coluna */}
            <div className="hidden lg:block col-span-1 order-last">
              <div className="sticky top-18">
                <BannerIndustrialSection />
              </div>
            </div>
          </div>
          {data.related_news && data.related_news.length > 0 && (
            <div className="grid lg:grid-cols-4 gap-6">
              {data.related_news.map((news) => (
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
          )}
        </div>
      </div>
    </div>
  );
}
