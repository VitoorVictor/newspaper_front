"use client";

import {
  useDeleteSocialColumns,
  useSocialColumns,
} from "@/hooks/tanstackQuery/useSocialColumns";
import { ISocialColumns } from "@/interfaces/social-column";
import { useState } from "react";
import { getSocialColumnsColumns } from "./columns";
import { Title } from "@/components/page-header/title";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AddBtn from "@/components/custom-btns/add-btn";
import { SearchBar } from "@/components/search-bar";
import { TableSkeleton } from "@/components/table-skeleton";
import { GenericTable } from "@/components/generic-table";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { ModalSocialColumns } from "@/components/modals/modal-social-column";
import { CustomPagination } from "@/components/custom-pagination";
import { useSearchParams } from "next/navigation";

export default function AdminColunaSocialPage() {
  //searchParams
  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page");
  const page = pageParam ? Number(pageParam) : 1;

  //states
  const [showModalSocialColumns, setShowModalSocialColumns] = useState(false);
  const [searchSocialColumns, setSearchSocialColumns] = useState("");
  const [selectedSocialColumns, setSelectedSocialColumns] =
    useState<ISocialColumns | null>(null);
  const [showConfirmDeleteSocialColumns, setShowConfirmDeleteSocialColumns] =
    useState(false);
  const [details, setDetails] = useState(false);

  //hooks
  const {
    data: socialColumns,
    isLoading: loadingSocialColumns,
    isError: errorSocialColumns,
  } = useSocialColumns({ search: searchSocialColumns, page });
  const deleteSocialColumnsMutation = useDeleteSocialColumns();

  //views
  const handleViewSocialColumns = (item: ISocialColumns) => {
    setSelectedSocialColumns(item);
    setShowModalSocialColumns(true);
    setDetails(true);
  };

  //edits
  const handleEditSocialColumns = (item: ISocialColumns) => {
    setSelectedSocialColumns(item);
    setShowModalSocialColumns(true);
  };

  //deletes
  const handleDeleteSocialColumns = (item: ISocialColumns) => {
    setSelectedSocialColumns(item);
    setShowConfirmDeleteSocialColumns(true);
  };

  //columns
  const newsColumns = getSocialColumnsColumns({
    onView: handleViewSocialColumns,
    onEdit: handleEditSocialColumns,
    onDelete: handleDeleteSocialColumns,
    onDeleteImg: handleDeleteSocialColumns,
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Title
        title="Administração de Coluna Social"
        subtitle="Gerencie as colunas sociais do sistema"
      />

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Exibindo Colunas Sociais</CardTitle>
            <AddBtn
              label="Novo Evento"
              onClick={() => setShowModalSocialColumns(true)}
            />
            {showModalSocialColumns && (
              <ModalSocialColumns
                onOpenChange={(open) => {
                  setShowModalSocialColumns(open);
                  setSelectedSocialColumns(null);
                  setDetails(open);
                }}
                details={details}
                title={`${
                  selectedSocialColumns?.id ? "Atualizar " : "Nova "
                } Coluna Social`}
                id={selectedSocialColumns?.id}
                slug={selectedSocialColumns?.slug}
              />
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* Filtros */}
          <div className="mb-6">
            <SearchBar
              placeholder="Pesquise pelo título da coluna social..."
              value={searchSocialColumns}
              onSearch={setSearchSocialColumns}
              onClear={() => setSearchSocialColumns("")}
            />
          </div>

          {loadingSocialColumns || (!socialColumns && !errorSocialColumns) ? (
            <TableSkeleton rows={5} cols={4} />
          ) : (
            <GenericTable
              data={socialColumns?.data.data ?? []}
              columns={newsColumns}
              getRowKey={(item) => item.id}
              onRowClick={handleViewSocialColumns}
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
        open={showConfirmDeleteSocialColumns}
        onOpenChange={(open) => {
          setShowConfirmDeleteSocialColumns(open);
          setSelectedSocialColumns(null);
        }}
        title="Confirmar exclusão"
        description={`Tem certeza que deseja excluir a coluna social "${selectedSocialColumns?.title}"?`}
        onConfirm={() => {
          if (selectedSocialColumns) {
            deleteSocialColumnsMutation.mutate(selectedSocialColumns.id);
          }
          setShowConfirmDeleteSocialColumns(false);
          setSelectedSocialColumns(null);
        }}
      />
    </div>
  );
}
