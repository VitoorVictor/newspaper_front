// src/columns/index.ts
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Trash2 } from "lucide-react";
import { IIndustrialGuide } from "@/interfaces/industrial-guide";
import { ISector } from "@/interfaces/sector";
import { formatPhone } from "@/utils/formatPhone";

// Colunas para Guia Industrial
export const getIndustrialGuideColumns = ({
  onView,
  onEdit,
  onDelete,
}: {
  onView: (item: IIndustrialGuide) => void;
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
    key: "sector_ids",
    title: "Setor(s)",
    render: (item: IIndustrialGuide) => (
      <div className="flex gap-1">
        {item.sectors.map((sector, index) => (
          <Badge
            variant="outline"
            className={index > 2 ? "hidden" : ""}
            key={index}
          >
            {sector.name}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    key: "address",
    title: "Endereço",
    render: (item: IIndustrialGuide) => (
      <span className="font-medium">{item.address && item.address}</span>
    ),
  },
  {
    key: "number",
    title: "Número",
    render: (item: IIndustrialGuide) => {
      // Função para formatar número para padrão brasileiro de telefone/celular
      return (
        <span className="font-medium">
          {item.number ? formatPhone(item.number) : ""}
        </span>
      );
    },
  },
  // {
  //   key: "slug",
  //   title: "Referência",
  //   render: (item: IIndustrialGuide) => (
  //     <SlugColumnBtn slug={item.slug} url={`/guia-industrial/${item.slug}`} />
  //   ),
  // },
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
          onClick={() => onView(item)}
        >
          <Eye className="w-4 h-4" />
        </Button>
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
