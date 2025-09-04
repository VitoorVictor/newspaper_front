"use client";

import {
  useDeleteMagazine,
  useMagazines,
} from "@/hooks/tanstackQuery/useMagazine";
import { IMagazine } from "@/interfaces/magazine";
import { useState } from "react";
import { getMagazineColumns } from "./columns";
import { Title } from "@/components/page-header/title";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AddBtn from "@/components/custom-btns/add-btn";
import { SearchBar } from "@/components/search-bar";
import { TableSkeleton } from "@/components/table-skeleton";
import { GenericTable } from "@/components/generic-table";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { ModalMagazine } from "@/components/modals/modal-magazine";
import { CustomPagination } from "@/components/custom-pagination";
import { useSearchParams } from "next/navigation";

export default function AdminEdicoesPage() {
  //searchParams
  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page");
  const page = pageParam ? Number(pageParam) : 1;

  //states
  const [showModalMagazine, setShowModalMagazine] = useState(false);
  const [searchMagazine, setSearchMagazine] = useState("");
  const [selectedMagazine, setSelectedMagazine] = useState<IMagazine | null>(
    null
  );
  const [showConfirmDeleteMagazine, setShowConfirmDeleteMagazine] =
    useState(false);
  const [viewMagazine, setViewMagazine] = useState(false);

  //hooks
  const {
    data: socialColumns,
    isLoading: loadingMagazine,
    isError: errorMagazine,
  } = useMagazines({ search: searchMagazine, page });
  const deleteMagazineMutation = useDeleteMagazine();

  //views
  const handleViewMagazine = (item: IMagazine) => {
    setSelectedMagazine(item);
    setShowModalMagazine(true);
    setViewMagazine(true);
  };

  //edits
  const handleEditMagazine = (item: IMagazine) => {
    setSelectedMagazine(item);
    setShowModalMagazine(true);
  };

  //deletes
  const handleDeleteMagazine = (item: IMagazine) => {
    setSelectedMagazine(item);
    setShowConfirmDeleteMagazine(true);
  };

  //columns
  const newsColumns = getMagazineColumns({
    onView: handleViewMagazine,
    onEdit: handleEditMagazine,
    onDelete: handleDeleteMagazine,
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Title
        title="Administração de Edições"
        subtitle="Gerencie as edições das revistas"
      />

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Exibindo Edições de Revistas</CardTitle>
            <AddBtn
              label="Nova Revista"
              onClick={() => setShowModalMagazine(true)}
            />
            {showModalMagazine && (
              <ModalMagazine
                onOpenChange={(open) => {
                  setShowModalMagazine(open);
                  setViewMagazine(open);
                  setSelectedMagazine(null);
                }}
                view={viewMagazine}
                title={`${
                  selectedMagazine?.id ? "Atualizar " : "Nova "
                } Revista`}
                id={selectedMagazine?.id}
                slug={selectedMagazine?.slug}
              />
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* Filtros */}
          <div className="mb-6">
            <SearchBar
              placeholder="Pesquise pelo título da revista..."
              value={searchMagazine}
              onSearch={setSearchMagazine}
              onClear={() => setSearchMagazine("")}
            />
          </div>

          {loadingMagazine || (!socialColumns && !errorMagazine) ? (
            <TableSkeleton rows={5} cols={4} />
          ) : (
            <GenericTable
              data={socialColumns?.data.data ?? []}
              columns={newsColumns}
              getRowKey={(item) => item.id}
              onRowClick={handleViewMagazine}
            />
          )}
        </CardContent>
      </Card>
      {socialColumns && socialColumns.data && (
        <CustomPagination
          totalPages={socialColumns?.data.last_page}
          currentPage={socialColumns?.data.current_page}
        />
      )}

      <ConfirmDialog
        open={showConfirmDeleteMagazine}
        onOpenChange={(open) => {
          setShowConfirmDeleteMagazine(open);
          setSelectedMagazine(null);
        }}
        title="Confirmar exclusão"
        description={`Tem certeza que deseja excluir a edição "${selectedMagazine?.title}"?`}
        onConfirm={() => {
          if (selectedMagazine) {
            deleteMagazineMutation.mutate(selectedMagazine.id);
          }
          setShowConfirmDeleteMagazine(false);
          setSelectedMagazine(null);
        }}
      />
    </div>
  );
}
