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
import { useAdminNews, useDeleteNews } from "@/hooks/tanstackQuery/useNews";
import {
  useCategories,
  useDeleteCategory,
} from "@/hooks/tanstackQuery/useCategory";
import { getCategoriesColumns, getNewsColumns } from "./columns";
import { GenericTable } from "@/components/generic-table";
import { TableSkeleton } from "@/components/table-skeleton";
import { INews } from "@/interfaces/news";
import { ICategory } from "@/interfaces/category";
import { ConfirmDialog } from "@/components/confirm-dialog";

export default function AdminNoticias() {
  // states
  const [filtroCategory, setFiltroCategory] = useState("");
  const [showModalNews, setShowModalNews] = useState(false);
  const [showModalCategory, setShowModalCategory] = useState(false);
  const [pesquisaCategory, setPesquisaCategory] = useState("");
  const [pesquisaNews, setPesquisaNews] = useState("");
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
  } = useAdminNews({ search: pesquisaNews, category: filtroCategory });
  const {
    data: categories,
    isLoading: loadingCategories,
    isError: errorCategories,
  } = useCategories();
  const deleteNewsMutation = useDeleteNews();
  const deleteCategoryMutation = useDeleteCategory();

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
          <TabsTrigger value="noticias">Notícias</TabsTrigger>
          <TabsTrigger value="editorias">Editorias</TabsTrigger>
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
                    onOpenChange={setShowModalNews}
                    title="Nova Notícia"
                    categories={categories.data}
                    id={selectedNews?.id}
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
                  value={filtroCategory}
                  onValueChange={(value) => {
                    setFiltroCategory(value === "all" ? "" : value);
                  }}
                >
                  <SelectTrigger className="w-48">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filtrar por editoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as editorias</SelectItem>
                    {categories &&
                      categories.data.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
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
                />
              )}
            </CardContent>
          </Card>
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
                    onOpenChange={setShowModalCategory}
                    title="Nova Editoria"
                    id={selectedCategory?.id}
                  />
                )}
              </div>
            </CardHeader>
            <CardContent>
              {/* Pesquisa */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Pesquisar editorias..."
                    value={pesquisaCategory}
                    onChange={(e) => setPesquisaCategory(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {loadingCategories || (!categories && !errorCategories) ? (
                <TableSkeleton rows={6} cols={5} />
              ) : (
                <GenericTable
                  data={categories?.data ?? []}
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
        onOpenChange={setShowConfirmDeleteNews}
        title="Confirmar exclusão"
        description={`Tem certeza que deseja excluir a notícia "${selectedNews?.title}"?`}
        onConfirm={() => {
          if (selectedNews) {
            deleteNewsMutation.mutate(selectedNews.id);
          }
          setShowConfirmDeleteNews(false);
        }}
      />

      <ConfirmDialog
        open={showConfirmDeleteCategory}
        onOpenChange={setShowConfirmDeleteCategory}
        title="Confirmar exclusão"
        description={`Tem certeza que deseja excluir a editoria "${selectedCategory?.name}"?`}
        onConfirm={() => {
          if (selectedCategory) {
            deleteCategoryMutation.mutate(selectedCategory.id);
          }
          setShowConfirmDeleteCategory(false);
        }}
      />
    </div>
  );
}
