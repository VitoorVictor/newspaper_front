"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { PDFControls } from "@/components/pdf-viewer/pdf-controls";
import dynamic from "next/dynamic";

// Carrega o PDFViewer apenas no cliente (sem SSR)
const PDFViewerClient = dynamic(() => import("@/components/pdf-viewer/pdf-client"), {
  ssr: false,
});

interface PDFControlsContextType {
  controls: {
    handleZoomIn: () => void;
    handleZoomOut: () => void;
    handleZoomReset: () => void;
    handleRotate: () => void;
    handleDownload: () => void;
    handleOpenInNewTab: () => void;
    zoom: number;
  } | null;
  setControls: (controls: PDFControlsContextType["controls"]) => void;
}

const PDFControlsContext = createContext<PDFControlsContextType | null>(null);

export function usePDFControls() {
  return useContext(PDFControlsContext);
}

interface PDFHeaderControlsProps {
  file: string;
}

export function PDFHeaderControls({
  file,
  children,
}: PDFHeaderControlsProps & { children: React.ReactNode }) {
  const [controls, setControls] = useState<PDFControlsContextType["controls"]>(null);

  return (
    <PDFControlsContext.Provider value={{ controls, setControls }}>
      {children}
    </PDFControlsContext.Provider>
  );
}

export function PDFControlsWrapper() {
  const { controls } = usePDFControls()!;

  if (!controls) {
    return (
      <div className="flex gap-2 items-center flex-wrap opacity-50 pointer-events-none">
        <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
        <div className="h-8 w-12 bg-gray-200 rounded animate-pulse" />
        <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <PDFControls
      onZoomIn={controls.handleZoomIn}
      onZoomOut={controls.handleZoomOut}
      onZoomReset={controls.handleZoomReset}
      onRotate={controls.handleRotate}
      onDownload={controls.handleDownload}
      onOpenInNewTab={controls.handleOpenInNewTab}
      zoom={controls.zoom}
    />
  );
}

export function PDFViewerWrapper({ file }: { file: string }) {
  const context = usePDFControls()!;
  const [isMounted, setIsMounted] = useState(false);
  const controlsReadyRef = React.useRef(false);

  // Usa useCallback para estabilizar a função e evitar loops infinitos
  const handleControlsReady = useCallback(
    (ctrl: {
      handleZoomIn: () => void;
      handleZoomOut: () => void;
      handleZoomReset: () => void;
      handleRotate: () => void;
      handleDownload: () => void;
      handleOpenInNewTab: () => void;
      zoom: number;
    }) => {
      // Evita chamar setControls múltiplas vezes
      if (!controlsReadyRef.current) {
        controlsReadyRef.current = true;
        context.setControls(ctrl);
      } else {
        // Atualiza apenas se o zoom mudou
        context.setControls(ctrl);
      }
    },
    [context]
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-5 mx-auto"></div>
          <p className="text-base text-gray-600 font-medium">
            Carregando PDF...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <PDFViewerClient file={file} onControlsReady={handleControlsReady} />
    </div>
  );
}

