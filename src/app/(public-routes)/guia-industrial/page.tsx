import { BannerHorizontal, BannerVertical } from "@/components/ad-banners";
import { CustomPagination } from "@/components/custom-pagination";
import { IndustryCard } from "@/components/industry-card.tsx";
import { PageHeader } from "@/components/page-header";
import { industriesData } from "@/data";

export default function GuiaIndustrialPage() {
  return (
    <div className="container mx-auto my-8 px-4 space-y-6">
      <BannerHorizontal />
      <PageHeader
        title="Guia Industrial"
        subtitle="Vejas as industrias de Umuarama e região."
        placeholder="Buscar industrias, ramos, cnpjs..."
        quickSearch={[
          "Agroindústria",
          "Automotivo",
          "Papel e Celulose",
          "Eletroeletrônicos",
          "Alimentos e Bebidas",
        ]}
      />
      <div className="grid lg:grid-cols-4 gap-6">
        {/* 3 colunas de cards */}
        <div className="lg:col-span-3">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {industriesData.map((industry, index) => (
              <IndustryCard key={index} {...industry} />
            ))}
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
