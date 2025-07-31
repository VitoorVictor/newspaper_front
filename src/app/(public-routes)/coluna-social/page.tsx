import { BannerHorizontal, BannerVertical } from "@/components/ad-banners";
import { CustomPagination } from "@/components/custom-pagination";
import { PageHeader } from "@/components/page-header";
import { SocialEventCard } from "@/components/social-card";
import { sampleEvent } from "@/data";

export default function ColunaSocialPage() {
  return (
    <div className="container mx-auto my-8 px-4 space-y-6">
      <BannerHorizontal />
      <PageHeader
        title="Coluna Social"
        subtitle="Vejas eventos importantes que participamos na região."
        placeholder="Buscar eventos sociais, culturais, empresariais..."
        quickSearch={[
          "Feiras e Exposições",
          "Lançamentos de Produtos",
          "Eventos Corporativos",
          "Eventos Culturais",
          "Premiações e Homenagens",
        ]}
      />{" "}
      <div className="grid lg:grid-cols-4 gap-6">
        {/* 3 colunas de cards */}
        <div className="lg:col-span-3">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            <SocialEventCard {...sampleEvent} />
            <SocialEventCard {...sampleEvent} />
            <SocialEventCard {...sampleEvent} />
            <SocialEventCard {...sampleEvent} />
          </div>
        </div>

        {/* Banner lateral */}
        <div className="col-span-1 h-fit sticky top-20">
          <BannerVertical />
        </div>
      </div>
      <CustomPagination />
    </div>
  );
}
