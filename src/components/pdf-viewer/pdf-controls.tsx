"use client";

import { Button } from "@/components/ui/button";
import {
  Download,
  ExternalLink,
  RotateCcw,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

interface PDFControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  onRotate: () => void;
  onDownload: () => void;
  onOpenInNewTab: () => void;
  zoom: number;
  disabled?: boolean;
}

export function PDFControls({
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onRotate,
  onDownload,
  onOpenInNewTab,
  zoom,
  disabled = false,
}: PDFControlsProps) {
  return (
    <div className="flex gap-2 items-center flex-wrap">
      {/* Controles de Zoom */}
      <div className="flex gap-2 items-center">
        <Button
          onClick={onZoomOut}
          disabled={zoom <= 50 || disabled}
          size="icon"
          variant="outline"
          title="Diminuir zoom"
          className="h-8 w-8"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>

        <span className="text-sm font-medium min-w-[50px] text-center">
          {zoom}%
        </span>

        <Button
          onClick={onZoomIn}
          disabled={zoom >= 300 || disabled}
          size="icon"
          variant="outline"
          title="Aumentar zoom"
          className="h-8 w-8"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>

        <Button
          onClick={onZoomReset}
          size="sm"
          variant="outline"
          title="Resetar zoom"
          className="h-8 px-3"
        >
          Reset
        </Button>

        <Button
          onClick={onRotate}
          size="icon"
          variant="outline"
          title="Rotacionar"
          className="h-8 w-8"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {/* Controles de Download */}
      <div className="flex gap-2 items-center">
        <Button
          onClick={onDownload}
          className="flex items-center gap-2 h-8 px-3"
          size="sm"
          variant="outline"
          disabled={disabled}
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Baixar</span>
        </Button>

        <Button
          onClick={onOpenInNewTab}
          variant="outline"
          size="icon"
          title="Abrir PDF"
          className="h-8 w-8"
          disabled={disabled}
        >
          <ExternalLink className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

