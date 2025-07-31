import { BannerHorizontal, BannerVertical } from "@/components/ad-banners";
import {
  NewsMain,
  NewsSecondary,
  NewsSecondaryEditorial,
} from "@/components/news";
import { NewsCategories } from "@/components/news-categories";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { editorialSections } from "@/data";
import { ArrowRight } from "lucide-react";

export default function NoticiasPage() {
  return (
    <div>
      <NewsCategories />
      <div className="container mx-auto my-8 px-4 space-y-6">
        <BannerHorizontal />
        <PageHeader
          title="Notícias"
          subtitle="Fique por dentro das últimas notícias"
          placeholder="Buscar notícias, empresas, temas..."
          quickSearch={[
            "Tecnologia",
            "Economia",
            "Sustentabilidade",
            "Inovação",
            "Mercado",
          ]}
        />

        {/* Layout Principal com Secundárias ao lado */}
        <div className="grid grid-cols-3 grid-rows-3 gap-4 max-h-[500px]">
          <NewsMain
            title="Revolução tecnológica transforma setor industrial brasileiro"
            description="Empresas nacionais desenvolvem soluções inovadoras que prometem aumentar a produtividade em até 40% nos próximos dois anos, revolucionando completamente a forma como a indústria opera no país."
            category="Tecnologia"
            time="2 horas atrás"
            image="https://media.sankhya.com.br/wp-content/uploads/2018/06/revolucao-industrial.png"
            className="col-span-2 row-span-3"
          />
          <NewsSecondary
            title="Mercado financeiro registra alta histórica no trimestre"
            description="Bolsa de valores atinge novo recorde com crescimento sustentado e perspectivas otimistas para o próximo período."
            category="Economia"
            time="4 horas atrás"
            image="https://static.poder360.com.br/2025/07/Jair-Bolsonaro-Entrevista-Tornozeleira-848x477.png"
          />

          <NewsSecondary
            title="Setor automotivo anuncia investimentos bilionários"
            description="Montadoras confirmam R$ 2 bilhões em investimentos para modernização e expansão nos próximos anos."
            category="Automotivo"
            time="6 horas atrás"
            image="https://blog.coris.com.br/wp-content/uploads/2022/08/shutterstock_1658816260-1.jpg"
          />

          <NewsSecondary
            title="Energia renovável bate recorde de geração"
            description="Fontes limpas representam 85% da matriz energética nacional no último mês registrado."
            category="Energia"
            time="8 horas atrás"
            image="https://s2-g1.glbimg.com/rQXbuKaSOHP6KPVC1gI6b3BnIHg=/0x0:1080x1072/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_59edd422c0c84a879bd37670ae4f538a/internal_photos/bs/2025/g/g/j9v7BpSwO87VsvZxqDPQ/whatsapp-image-2025-07-18-at-19.17.35.jpeg"
          />
        </div>

        <div className="grid grid-cols-4 gap-8">
          <div className="col-span-3 space-y-10">
            {editorialSections.map((section, idx) => (
              <div key={idx} className="space-y-4">
                <BannerHorizontal />
                {/* Header da seção */}
                <div className="w-full flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {section.title}
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="border border-transparent hover:border-primary transition-colors duration-300 cursor-pointer"
                  >
                    <span className="mr-2">Veja mais</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>

                {/* Grid de cards */}
                <div className="w-full flex justify-between gap-4">
                  {section.items.map((item, i) => (
                    <NewsSecondaryEditorial
                      key={i}
                      title={item.title}
                      category={item.category}
                      time={item.time}
                      image={item.image}
                      className="w-full"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Banner lateral fixo */}
          <div className="col-span-1 h-fit sticky top-40">
            <BannerVertical />
          </div>
        </div>
      </div>
    </div>
  );
}
