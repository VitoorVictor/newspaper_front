"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDateTime } from "@/utils/formatDateTime";
import { BookOpen, Calendar, Sparkles } from "lucide-react";
import Image from "next/image";

interface MagazineCardProps {
  id: number;
  title: string;
  slug: string;
  description?: string;
  created_at: string;
  image: string;
}

export function MagazineCard({
  id,
  title,
  slug,
  description,
  created_at,
  image,
}: MagazineCardProps) {
  const handleClick = () => {
    window.open(`/edicoes/${slug}`, "_blank");
  };

  return (
    <Card
      className="group cursor-pointer overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 bg-card border border-border/50 backdrop-blur-sm p-0"
      onClick={handleClick}
    >
      <div className="relative w-full overflow-hidden bg-gradient-to-br from-muted/30 to-muted/60">
        <div className="relative w-full">
          <Image
            src={
              image ||
              "/placeholder.svg?height=400&width=300&query=elegant magazine cover"
            }
            alt={title}
            width={800}
            height={1000}
            className="w-full h-auto object-contain transition-all duration-700 group-hover:scale-105 group-hover:brightness-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

          <Badge className="absolute top-3 right-3 bg-emerald-500 backdrop-blur-md shadow-lg text-xs z-10">
            <Sparkles className="w-3 h-3 mr-1 text-white" />
            Digital
          </Badge>

          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 z-10">
            <div className="bg-primary/20 backdrop-blur-md rounded-full p-4 border border-primary/30 shadow-2xl transform scale-75 group-hover:scale-100 transition-transform duration-500">
              <BookOpen className="w-8 h-8 text-primary-foreground drop-shadow-lg" />
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-10">
            <h3 className="font-bold text-lg leading-tight line-clamp-2 drop-shadow-lg">
              {title}
            </h3>
          </div>
        </div>
      </div>

      <CardContent className="p-4 space-y-3 bg-gradient-to-b from-card to-card/80">
        {description && (
          <div>
            <p className="text-muted-foreground leading-relaxed line-clamp-2 text-sm">
              {description}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span className="font-medium">{formatDateTime(created_at)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
