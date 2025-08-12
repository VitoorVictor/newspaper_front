"use client";

import type React from "react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Title } from "@/components/page-header/title";
import AddBtn from "@/components/custom-btns/add-btn";
import { getBannersColumns } from "./columns";
import { GenericTable } from "@/components/generic-table";
import { TableSkeleton } from "@/components/table-skeleton";
import { useBanners } from "@/hooks/tanstackQuery/useBanner";
import { IBanner } from "@/interfaces/banner";
import { ModalBanner } from "@/components/modals/modal-banner";

export default function AdminAdBanners() {
  //states
  const [showModalBanner, setShowModalBanner] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<IBanner | null>(null);

  //hooks
  const { data, isLoading, isError } = useBanners();

  //edits
  const handleEditBanner = (item: IBanner) => {
    setSelectedBanner(item);
    setShowModalBanner(true);
  };

  //columns
  const bannersColumns = getBannersColumns({
    onEdit: handleEditBanner,
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Title
        title="Administração de banners de anúncio"
        subtitle="Gerencie os banners (imagens) de anúncios que aparecem no sistema."
      />

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Exibindo Banners Disponíveis</CardTitle>
            <AddBtn
              label="Novo Banner (Imagem)"
              onClick={() => setShowModalBanner(true)}
            />
            {showModalBanner && (
              <ModalBanner
                onOpenChange={(open) => {
                  setShowModalBanner(open);
                  setSelectedBanner(null);
                }}
                title={`${
                  selectedBanner?.id ? "Visualizar " : "Nova "
                } Imagem(s) do Banner`}
                id={selectedBanner?.id}
                banners={data?.data ?? []}
              />
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading || (!data && !isError) ? (
            <TableSkeleton rows={5} cols={4} />
          ) : (
            <GenericTable
              data={data?.data ?? []}
              columns={bannersColumns}
              getRowKey={(item) => item.id}
              onRowClick={handleEditBanner}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
