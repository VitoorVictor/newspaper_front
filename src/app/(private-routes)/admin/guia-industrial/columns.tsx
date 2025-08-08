// src/columns/index.ts
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { IIndustrialGuide } from "@/interfaces/industrial-guide";
import { ISector } from "@/interfaces/sector";

// Colunas para Guia Industrial
export const getInsdustrialGuideColumns = ({
  onEdit,
  onDelete,
}: {
  onEdit: (item: IIndustrialGuide) => void;
  onDelete: (item: IIndustrialGuide) => void;
}) => [
  {
    key: "name",
    title: "Nome",
    render: (item: IIndustrialGuide) => (
      <span className="font-medium">{item.name}</span>
    ),
  },
  {
    key: "slug",
    title: "Referência",
    render: (item: IIndustrialGuide) => (
      <button
        className="flex gap-1"
        onClick={() => console.log("leva para o card da industria")}
      >
        <Badge variant="outline">{item.slug}</Badge>
      </button>
    ),
  },
  {
    key: "address",
    title: "Endereço",
    render: (item: IIndustrialGuide) => (
      <span className="font-medium">
        {item.address} - {item.number}
      </span>
    ),
  },
  {
    key: "actions",
    title: "Ações",
    className: "text-right",
    render: (item: IIndustrialGuide) => (
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

// Colunas para Setores
export const getSectorsColumns = ({
  onEdit,
  onDelete,
}: {
  onEdit: (item: ISector) => void;
  onDelete: (item: ISector) => void;
}) => [
  {
    key: "name",
    title: "Nome",
    render: (item: ISector) => <span className="font-medium">{item.name}</span>,
  },
  {
    key: "actions",
    title: "Ações",
    className: "text-right",
    render: (item: ISector) => (
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
