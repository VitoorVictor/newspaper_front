import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { IUser } from "@/interfaces/user";
import { formatDateTime } from "@/utils/formatDateTime";

// Colunas para News
export const getUsersColumns = ({
  onEdit,
  onDelete,
}: {
  onEdit: (item: IUser) => void;
  onDelete: (item: IUser) => void;
}) => [
  {
    key: "name",
    title: "Nome",
    render: (item: IUser) => <span className="font-medium">{item.name}</span>,
  },
  {
    key: "email",
    title: "Email",
    render: (item: IUser) => <span className="font-medium">{item.email}</span>,
  },
  {
    key: "created_at",
    title: "Criado em",
    render: (item: IUser) => (
      <span className="font-medium">{formatDateTime(item.created_at)}</span>
    ),
  },
  {
    key: "actions",
    title: "Ações",
    className: "text-right",
    render: (item: IUser) => (
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer"
          onClick={() => onEdit(item)}
        >
          <Edit className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer"
          onClick={() => onDelete(item)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    ),
  },
];
