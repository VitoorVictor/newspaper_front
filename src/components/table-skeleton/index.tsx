import { Skeleton } from "@/components/ui/skeleton"; // ou qualquer spinner custom

interface ITableSkeleton {
  rows?: number;
  cols?: number;
}
export const TableSkeleton = ({ rows = 5, cols = 4 }: ITableSkeleton) => {
  return (
    <div className="space-y-2">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex gap-4">
          {[...Array(cols)].map((_, j) => (
            <Skeleton key={j} className="h-6 w-full" />
          ))}
        </div>
      ))}
    </div>
  );
};
