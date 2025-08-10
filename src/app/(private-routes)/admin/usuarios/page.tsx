"use client";

import type React from "react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Title } from "@/components/page-header/title";
import AddBtn from "@/components/custom-btns/add-btn";
import { SearchBar } from "@/components/search-bar";
import { ModalUser } from "@/components/modals/modal-user";
import { getUsersColumns } from "./columns";
import { GenericTable } from "@/components/generic-table";
import { TableSkeleton } from "@/components/table-skeleton";
import { IUser } from "@/interfaces/user";
import { ICategory } from "@/interfaces/category";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useDeleteUser, useUsers } from "@/hooks/tanstackQuery/useUser";

export default function AdminUsu() {
  //states
  const [showModalUser, setShowModalUser] = useState(false);
  const [searchUsers, setSearchUsers] = useState("");
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [showConfirmDeleteUser, setShowConfirmDeleteUser] = useState(false);

  //hooks
  const {
    data: users,
    isLoading: loadingUsers,
    isError: errorUsers,
  } = useUsers({ search: searchUsers });
  const deleteUserMutation = useDeleteUser();

  //edits
  const handleEditUser = (item: IUser) => {
    setSelectedUser(item);
    setShowModalUser(true);
  };

  //deletes
  const handleDeleteUser = (item: IUser) => {
    setSelectedUser(item);
    setShowConfirmDeleteUser(true);
  };

  //columns
  const newsColumns = getUsersColumns({
    onEdit: handleEditUser,
    onDelete: handleDeleteUser,
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Title
        title="Administração de Usuários"
        subtitle="Gerencie os usuários do sistema"
      />

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Exibindo Usuários</CardTitle>
            <AddBtn
              label="Novo Usuário"
              onClick={() => setShowModalUser(true)}
            />
            {showModalUser && (
              <ModalUser
                onOpenChange={(open) => {
                  setShowModalUser(open);
                  setSelectedUser(null);
                }}
                title={`${selectedUser?.id ? "Atualizar " : "Novo "} Usuário`}
                id={selectedUser?.id}
              />
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* Filtros */}
          <div className="mb-6">
            <SearchBar
              placeholder="Pesquise pelo nome do usuários..."
              value={searchUsers}
              onSearch={setSearchUsers}
              onClear={() => setSearchUsers("")}
            />
          </div>

          {loadingUsers || (!users && !errorUsers) ? (
            <TableSkeleton rows={5} cols={4} />
          ) : (
            <GenericTable
              data={users?.data.data ?? []}
              columns={newsColumns}
              getRowKey={(item) => item.id}
            />
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={showConfirmDeleteUser}
        onOpenChange={(open) => {
          setShowConfirmDeleteUser(open);
          setSelectedUser(null);
        }}
        title="Confirmar exclusão"
        description={`Tem certeza que deseja excluir a editoria "${selectedUser?.name}"?`}
        onConfirm={() => {
          if (selectedUser) {
            deleteUserMutation.mutate(selectedUser.id);
          }
          setShowConfirmDeleteUser(false);
          setSelectedUser(null);
        }}
      />
    </div>
  );
}
