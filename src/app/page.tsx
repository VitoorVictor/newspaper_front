import { BannerHorizontal } from "@/components/ad-banners";
import { Navbar } from "@/components/navbar";
import { NewsMain, NewsSecondary } from "@/components/news";
import { NewsCategories } from "@/components/news-categories";
import { PageHeader } from "@/components/page-header";

export default function NoticiasPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <NewsCategories />
      <div className="container mx-auto my-8 px-4 space-y-6">
        <BannerHorizontal />
        <PageHeader
          title="Notícias"
          subtitle="Fique por dentro das últimas notícias"
        />

        {/* Layout Principal com Secundárias ao lado */}
        <div className="flex justify-between gap-x-8">
          <div className="min-w-3/5">
            <NewsMain
              title="Revolução tecnológica transforma setor industrial brasileiro"
              description="Empresas nacionais desenvolvem soluções inovadoras que prometem aumentar a produtividade em até 40% nos próximos dois anos, revolucionando completamente a forma como a indústria opera no país."
              category="Tecnologia"
              time="2 horas atrás"
              image="https://media.sankhya.com.br/wp-content/uploads/2018/06/revolucao-industrial.png"
            />
          </div>
          <div className="flex flex-col justify-between">
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
        </div>

        <BannerHorizontal />

        {/* <EditorialSection /> */}
      </div>
    </div>
  );
}
