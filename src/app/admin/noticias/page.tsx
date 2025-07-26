"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Edit, Trash2, Plus, Search, Filter } from "lucide-react";
import { editoriasMock, noticiasMock } from "@/data";
import { Title } from "@/components/page-header/title";
import { Input } from "@/components/ui/input";
import AddBtn from "@/components/custom-btns/add-btn";
import { SearchBar } from "@/components/search-bar";
import { ModalNoticia } from "./components/modal-noticia";
import { ModalEditoria } from "./components/modal-editoria";
import { useNews } from "@/hooks/tanstackQuery/useNews";
import { useCategories } from "@/hooks/tanstackQuery/useCategory";

export default function AdminNoticias() {
  // Estados para notícias
  const { data: news, isLoading: loadingNews } = useNews();
  const { data: categories, isLoading: loadingCategories } = useCategories();
  const [filtroEditoria, setFiltroEditoria] = useState("todas");
  const [showModalNoticia, setShowModalNoticia] = useState(false);
  const [showModalEditoria, setShowModalEditoria] = useState(false);
  const [pesquisaEditorias, setPesquisaEditorias] = useState("");
  const [pesquisaNoticias, setPesquisaNoticias] = useState("");

  const excluirNoticia = (id: number) => {
    // setNoticias((prev) => prev.filter((n) => n.id !== id));
  };

  const excluirEditoria = (id: number) => {
    // setEditorias((prev) => prev.filter((e) => e.id !== id));
  };


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
                {showModalNoticia && (
                  <ModalNoticia
                    onOpenChange={setShowModalNoticia}
                    title="Nova Notícia"
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

              {/* Tabela de notícias */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Editoria</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {news &&
                    news.data.map((nw) => (
                      <TableRow key={nw.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{nw.title}</div>
                            <div className="text-sm text-muted-foreground truncate max-w-xs">
                              {/* {nw.sub} */}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{nw.badge}</Badge>
                        </TableCell>
                        <TableCell>
                          {/* {nw Date(nw.dataPublicacao).toLocaleDateString(
                          "pt-BR"
                        )} */}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              nw.status === "published"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {nw.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {}}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Confirmar exclusão
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem certeza que deseja excluir a notícia "
                                    {nw.title}"? Esta ação não pode ser
                                    desfeita.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>
                                    Cancelar
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => excluirNoticia(nw.id)}
                                  >
                                    Excluir
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
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

              {/* Tabela de editorias */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories &&
                    categories.data.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">
                          {category.name}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {}}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Confirmar exclusão
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem certeza que deseja excluir a editoria "
                                    {category.name}"? Esta ação não pode ser
                                    desfeita.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>
                                    Cancelar
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => excluirEditoria(category.id)}
                                  >
                                    Excluir
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Componente do formulário de notícia
// function NoticiaForm({
//   noticia,
//   editorias,
//   onSalvar,
//   onCancelar,
// }: {
//   noticia: any | null;
//   editorias: any[];
//   onSalvar: (dados: {
//     titulo: string;
//     assunto: string;
//     editoria: string;
//   }) => void;
//   onCancelar: () => void;
// }) {
//   const [titulo, setTitulo] = useState(noticia?.titulo || "");
//   const [assunto, setAssunto] = useState(noticia?.assunto || "");
//   const [editoria, setEditoria] = useState(noticia?.editoria || "");

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (titulo && assunto && editoria) {
//       onSalvar({ titulo, assunto, editoria });
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <div>
//         <Label htmlFor="titulo">Título</Label>
//         <Input
//           id="titulo"
//           value={titulo}
//           onChange={(e) => setTitulo(e.target.value)}
//           placeholder="Digite o título da notícia"
//           required
//         />
//       </div>
//       <div>
//         <Label htmlFor="assunto">Assunto</Label>
//         <Textarea
//           id="assunto"
//           value={assunto}
//           onChange={(e) => setAssunto(e.target.value)}
//           placeholder="Digite o assunto da notícia"
//           rows={4}
//           required
//         />
//       </div>
//       <div>
//         <Label htmlFor="editoria">Editoria</Label>
//         <Select value={editoria} onValueChange={setEditoria} required>
//           <SelectTrigger>
//             <SelectValue placeholder="Selecione uma editoria" />
//           </SelectTrigger>
//           <SelectContent>
//             {editorias.map((ed) => (
//               <SelectItem key={ed.id} value={ed.nome}>
//                 {ed.nome}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       </div>
//       <DialogFooter>
//         <Button type="button" variant="outline" onClick={onCancelar}>
//           Cancelar
//         </Button>
//         <Button type="submit">{noticia ? "Atualizar" : "Criar"} Notícia</Button>
//       </DialogFooter>
//     </form>
//   );
// }

// // Componente do formulário de editoria
// function EditoriaForm({
//   editoria,
//   onSalvar,
//   onCancelar,
// }: {
//   editoria: Editoria | null;
//   onSalvar: (dados: { nome: string; descricao: string }) => void;
//   onCancelar: () => void;
// }) {
//   const [nome, setNome] = useState(editoria?.nome || "");
//   const [descricao, setDescricao] = useState(editoria?.descricao || "");

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (nome && descricao) {
//       onSalvar({ nome, descricao });
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <div>
//         <Label htmlFor="nome">Nome</Label>
//         <Input
//           id="nome"
//           value={nome}
//           onChange={(e) => setNome(e.target.value)}
//           placeholder="Digite o nome da editoria"
//           required
//         />
//       </div>
//       <div>
//         <Label htmlFor="descricao">Descrição</Label>
//         <Textarea
//           id="descricao"
//           value={descricao}
//           onChange={(e) => setDescricao(e.target.value)}
//           placeholder="Digite a descrição da editoria"
//           rows={3}
//           required
//         />
//       </div>
//       <DialogFooter>
//         <Button type="button" variant="outline" onClick={onCancelar}>
//           Cancelar
//         </Button>
//         <Button type="submit">
//           {editoria ? "Atualizar" : "Criar"} Editoria
//         </Button>
//       </DialogFooter>
//     </form>
//   );
// }
