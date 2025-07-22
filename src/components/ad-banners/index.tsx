"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function BannerHorizontal() {
  return (
    <Card className="relative overflow-hidden bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-dashed border-gray-300">
      <div className="flex items-center justify-center h-24 md:h-32">
        <div className="text-center">
          <div className="text-gray-500 font-medium mb-1">
            ESPAÇO PUBLICITÁRIO
          </div>
          <div className="text-sm text-gray-400">728 x 90px (Leaderboard)</div>
          <div className="text-xs text-gray-400 mt-1">
            Banner Principal - Desktop
          </div>
        </div>
      </div>
      <Badge className="absolute top-2 right-2 bg-green-500 text-white text-xs">
        DISPONÍVEL
      </Badge>
    </Card>
  );
}

export function BannerVertical() {
  return (
    <Card className="relative overflow-hidden bg-gradient-to-b from-orange-50 to-red-50 border-2 border-dashed border-gray-300">
      <div className="flex items-center justify-center h-[600px]">
        <div className="text-center">
          <div className="text-gray-500 font-medium mb-2 text-sm">VERTICAL</div>
          <div className="text-xs text-gray-400 mb-1">120 x 240px</div>
          <div className="text-xs text-gray-400">(Vertical Banner)</div>
          <div className="text-xs text-gray-400 mt-2">Compacto</div>
        </div>
      </div>
      <Badge className="absolute top-2 right-2 bg-orange-500 text-white text-xs">
        OCUPADO
      </Badge>
    </Card>
  );
}
