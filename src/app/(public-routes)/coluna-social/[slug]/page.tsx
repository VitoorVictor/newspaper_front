import { Title } from "@/components/page-header/title";
import socialColumnService from "@/services/social-column";
import { formatDateTime } from "@/utils/formatDateTime";
import { SocialColumnImageGallery } from "@/components/social-column-image-gallery";
import {
  BannerSideSection,
  BannerTopSection,
} from "@/components/banner-section";

interface ColunaSocialBySlugPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ColunaSocialBySlugPage({
  params,
}: ColunaSocialBySlugPageProps) {
  const { slug } = await params;
  const { data } = await socialColumnService.getBySlug(slug ?? "");
  return (
    <div>
      <div className="container mx-auto my-8 px-4 space-y-6">
        <BannerTopSection />
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
                <span>{formatDateTime(data.created_at)}</span>
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
                <span>{formatDateTime(data.updated_at)}</span>
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
        {data && (
          <div className="grid lg:grid-cols-4 gap-6">
            {/* 3 colunas de cards */}
            <div className="lg:col-span-3">
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                <SocialColumnImageGallery images={data.images || []} />
              </div>
            </div>

            {/* Banner lateral */}
            <div className="hidden lg:block col-span-1 order-last">
              <BannerSideSection />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
