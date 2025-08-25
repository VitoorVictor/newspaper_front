"use client";

import type React from "react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { Title } from "@/components/page-header/title";
import { Input } from "@/components/ui/input";
import AddBtn from "@/components/custom-btns/add-btn";
import { SearchBar } from "@/components/search-bar";
import { ModalNews } from "@/components/modals/modal-news";
import { ModalCategory } from "@/components/modals/modal-category";
import { useNewsPanel, useDeleteNews } from "@/hooks/tanstackQuery/useNews";
import {
  useCategoriesPanel,
  useCategories,
  useDeleteCategory,
} from "@/hooks/tanstackQuery/useCategory";
import { getCategoriesColumns, getNewsColumns } from "./columns";
import { GenericTable } from "@/components/generic-table";
import { TableSkeleton } from "@/components/table-skeleton";
import { INews } from "@/interfaces/news";
import { ICategory } from "@/interfaces/category";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useSearchParams } from "next/navigation";
import { CustomPagination } from "@/components/custom-pagination";

export default function AdminNoticias() {
  //page search params
  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page");
  const page = pageParam ? Number(pageParam) : 1;

  // states
  const [filtroCategory, setFiltroCategory] = useState(0);
  const [showModalNews, setShowModalNews] = useState(false);
  const [showModalCategory, setShowModalCategory] = useState(false);
  const [pesquisaNews, setPesquisaNews] = useState("");
  const [viewNews, setViewNews] = useState(false);
  const [selectedNews, setSelectedNews] = useState<INews | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
    null
  );
  const [showConfirmDeleteNews, setShowConfirmDeleteNews] = useState(false);
  const [showConfirmDeleteCategory, setShowConfirmDeleteCategory] =
    useState(false);

  //hooks
  const {
    data: news,
    isLoading: loadingNews,
    isError: errorNews,
  } = useNewsPanel({ search: pesquisaNews, category: filtroCategory, page });
  const { data: categories, isLoading: loadingCategories } = useCategories();
  const {
    data: categoriesAdmin,
    isLoading: loadingCategoriesAdmin,
    isError: errorCategoriesAdmin,
  } = useCategoriesPanel();
  const deleteNewsMutation = useDeleteNews();
  const deleteCategoryMutation = useDeleteCategory();

  //views
  const handleViewNews = (item: INews) => {
    setSelectedNews(item);
    setShowModalNews(true);
    setViewNews(true);
  };

  //edits
  const handleEditNews = (item: INews) => {
    setSelectedNews(item);
    setShowModalNews(true);
  };
  const handleEditCategory = (item: ICategory) => {
    setSelectedCategory(item);
    setShowModalCategory(true);
  };

  //deletes
  const handleDeleteNews = (item: INews) => {
    setSelectedNews(item);
    setShowConfirmDeleteNews(true);
  };
  const handleDeleteCategory = (item: ICategory) => {
    setSelectedCategory(item);
    setShowConfirmDeleteCategory(true);
  };

  //columns
  const newsColumns = getNewsColumns({
    onView: handleViewNews,
    onEdit: handleEditNews,
    onDelete: handleDeleteNews,
  });
  const categoriesColumns = getCategoriesColumns({
    onEdit: handleEditCategory,
    onDelete: handleDeleteCategory,
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Title
        title="Administração de Notícias"
        subtitle="Gerencie notícias e editorias do sistema"
      />

      <Tabs defaultValue="noticias" className="space-y-6">
        <TabsList>
          <TabsTrigger value="noticias" className="cursor-pointer">
            Notícias
          </TabsTrigger>
          <TabsTrigger value="editorias" className="cursor-pointer">
            Editorias
          </TabsTrigger>
        </TabsList>

        {/* Tab de Notícias */}
        <TabsContent value="noticias">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Exibindo Notícias</CardTitle>
                <AddBtn
                  label="Nova Notícia"
                  onClick={() => setShowModalNews(true)}
                />
                {showModalNews && categories && (
                  <ModalNews
                    onOpenChange={(open) => {
                      setViewNews(open);
                      setShowModalNews(open);
                      setSelectedNews(null);
                    }}
                    title={`${
                      selectedNews?.id ? "Atualizar " : "Nova "
                    } Notícia`}
                    categories={categories.data}
                    id={selectedNews?.id}
                    slug={selectedNews?.slug}
                    view={viewNews}
                  />
                )}
              </div>
            </CardHeader>
            <CardContent>
              {/* Filtros */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <SearchBar
                    placeholder="Pesquisar notícias por título ou assunto..."
                    value={pesquisaNews}
                    onSearch={setPesquisaNews}
                    onClear={() => setPesquisaNews("")}
                  />
                </div>
                <Select
                  value={String(filtroCategory)}
                  onValueChange={(value) => {
                    setFiltroCategory(value === "0" ? 0 : Number(value));
                  }}
                >
                  <SelectTrigger className="w-20 md:w-48 cursor-pointer">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue
                      placeholder="Filtrar por editoria"
                      className="hidden md:block"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Todas as editorias</SelectItem>
                    {categories &&
                      categories.data.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={String(category.id)}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {loadingNews || (!news && !errorNews) ? (
                <TableSkeleton rows={5} cols={4} />
              ) : (
                <GenericTable
                  data={news?.data.data ?? []}
                  columns={newsColumns}
                  getRowKey={(item) => item.id}
                  onRowClick={handleViewNews}
                />
              )}
            </CardContent>
          </Card>
          {news && news.data && (
            <CustomPagination
              totalPages={news?.data.last_page}
              currentPage={news?.data.current_page}
            />
          )}
        </TabsContent>

        {/* Tab de Editorias */}
        <TabsContent value="editorias">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Exibindo Editorias</CardTitle>
                <AddBtn
                  label="Nova Editoria"
                  onClick={() => setShowModalCategory(true)}
                />
                {showModalCategory && (
                  <ModalCategory
                    onOpenChange={(open) => {
                      setShowModalCategory(open);
                      setSelectedCategory(null);
                    }}
                    title={`${
                      selectedCategory?.id ? "Atualizar " : "Nova "
                    } Editoria`}
                    id={selectedCategory?.id}
                  />
                )}
              </div>
            </CardHeader>
            <CardContent>
              {loadingCategoriesAdmin ||
              (!categoriesAdmin && !errorCategoriesAdmin) ? (
                <TableSkeleton rows={6} cols={5} />
              ) : (
                <GenericTable
                  data={categoriesAdmin?.data.data ?? []}
                  columns={categoriesColumns}
                  getRowKey={(item) => item.id}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <ConfirmDialog
        open={showConfirmDeleteNews}
        onOpenChange={(open) => {
          setShowConfirmDeleteNews(open);
          setSelectedNews(null);
        }}
        title="Confirmar exclusão"
        description={`Tem certeza que deseja excluir a notícia "${selectedNews?.title}"?`}
        onConfirm={() => {
          if (selectedNews) {
            deleteNewsMutation.mutate(selectedNews.id);
          }
          setShowConfirmDeleteNews(false);
          setSelectedNews(null);
        }}
      />

      <ConfirmDialog
        open={showConfirmDeleteCategory}
        onOpenChange={(open) => {
          setShowConfirmDeleteCategory(open);
          setSelectedCategory(null);
        }}
        title="Confirmar exclusão"
        description={`Tem certeza que deseja excluir a editoria "${selectedCategory?.name}"?`}
        onConfirm={() => {
          if (selectedCategory) {
            deleteCategoryMutation.mutate(selectedCategory.id);
          }
          setShowConfirmDeleteCategory(false);
          setSelectedCategory(null);
        }}
      />
    </div>
  );
}
