"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Configura o worker local do pdfjs
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFClientProps {
  file: string;
  className?: string;
  onControlsReady?: (controls: {
    handleZoomIn: () => void;
    handleZoomOut: () => void;
    handleZoomReset: () => void;
    handleRotate: () => void;
    handleDownload: () => void;
    handleOpenInNewTab: () => void;
    zoom: number;
  }) => void;
}

export default function PDFClient({
  file,
  className = "",
  onControlsReady,
}: PDFClientProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<string | null>(null);
  const [pageWidth, setPageWidth] = useState<number | undefined>(480);
  const [pageHeight, setPageHeight] = useState<number | undefined>(undefined);
  const [zoom, setZoom] = useState<number>(100);
  const [rotation, setRotation] = useState<number>(0);
  const [isLargeScreen, setIsLargeScreen] = useState<boolean>(false);

  // Referência para o áudio
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Referência para o container do PDF
  const pdfContainerRef = useRef<HTMLDivElement | null>(null);

  // Referência para onControlsReady para evitar loops infinitos
  const onControlsReadyRef = useRef(onControlsReady);
  useEffect(() => {
    onControlsReadyRef.current = onControlsReady;
  }, [onControlsReady]);

  useEffect(() => {
    // Carrega o som ao montar o componente
    audioRef.current = new Audio("/page-flip-47177.mp3");
    audioRef.current.volume = 0.4; // volume inicial
  }, []);

  // Detecta se é tela grande (md+) e ajusta dimensões do PDF
  useEffect(() => {
    function handleResize() {
      const isLarge = window.innerWidth >= 768; // md breakpoint
      setIsLargeScreen(isLarge);

      if (isLarge) {
        // Em telas md+: usa 95% da altura e calcula largura automaticamente
        const screenHeight = window.innerHeight;
        const availableHeight = screenHeight * 0.95; // 95% da altura
        const zoomedHeight = (availableHeight * zoom) / 100;
        setPageHeight(zoomedHeight);
        setPageWidth(undefined); // Width será calculado automaticamente pelo react-pdf
      } else {
        // Em telas pequenas: mantém comportamento original baseado em largura
        const screenWidth = window.innerWidth;
        let baseWidth = screenWidth * 0.6; // 60% da largura da tela

        // Limites mínimos e máximos por dispositivo
        if (screenWidth <= 480) {
          baseWidth = Math.max(300, screenWidth * 0.7); // mobile: 70% da tela, mínimo 300px
        } else if (screenWidth <= 768) {
          baseWidth = Math.max(400, screenWidth * 0.65); // tablet: 65% da tela, mínimo 400px
        }

        // Aplica o zoom na largura
        const zoomedWidth = (baseWidth * zoom) / 100;
        setPageWidth(zoomedWidth);
        setPageHeight(undefined);
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [zoom]);

  // Detecta se é URL ou arquivo local
  const isUrl = useCallback((file: string) => {
    try {
      new URL(file);
      return true;
    } catch {
      return false;
    }
  }, []);

  // Faz download e converte para blob
  const downloadAndConvertToBlob = useCallback(async (url: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(url);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      setPdfFile(blobUrl);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao fazer download:", error);
      setError(
        "Erro ao fazer download do PDF. Verifique se a URL está acessível."
      );
      setLoading(false);
    }
  }, []);

  // Processa o arquivo quando a prop file muda
  useEffect(() => {
    if (file) {
      if (isUrl(file)) {
        downloadAndConvertToBlob(file);
      } else {
        setPdfFile(file);
        setLoading(false);
        setError(null);
      }
    }
  }, [file, isUrl, downloadAndConvertToBlob]);

  // Limpa o blob URL quando desmontar
  useEffect(() => {
    return () => {
      if (pdfFile && isUrl(file)) {
        URL.revokeObjectURL(pdfFile);
      }
    };
  }, [pdfFile, file, isUrl]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  function onDocumentLoadError(error: Error) {
    console.error("Erro ao carregar PDF:", error);
    setError("Erro ao carregar o PDF. Verifique se o arquivo é válido.");
  }

  // Função para tocar o som
  function playPageFlipSound() {
    if (audioRef.current) {
      audioRef.current.currentTime = 0; // reseta para evitar sobreposição
      audioRef.current.play().catch(() => {});
    }
  }

  // Calcula as páginas a serem exibidas (modo revista em telas grandes)
  const getPagesToShow = useCallback(() => {
    if (!isLargeScreen) {
      return [currentPage];
    }

    // Em telas grandes, mostra duas páginas lado a lado como revista
    const pages = [];

    // Página da esquerda (página par)
    const leftPage = currentPage % 2 === 0 ? currentPage : currentPage - 1;
    if (leftPage >= 1 && leftPage <= numPages) {
      pages.push(leftPage);
    }

    // Página da direita (página ímpar)
    const rightPage = currentPage % 2 === 0 ? currentPage + 1 : currentPage;
    if (rightPage >= 1 && rightPage <= numPages) {
      pages.push(rightPage);
    }

    return pages;
  }, [currentPage, numPages, isLargeScreen]);

  // Gera array com todas as páginas para pré-renderização
  const allPages = useMemo(() => {
    return Array.from({ length: numPages }, (_, i) => i + 1);
  }, [numPages]);

  // Função para ir para uma página específica
  function goToPage(pageNumber: number) {
    if (pageNumber >= 1 && pageNumber <= numPages) {
      setCurrentPage(pageNumber);
      playPageFlipSound(); // toca o som sempre que troca de página
    }
  }

  // Função para navegar no modo revista (avança 2 páginas)
  function goToNextPages() {
    if (isLargeScreen) {
      const nextPage = currentPage + 2;
      if (nextPage <= numPages) {
        goToPage(nextPage);
      }
    } else {
      goToPage(currentPage + 1);
    }
  }

  // Função para navegar no modo revista (volta 2 páginas)
  function goToPreviousPages() {
    if (isLargeScreen) {
      const prevPage = currentPage - 2;
      if (prevPage >= 1) {
        goToPage(prevPage);
      }
    } else {
      goToPage(currentPage - 1);
    }
  }

  // Função para lidar com clique nas páginas
  function handlePageClick(pageNumber: number, index: number) {
    if (isLargeScreen) {
      // Em telas grandes, clica na página da esquerda vai para anterior, direita para próxima
      if (index === 0 && currentPage > 1) {
        // Página da esquerda - vai para anterior (exceto se for a primeira página)
        goToPreviousPages();
      } else {
        // Página da direita ou primeira página - vai para próxima
        if (currentPage < numPages) {
          goToNextPages();
        }
      }
    } else {
      // Em telas pequenas, sempre avança para a próxima página
      if (currentPage < numPages) {
        const nextPage = currentPage + 1;
        goToPage(nextPage);
      }
    }
  }

  // Função para baixar o PDF
  const handleDownload = useCallback(() => {
    if (pdfFile) {
      const link = document.createElement("a");
      link.href = pdfFile;
      link.download = `revista-pagina-${currentPage}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [pdfFile, currentPage]);

  // Função para abrir PDF em nova aba
  const handleOpenInNewTab = useCallback(() => {
    if (pdfFile) {
      window.open(pdfFile, "_blank");
    }
  }, [pdfFile]);

  // Funções de zoom
  const handleZoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + 25, 300)); // máximo 300%
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev - 25, 50)); // mínimo 50%
  }, []);

  const handleZoomReset = useCallback(() => {
    setZoom(100);
  }, []);

  // Função para rotacionar
  const handleRotate = useCallback(() => {
    setRotation((prev) => (prev + 90) % 360);
  }, []);

  // Função para zoom com scroll do mouse
  function handleWheel(e: React.WheelEvent) {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      if (e.deltaY < 0) {
        handleZoomIn();
      } else {
        handleZoomOut();
      }
    }
  }

  // Expõe as funções de controle quando disponível
  // Usa um ref para rastrear se já foi inicializado
  const initializedRef = useRef(false);

  useEffect(() => {
    if (onControlsReadyRef.current && pdfFile && !loading) {
      onControlsReadyRef.current({
        handleZoomIn,
        handleZoomOut,
        handleZoomReset,
        handleRotate,
        handleDownload,
        handleOpenInNewTab,
        zoom,
      });
      initializedRef.current = true;
    }
  }, [
    pdfFile,
    loading,
    handleZoomIn,
    handleZoomOut,
    handleZoomReset,
    handleRotate,
    handleDownload,
    handleOpenInNewTab,
  ]);

  // Atualiza apenas o zoom quando já foi inicializado
  useEffect(() => {
    if (
      onControlsReadyRef.current &&
      initializedRef.current &&
      pdfFile &&
      !loading
    ) {
      onControlsReadyRef.current({
        handleZoomIn,
        handleZoomOut,
        handleZoomReset,
        handleRotate,
        handleDownload,
        handleOpenInNewTab,
        zoom,
      });
    }
  }, [zoom]);

  if (loading) return <PDFViewerLoading />;
  if (error) return <PDFViewerError />;
  if (!pdfFile) return null;

  return (
    <div
      className={`w-full mx-auto ${
        isLargeScreen ? "h-[95vh] relative" : "min-h-screen flex flex-col"
      } overflow-x-hidden ${className}`}
      onWheel={handleWheel}
    >
      {/* Layout para telas md+ */}
      {isLargeScreen && pdfFile ? (
        <>
          {/* Botão de navegação esquerda */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
            <Button
              onClick={goToPreviousPages}
              disabled={currentPage === 1}
              size="icon"
              variant="outline"
              className="h-12 w-12 bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white"
              title="Página anterior"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
          </div>

          {/* Botão de navegação direita */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
            <Button
              onClick={goToNextPages}
              disabled={
                isLargeScreen
                  ? currentPage + 1 >= numPages
                  : currentPage === numPages
              }
              size="icon"
              variant="outline"
              className="h-12 w-12 bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white"
              title="Próxima página"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>

          {/* Visualização do PDF */}
          <div
            ref={pdfContainerRef}
            className="h-full overflow-y-auto overflow-x-hidden flex items-center justify-center"
          >
            <Document
              file={pdfFile}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={PDFViewerLoading}
            >
              <div className="flex justify-center items-center gap-2">
                {allPages.map((pageNumber) => {
                  const pagesToShow = getPagesToShow();
                  const isVisible = pagesToShow.includes(pageNumber);
                  const indexInVisible = pagesToShow.indexOf(pageNumber);

                  return (
                    <div
                      key={pageNumber}
                      className={`flex-shrink-0 cursor-pointer ${
                        isVisible ? "" : "hidden"
                      }`}
                      onClick={() =>
                        isVisible
                          ? handlePageClick(pageNumber, indexInVisible)
                          : null
                      }
                    >
                      <Page
                        pageNumber={pageNumber}
                        renderAnnotationLayer={false}
                        renderTextLayer={false}
                        width={pageWidth}
                        height={pageHeight}
                        className="w-full h-auto object-contain"
                        rotate={rotation}
                      />
                    </div>
                  );
                })}
              </div>
            </Document>
          </div>
        </>
      ) : (
        /* Layout para telas pequenas */
        <>
          {/* Visualização do PDF */}
          <div
            ref={pdfContainerRef}
            className="overflow-y-auto overflow-x-hidden w-full flex-1"
          >
            <Document
              file={pdfFile}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={PDFViewerLoading}
            >
              <div className="flex justify-center">
                {allPages.map((pageNumber) => {
                  const pagesToShow = getPagesToShow();
                  const isVisible = pagesToShow.includes(pageNumber);
                  const indexInVisible = pagesToShow.indexOf(pageNumber);

                  return (
                    <div
                      key={pageNumber}
                      className={`flex-shrink-0 cursor-pointer ${
                        isVisible ? "" : "hidden"
                      }`}
                      onClick={() =>
                        isVisible
                          ? handlePageClick(pageNumber, indexInVisible)
                          : null
                      }
                    >
                      <Page
                        pageNumber={pageNumber}
                        renderAnnotationLayer={false}
                        renderTextLayer={false}
                        width={pageWidth}
                        height={pageHeight}
                        className="w-full h-auto object-contain"
                        rotate={rotation}
                      />
                    </div>
                  );
                })}
              </div>
            </Document>
          </div>

          {/* Botões de navegação na parte inferior para mobile */}
          <div className="w-full flex justify-center items-center gap-4 py-4 bg-white/90 backdrop-blur-sm border-t border-gray-200">
            <Button
              onClick={goToPreviousPages}
              disabled={currentPage === 1}
              size="icon"
              variant="outline"
              className="h-12 w-12"
              title="Página anterior"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>

            <span className="text-sm font-medium text-gray-700 min-w-[80px] text-center">
              {currentPage} / {numPages}
            </span>

            <Button
              onClick={goToNextPages}
              disabled={currentPage === numPages}
              size="icon"
              variant="outline"
              className="h-12 w-12"
              title="Próxima página"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

/* Componente de loading */
function PDFViewerLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center bg-gray-50 rounded-xl my-5 p-10">
      <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-5"></div>
      <p className="text-base text-gray-600 font-medium m-0">
        Fazendo download do PDF...
      </p>
    </div>
  );
}

/* Componente de erro */
function PDFViewerError() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center bg-gray-50 rounded-xl my-5 p-10">
      <p className="text-base text-gray-600 font-medium m-0">
        Erro ao carregar o PDF. Verifique se o arquivo é válido.
      </p>
    </div>
  );
}
