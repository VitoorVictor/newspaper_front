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
import { ModalNoticia } from "@/components/modals/modal-noticia";
import { ModalEditoria } from "@/components/modals/modal-editoria";
import { useAdminNews } from "@/hooks/tanstackQuery/useNews";
import { useCategories } from "@/hooks/tanstackQuery/useCategory";
import { getCategoriesColumns, getNewsColumns } from "./columns";
import { GenericTable } from "@/components/generic-table";
import { TableSkeleton } from "@/components/table-skeleton";
import { INews } from "@/interfaces/news";
import { ICategory } from "@/interfaces/category";

export default function AdminNoticias() {
  // Estados para notícias
  const {
    data: news,
    isLoading: loadingNews,
    isError: errorNews,
  } = useAdminNews();
  const {
    data: categories,
    isLoading: loadingCategories,
    isError: errorCategories,
  } = useCategories();

  const [filtroEditoria, setFiltroEditoria] = useState("todas");

  const [showModalNoticia, setShowModalNoticia] = useState(false);
  const [showModalEditoria, setShowModalEditoria] = useState(false);

  const [pesquisaEditorias, setPesquisaEditorias] = useState("");
  const [pesquisaNoticias, setPesquisaNoticias] = useState("");

  const [selectedNews, setSelectedNews] = useState<INews | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
    null
  );

  const handleEditNews = (item: INews) => setSelectedNews(item);
  const handleDeleteNews = (item: INews) => setSelectedNews(item);

  const handleEditCategory = (item: ICategory) => setSelectedCategory(item);
  const handleDeleteCategory = (item: ICategory) => setSelectedCategory(item);

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
                  onClick={() => setShowModalNoticia(true)}
                />
                {showModalNoticia && categories && (
                  <ModalNoticia
                    onOpenChange={setShowModalNoticia}
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
                    value={pesquisaNoticias}
                    onSearch={setPesquisaNoticias}
                    onClear={() => setPesquisaNoticias("")}
                  />
                </div>
                <Select
                  value={filtroEditoria}
                  onValueChange={setFiltroEditoria}
                >
                  <SelectTrigger className="w-48">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filtrar por editoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas as editorias</SelectItem>
                    {categories &&
                      categories.data.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {/* {loadingNews || (!news && !errorNews) ? (
                <TableSkeleton rows={5} cols={4} />
              ) : (
                <GenericTable
                  data={news?.data ?? []}
                  columns={newsColumns}
                  getRowKey={(item) => item.id}
                />
              )} */}
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
                  onClick={() => setShowModalEditoria(true)}
                />
                {showModalEditoria && (
                  <ModalEditoria
                    onOpenChange={setShowModalEditoria}
                    title="Nova Editoria"
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
                    value={pesquisaEditorias}
                    onChange={(e) => setPesquisaEditorias(e.target.value)}
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
    </div>
  );
}
