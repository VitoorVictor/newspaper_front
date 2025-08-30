import { SimpleImageCarousel } from "@/components/custom-carousel-banner";
import { MagazineCard } from "@/components/magazine-card";
import { Title } from "@/components/page-header/title";
import PDFViewer from "@/components/pdf-viewer";
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
  console.log("data: ", data);
  const { data: dataAdBanners } = await bannerService.getAllTopSide();
  const magazine = data.magazine;
  const related = data.related;

  if (!data) {
    return <div>Edição não encontrada</div>;
  }

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
              <Title title={magazine.title} subtitle={magazine.description} />
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
                <span>{formatDateTime(magazine.created_at, false)}</span>
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
                <span>{formatDateTime(magazine.updated_at, false)}</span>
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
                  {magazine.user.name}
                </span>
              </div>
            </div>
          </div>
        </div>
        {data && (
          <PDFViewer
            file={process.env.NODE_ENV === "development" ? "/pdfInDev.pdf" : `${process.env.NEXT_PUBLIC_IMAGE_URL}${magazine.file}`}
          />
        )}
        {related && related.length > 0 && (
          <>
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Veja mais edições da revista
              </h3>
            </div>
            <div className="grid lg:grid-cols-4 gap-6">
              {related.map((magazine) => (
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
          </>
        )}
      </div>
    </div>
  );
}
