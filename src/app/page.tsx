import { BannerHorizontal } from "@/components/ad-banners";
import { Navbar } from "@/components/navbar";
import { NewsCategories } from "@/components/news-categories";
import { PageHeader } from "@/components/page-header";

export default function NoticiasPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <NewsCategories />
      <div className="container mx-auto mt-8 px-4 space-y-4">
        <BannerHorizontal />
        <PageHeader title="Notícias" subtitle="Fique por dentro das últimas notícias"/>
      </div>
    </div>
  );
}
