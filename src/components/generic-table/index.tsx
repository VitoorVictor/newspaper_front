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
}

export function GenericTable<T>({
  data,
  columns,
  getRowKey,
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
          <TableRow key={getRowKey(item)}>
            {columns.map((col, index) => (
              <TableCell key={index} className={col.className}>
                {col.render ? col.render(item) : String(item[col.key as keyof T])}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
