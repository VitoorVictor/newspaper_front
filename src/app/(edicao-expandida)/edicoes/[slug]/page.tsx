import { MagazineCard } from "@/components/magazine-card";
import maganizeService from "@/services/magazine";
import {
  PDFControlsWrapper,
  PDFHeaderControls,
  PDFViewerWrapper,
} from "./pdf-header-controls";

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

  const pdfFile =
    process.env.NODE_ENV === "development"
      ? "/ilovepdf_merged.pdf"
      : `${process.env.NEXT_PUBLIC_IMAGE_URL}${magazine.file}`;

  return (
    <PDFHeaderControls file={pdfFile}>
      <div className="min-h-screen w-full bg-gray-50">
        {/* Barra de controles no topo */}
        <div className="bg-white border-b border-gray-200 p-3 flex justify-center">
          <PDFControlsWrapper />
        </div>

        {/* PDF Viewer em tela cheia */}
        <div className="my-2">
          <PDFViewerWrapper file={pdfFile} />
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
    </PDFHeaderControls>
  );
}
