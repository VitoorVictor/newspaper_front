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
import { Modal } from "./components/modal";

// Tipos
// interface Editoria {
//   id: number;
//   nome: string;
//   descricao: string;
// }

// interface Noticia {
//   id: number;
//   titulo: string;
//   assunto: string;
//   editoria: string;
//   dataPublicacao: string;
//   status: "publicada" | "rascunho";
// }

export default function AdminNoticias() {
  // Estados para notícias
  const [noticias, setNoticias] = useState<any[]>(noticiasMock);
  const [noticiaEditando, setNoticiaEditando] = useState<any | null>(null);
  const [dialogNoticiaAberto, setDialogNoticiaAberto] = useState(false);
  const [pesquisaNoticias, setPesquisaNoticias] = useState("");
  const [filtroEditoria, setFiltroEditoria] = useState("todas");

  // Estados para editorias
  const [editorias, setEditorias] = useState<any[]>(editoriasMock);
  const [editoriaEditando, setEditoriaEditando] = useState<any | null>(null);
  const [dialogEditoriaAberto, setDialogEditoriaAberto] = useState(false);
  const [pesquisaEditorias, setPesquisaEditorias] = useState("");

  const salvarNoticia = (dados: {
    titulo: string;
    assunto: string;
    editoria: string;
  }) => {
    // if (noticiaEditando) {
    //   setNoticias((prev) =>
    //     prev.map((n) => (n.id === noticiaEditando.id ? { ...n, ...dados } : n))
    //   );
    // } else {
    //   const novaNoticia: Noticia = {
    //     id: Date.now(),
    //     ...dados,
    //     dataPublicacao: new Date().toISOString().split("T")[0],
    //     status: "rascunho",
    //   };
    //   setNoticias((prev) => [...prev, novaNoticia]);
    // }
    // setDialogNoticiaAberto(false);
    // setNoticiaEditando(null);
  };

  const excluirNoticia = (id: number) => {
    // setNoticias((prev) => prev.filter((n) => n.id !== id));
  };

  // Funções para editorias
  const editoriasFiltradas = editorias.filter(
    (editoria) =>
      editoria.nome.toLowerCase().includes(pesquisaEditorias.toLowerCase()) ||
      editoria.descricao.toLowerCase().includes(pesquisaEditorias.toLowerCase())
  );

  const salvarEditoria = (dados: { nome: string; descricao: string }) => {
    // if (editoriaEditando) {
    //   setEditorias((prev) =>
    //     prev.map((e) => (e.id === editoriaEditando.id ? { ...e, ...dados } : e))
    //   );
    // } else {
    //   const novaEditoria: Editoria = {
    //     id: Date.now(),
    //     ...dados,
    //   };
    //   setEditorias((prev) => [...prev, novaEditoria]);
    // }
    // setDialogEditoriaAberto(false);
    // setEditoriaEditando(null);
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
                <Modal
                  open={dialogNoticiaAberto}
                  onOpenChange={setDialogNoticiaAberto}
                  title="Nova Notícia"
                />
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
                    {editorias.map((editoria) => (
                      <SelectItem key={editoria.id} value={editoria.nome}>
                        {editoria.nome}
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
                  {noticias.map((noticia) => (
                    <TableRow key={noticia.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{noticia.titulo}</div>
                          <div className="text-sm text-muted-foreground truncate max-w-xs">
                            {noticia.assunto}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{noticia.editoria}</Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(noticia.dataPublicacao).toLocaleDateString(
                          "pt-BR"
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            noticia.status === "publicada"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {noticia.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setNoticiaEditando(noticia);
                              setDialogNoticiaAberto(true);
                            }}
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
                                  {noticia.titulo}"? Esta ação não pode ser
                                  desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => excluirNoticia(noticia.id)}
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
                <div>
                  <CardTitle>Exibindo Editorias</CardTitle>
                </div>
                {/* <Dialog 
                //   open={dialogEditoriaAberto}
                //   onOpenChange={setDialogEditoriaAberto}
                // >
                //   <DialogTrigger asChild>*/}
                <Button onClick={() => setEditoriaEditando(null)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Editoria
                </Button>
                {/* </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editoriaEditando ? "Editar Editoria" : "Nova Editoria"}
                      </DialogTitle>
                      <DialogDescription>
                        Preencha os dados da editoria
                      </DialogDescription>
                    </DialogHeader>
                    <EditoriaForm
                      editoria={editoriaEditando}
                      onSalvar={salvarEditoria}
                      onCancelar={() => {
                        setDialogEditoriaAberto(false);
                        setEditoriaEditando(null);
                      }}
                    />
                  </DialogContent>
                </Dialog> */}
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
                    <TableHead>Descrição</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {editoriasFiltradas.map((editoria) => (
                    <TableRow key={editoria.id}>
                      <TableCell className="font-medium">
                        {editoria.nome}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {editoria.descricao}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditoriaEditando(editoria);
                              setDialogEditoriaAberto(true);
                            }}
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
                                  {editoria.nome}"? Esta ação não pode ser
                                  desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => excluirEditoria(editoria.id)}
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
