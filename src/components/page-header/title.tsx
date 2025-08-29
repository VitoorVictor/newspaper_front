import { Badge } from "../ui/badge";

interface TitleProps {
  title: string;
  subtitle?: string;
  showlResults?: boolean;
  totalResults?: number;
}

export const Title = ({
  title,
  subtitle,
  totalResults,
  showlResults,
}: TitleProps) => {
  return (
    <div className="flex-1">
      <div className="flex items-center gap-3 mb-2">
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        {showlResults && (
          <Badge
            variant="secondary"
            className="bg-primary/10 text-primary font-medium"
          >
            {totalResults} artigos
          </Badge>
        )}
      </div>
      {subtitle && <p className="text-gray-600 text-lg">{subtitle}</p>}
    </div>
  );
};
