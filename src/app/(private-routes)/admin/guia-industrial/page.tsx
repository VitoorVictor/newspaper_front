"use client";

import { IIndustrialGuide } from "@/interfaces/industrial-guide";
import { ISector } from "@/interfaces/sector";
import { getIndustrialGuideColumns, getSectorsColumns } from "./columns";
import {
  useDeleteIndustrialGuide,
  useIndustrialGuide,
} from "@/hooks/tanstackQuery/useIndustrialGuide";
import {
  useDeleteSector,
  useSectors,
  useSectorsPanel,
} from "@/hooks/tanstackQuery/useSector";
import { Title } from "@/components/page-header/title";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AddBtn from "@/components/custom-btns/add-btn";
import { SearchBar } from "@/components/search-bar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter } from "lucide-react";
import { TableSkeleton } from "@/components/table-skeleton";
import { GenericTable } from "@/components/generic-table";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { ModalSector } from "@/components/modals/modal-sector";
import { useState } from "react";
import { ModalIndustrialGuide } from "@/components/modals/modal-industrial-guide";
import { CustomPagination } from "@/components/custom-pagination";
import { useSearchParams } from "next/navigation";

export default function AdminGuiaIndustrialPage() {
  //page search params
  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page");
  const page = pageParam ? Number(pageParam) : 1;

  // states
  const [filtroSector, setFiltroSector] = useState("");
  const [pesquisaIndustrialGuide, setPesquisaIndustrialGuide] = useState("");

  const [showModalIndustrialGuide, setShowModalIndustrialGuide] =
    useState(false);
  const [showModalSector, setShowModalSector] = useState(false);
  const [viewIndustrialGuide, setViewIndustrialGuide] = useState(false);
  const [selectedIndustrialGuide, setSelectedIndustrialGuide] =
    useState<IIndustrialGuide | null>(null);
  const [selectedSector, setSelectedSector] = useState<ISector | null>(null);

  const [
    showConfirmDeleteIndustrialGuide,
    setShowConfirmDeleteIndustrialGuide,
  ] = useState(false);
  const [showConfirmDeleteSector, setShowConfirmDeleteSector] = useState(false);

  //hooks
  const {
    data: industrialGuide,
    isLoading: loadingIndustrialGuide,
    isError: errorIndustrialGuide,
  } = useIndustrialGuide({
    search: pesquisaIndustrialGuide,
    sector: filtroSector,
    page,
  });
  const { data: sectors } = useSectors();

  const {
    data: sectorsPanel,
    isLoading: loadingSectorsPanel,
    isError: errorSectorsPanel,
  } = useSectorsPanel();

  const deleteIndustrialGuideMutation = useDeleteIndustrialGuide();
  const deleteSectorMutation = useDeleteSector();

  //edits
  const handleViewIndustrialGuide = (item: IIndustrialGuide) => {
    setSelectedIndustrialGuide(item);
    setShowModalIndustrialGuide(true);
    setViewIndustrialGuide(true);
  };
  const handleEditIndustrialGuide = (item: IIndustrialGuide) => {
    setSelectedIndustrialGuide(item);
    setShowModalIndustrialGuide(true);
  };
  const handleEditSector = (item: ISector) => {
    setSelectedSector(item);
    setShowModalSector(true);
  };

  //deletes
  const handleDeleteIndustrialGuide = (item: IIndustrialGuide) => {
    setSelectedIndustrialGuide(item);
    setShowConfirmDeleteIndustrialGuide(true);
  };
  const handleDeleteSector = (item: ISector) => {
    setSelectedSector(item);
    setShowConfirmDeleteSector(true);
  };

  //columns
  const industrialGuideColumns = getIndustrialGuideColumns({
    onView: handleViewIndustrialGuide,
    onEdit: handleEditIndustrialGuide,
    onDelete: handleDeleteIndustrialGuide,
  });
  const sectorsColumns = getSectorsColumns({
    onEdit: handleEditSector,
    onDelete: handleDeleteSector,
  });
  return (
    <div className="container mx-auto p-6 space-y-6">
      <Title
        title="Administração de Guia Industrial"
        subtitle="Gerencie o guia de industrias e setores do sistema"
      />

      <Tabs defaultValue="insdustrial-guide" className="space-y-6">
        <TabsList>
          <TabsTrigger value="insdustrial-guide" className="cursor-pointer">
            Guia Industrial
          </TabsTrigger>
          <TabsTrigger value="sectors" className="cursor-pointer">
            Setores
          </TabsTrigger>
        </TabsList>

        {/* Tab de Guia Industrial */}
        <TabsContent value="insdustrial-guide">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Exibindo Industrias</CardTitle>
                <AddBtn
                  label="Nova Industria"
                  onClick={() => setShowModalIndustrialGuide(true)}
                />
                {showModalIndustrialGuide && sectors && (
                  <ModalIndustrialGuide
                    onOpenChange={(open) => {
                      setShowModalIndustrialGuide(open);
                      setViewIndustrialGuide(open);
                      setSelectedIndustrialGuide(null);
                    }}
                    title={`${
                      selectedIndustrialGuide?.id ? "Atualizar " : "Nova "
                    } Industria`}
                    sectors={sectors.data}
                    id={selectedIndustrialGuide?.id}
                    slug={selectedIndustrialGuide?.slug}
                    view={viewIndustrialGuide}
                  />
                )}
              </div>
            </CardHeader>
            <CardContent>
              {/* Filtros */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <SearchBar
                    placeholder="Pesquisar industria por nome ou endereço..."
                    value={pesquisaIndustrialGuide}
                    onSearch={setPesquisaIndustrialGuide}
                    onClear={() => setPesquisaIndustrialGuide("")}
                  />
                </div>
                <Select
                  value={filtroSector}
                  onValueChange={(value) => {
                    setFiltroSector(value === "all" ? "" : value);
                  }}
                >
                  <SelectTrigger className="w-48 cursor-pointer">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filtrar por setor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os setores</SelectItem>
                    {sectors &&
                      sectors.data.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {loadingIndustrialGuide ||
              (!industrialGuide && !errorIndustrialGuide) ? (
                <TableSkeleton rows={5} cols={4} />
              ) : (
                <GenericTable
                  data={industrialGuide?.data.data ?? []}
                  columns={industrialGuideColumns}
                  getRowKey={(item) => item.id}
                  onRowClick={handleViewIndustrialGuide}
                />
              )}
            </CardContent>
          </Card>
          {industrialGuide && industrialGuide.data && (
            <CustomPagination
              totalPages={industrialGuide?.data.last_page}
              currentPage={industrialGuide?.data.current_page}
            />
          )}
        </TabsContent>

        {/* Tab de Setores */}
        <TabsContent value="sectors">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Exibindo Setores</CardTitle>
                <AddBtn
                  label="Novo setor"
                  onClick={() => setShowModalSector(true)}
                />
                {showModalSector && (
                  <ModalSector
                    onOpenChange={(open) => {
                      setShowModalSector(open);
                      setSelectedSector(null);
                    }}
                    title={`${
                      selectedSector?.id ? "Atualizar " : "Novo "
                    } Setor`}
                    id={selectedSector?.id}
                  />
                )}
              </div>
            </CardHeader>
            <CardContent>
              {loadingSectorsPanel || (!sectorsPanel && !errorSectorsPanel) ? (
                <TableSkeleton rows={6} cols={5} />
              ) : (
                <GenericTable
                  data={sectorsPanel?.data.data ?? []}
                  columns={sectorsColumns}
                  getRowKey={(item) => item.id}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ConfirmDialog
        open={showConfirmDeleteIndustrialGuide}
        onOpenChange={(open) => {
          setShowConfirmDeleteIndustrialGuide(open);
          setSelectedIndustrialGuide(null);
        }}
        title="Confirmar exclusão"
        description={`Tem certeza que deseja excluir a industria "${selectedIndustrialGuide?.name}"?`}
        onConfirm={() => {
          if (selectedIndustrialGuide) {
            deleteIndustrialGuideMutation.mutate(selectedIndustrialGuide.id);
          }
          setShowConfirmDeleteIndustrialGuide(false);
          setSelectedIndustrialGuide(null);
        }}
      />

      <ConfirmDialog
        open={showConfirmDeleteSector}
        onOpenChange={(open) => {
          setShowConfirmDeleteSector(open);
          setSelectedSector(null);
        }}
        title="Confirmar exclusão"
        description={`Tem certeza que deseja excluir o setor "${selectedSector?.name}"?`}
        onConfirm={() => {
          if (selectedSector) {
            deleteSectorMutation.mutate(selectedSector.id);
          }
          setShowConfirmDeleteSector(false);
          setSelectedSector(null);
        }}
      />
    </div>
  );
}
