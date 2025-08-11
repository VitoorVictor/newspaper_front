import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { IBanner } from "@/interfaces/banner";
import { formatDateTime } from "@/utils/formatDateTime";

// Colunas para Banners
export const getBannersColumns = ({
  onEdit,
}: {
  onEdit: (item: IBanner) => void;
}) => [
  {
    key: "name",
    title: "Posição",
    render: (item: IBanner) => (
      <span className="font-medium">
        {item.name === "top"
          ? "Topo"
          : item.name === "side"
          ? "Lateral"
          : item.name.charAt(0).toUpperCase() + item.name.slice(1)}
      </span>
    ),
  },
  {
    key: "updated_at",
    title: "Ultima alteração em",
    render: (item: IBanner) => (
      <span className="font-medium">{formatDateTime(item.updated_at)}</span>
    ),
  },
  {
    key: "actions",
    title: "Ações",
    className: "text-right",
    render: (item: IBanner) => (
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer"
          onClick={() => onEdit(item)}
        >
          <Edit className="w-4 h-4" />
        </Button>
      </div>
    ),
  },
];
