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
      <div className="flex items-center justify-center h-80">
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

// export function LegendaAnunciantes() {
//   return (
//     <div className="mt-6 text-center">
//       <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border text-sm text-gray-600">
//         <span className="w-2 h-2 bg-green-500 rounded-full"></span>
//         Disponível
//         <span className="w-2 h-2 bg-yellow-500 rounded-full ml-2"></span>
//         Premium
//         <span className="w-2 h-2 bg-red-500 rounded-full ml-2"></span>
//         Ocupado
//         <span className="w-2 h-2 bg-purple-500 rounded-full ml-2"></span>
//         Destaque
//       </div>
//     </div>
//   );
// }
