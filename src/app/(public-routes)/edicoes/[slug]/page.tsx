import { SimpleImageCarousel } from "@/components/custom-carousel-banner";
import { Flipbook } from "@/components/flipbook";
import { Title } from "@/components/page-header/title";
import bannerService from "@/services/banner";
import maganizeService from "@/services/magazine";
import { formatDateTime } from "@/utils/formatDateTime";

interface EdicaoBySlugPageProps {
  params: Promise<{ slug: string }>;
}

export default async function EdicaoBySlugPage({
  params,
}: EdicaoBySlugPageProps) {
  const { slug } = await params;
  const { data } = await maganizeService.getBySlug(slug ?? "");
  const { data: dataAdBanners } = await bannerService.getAllTopSide();

  const revistaPages = [
    "/imgs/Contigo - Edição 2157 - (23 Janeiro 2017)_page-0001.jpg",
    "/imgs/Contigo - Edição 2157 - (23 Janeiro 2017)_page-0002.jpg",
    "/imgs/Contigo - Edição 2157 - (23 Janeiro 2017)_page-0003.jpg",
    "/imgs/Contigo - Edição 2157 - (23 Janeiro 2017)_page-0004.jpg",
    "/imgs/Contigo - Edição 2157 - (23 Janeiro 2017)_page-0005.jpg",
    "/imgs/Contigo - Edição 2157 - (23 Janeiro 2017)_page-0006.jpg",
    "/imgs/Contigo - Edição 2157 - (23 Janeiro 2017)_page-0007.jpg",
    "/imgs/Contigo - Edição 2157 - (23 Janeiro 2017)_page-0008.jpg",
    "/imgs/Contigo - Edição 2157 - (23 Janeiro 2017)_page-0009.jpg",
    "/imgs/Contigo - Edição 2157 - (23 Janeiro 2017)_page-0010.jpg",
    "/imgs/Contigo - Edição 2157 - (23 Janeiro 2017)_page-0011.jpg",
    "/imgs/Contigo - Edição 2157 - (23 Janeiro 2017)_page-0012.jpg",
    "/imgs/Contigo - Edição 2157 - (23 Janeiro 2017)_page-0013.jpg",
    "/imgs/Contigo - Edição 2157 - (23 Janeiro 2017)_page-0014.jpg",
    "/imgs/Contigo - Edição 2157 - (23 Janeiro 2017)_page-0015.jpg",
    "/imgs/Contigo - Edição 2157 - (23 Janeiro 2017)_page-0016.jpg",
    "/imgs/Contigo - Edição 2157 - (23 Janeiro 2017)_page-0017.jpg",
    "/imgs/Contigo - Edição 2157 - (23 Janeiro 2017)_page-0018.jpg",
    "/imgs/Contigo - Edição 2157 - (23 Janeiro 2017)_page-0019.jpg",
    "/imgs/Contigo - Edição 2157 - (23 Janeiro 2017)_page-0020.jpg",
  ];

  return (
    <div>
      <div className="container mx-auto my-8 px-4 space-y-6">
        {dataAdBanners && dataAdBanners.top && dataAdBanners.top.length > 0 && (
          <SimpleImageCarousel
            images={dataAdBanners.top}
            variant="horizontal"
            autoPlay={true}
          />
        )}
        <div className="border-b border-gray-200 pb-6">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <Title title={data.title} subtitle={data.description} />
            </div>

            {/* Informações da publicação */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mt-4">
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
                <span className="font-medium text-gray-700">Postado em:</span>
                <span>{formatDateTime(data.created_at, false)}</span>
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
                <span className="font-medium text-gray-700">
                  Atualizado em:
                </span>
                <span>{formatDateTime(data.updated_at, false)}</span>
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
                <span className="font-medium text-gray-700">Postado por:</span>
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                  Usuário #{data.user_id}
                </span>
              </div>
            </div>
          </div>
        </div>
        {data && <Flipbook images={revistaPages} />}
      </div>
    </div>
  );
}
