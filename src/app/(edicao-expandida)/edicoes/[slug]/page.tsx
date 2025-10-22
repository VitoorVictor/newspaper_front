import { MagazineCard } from "@/components/magazine-card";
import { Title } from "@/components/page-header/title";
import PDFViewer from "@/components/pdf-viewer";
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
  const magazine = data.magazine;
  const related = data.related;

  if (!data) {
    return <div>Edição não encontrada</div>;
  }

  return (
    <div className="min-h-screen w-full bg-gray-50">
      {/* Header compacto */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <Title title={magazine.title} subtitle={magazine.description} />

          {/* Informações da publicação compactas */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <svg
                className="w-3 h-3 text-blue-500"
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
              <span>{formatDateTime(magazine.created_at, false)}</span>
            </div>
            <div className="flex items-center gap-1">
              <svg
                className="w-3 h-3 text-green-500"
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
              <span>{formatDateTime(magazine.updated_at, false)}</span>
            </div>
            <div className="flex items-center gap-1">
              <svg
                className="w-3 h-3 text-purple-500"
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
              <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full text-xs font-medium">
                {magazine.user.name}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Viewer em tela cheia */}
      <div className="w-full">
        {data && (
          <PDFViewer
            file={
              process.env.NODE_ENV === "development"
                ? "/ilovepdf_merged.pdf"
                : `${process.env.NEXT_PUBLIC_IMAGE_URL}${magazine.file}`
            }
          />
        )}
      </div>

      {/* Seção relacionada */}
      {related && related.length > 0 && (
        <div className="bg-white border-t border-gray-200 py-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">
            Veja mais edições da revista
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
        </div>
      )}
    </div>
  );
}
