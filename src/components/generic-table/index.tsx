import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Column<T> = {
  key: keyof T | string;
  title: string;
  className?: string;
  render?: (item: T) => React.ReactNode;
};

interface GenericTableProps<T> {
  data: T[];
  columns: Column<T>[];
  getRowKey: (item: T) => string | number;
  onRowClick?: (item: T) => void;
}

export function GenericTable<T>({
  data,
  columns,
  getRowKey,
  onRowClick,
}: GenericTableProps<T>) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((col, index) => (
            <TableHead key={index} className={col.className}>
              {col.title}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow
            key={getRowKey(item)}
            onClick={(e) => {
              const selection = window.getSelection();
              const clickedOnText =
                selection && selection.toString().length > 0;

              const isInteractive =
                e.target instanceof HTMLElement &&
                (e.target.closest("button") ||
                  e.target.closest("a") ||
                  e.target.closest("input") ||
                  e.target.closest("textarea"));

              if (!clickedOnText && !isInteractive && onRowClick) {
                onRowClick(item);
              }
            }}
            className={onRowClick ? "cursor-pointer hover:bg-muted/50" : ""}
          >
            {columns.map((col, index) => (
              <TableCell key={index} className={col.className}>
                {col.render
                  ? col.render(item)
                  : String(item[col.key as keyof T])}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
