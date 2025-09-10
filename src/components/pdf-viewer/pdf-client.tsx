"use client";

import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from "lucide-react";

// Configura o worker local do pdfjs
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFClientProps {
  file: string;
  className?: string;
}

export default function PDFClient({ file, className = "" }: PDFClientProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<string | null>(null);
  const [pageWidth, setPageWidth] = useState<number>(480);
  const [pageInput, setPageInput] = useState<string>("");
  const [zoom, setZoom] = useState<number>(100);
  const [rotation, setRotation] = useState<number>(0);
  const [isLargeScreen, setIsLargeScreen] = useState<boolean>(false);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);

  // Referência para o áudio
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Carrega o som ao montar o componente
    audioRef.current = new Audio("/page-flip-47177.mp3");
    audioRef.current.volume = 0.4; // volume inicial
  }, []);

  // Detecta se é tela grande (md+) e ajusta largura do PDF
  useEffect(() => {
    function handleResize() {
      const isLarge = window.innerWidth >= 768; // md breakpoint
      setIsLargeScreen(isLarge);

      let baseWidth = 700; // desktop (aumentado de 550)
      if (window.innerWidth <= 480) {
        baseWidth = 350; // mobile (aumentado de 300)
      } else if (window.innerWidth <= 768) {
        baseWidth = 500; // tablet (aumentado de 420)
      }

      // Em telas grandes, divide a largura pela metade para caber duas páginas
      if (isLarge) {
        baseWidth = baseWidth / 2;
      }

      // Aplica o zoom na largura
      const zoomedWidth = (baseWidth * zoom) / 100;
      setPageWidth(zoomedWidth);
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

  function onPageLoadSuccess() {
    setIsPageLoading(false);
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

  // Função para ir para uma página específica
  function goToPage(pageNumber: number) {
    if (pageNumber >= 1 && pageNumber <= numPages) {
      setIsPageLoading(true);
      setCurrentPage(pageNumber);
      playPageFlipSound(); // toca o som sempre que troca de página

      // Simula um pequeno delay para evitar o pisca
      setTimeout(() => {
        setIsPageLoading(false);
      }, 100);
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

  // Função para navegar via input
  function handlePageInputSubmit(e: React.FormEvent) {
    e.preventDefault();
    const pageNumber = parseInt(pageInput);
    if (pageNumber >= 1 && pageNumber <= numPages) {
      goToPage(pageNumber);
      setPageInput("");
    }
  }

  // Atualiza o input quando a página muda
  useEffect(() => {
    setPageInput(currentPage.toString());
  }, [currentPage]);

  // Função para baixar o PDF
  function handleDownload() {
    if (pdfFile) {
      const link = document.createElement("a");
      link.href = pdfFile;
      link.download = `revista-pagina-${currentPage}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  // Função para abrir PDF em nova aba
  function handleOpenInNewTab() {
    if (pdfFile) {
      window.open(pdfFile, "_blank");
    }
  }

  // Funções de zoom
  function handleZoomIn() {
    setZoom((prev) => Math.min(prev + 25, 300)); // máximo 300%
  }

  function handleZoomOut() {
    setZoom((prev) => Math.max(prev - 25, 50)); // mínimo 50%
  }

  function handleZoomReset() {
    setZoom(100);
  }

  // Função para rotacionar
  function handleRotate() {
    setRotation((prev) => (prev + 90) % 360);
  }

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

  if (loading) return <PDFViewerLoading />;
  if (error) return <PDFViewerError />;
  if (!pdfFile) return null;

  return (
    <div
      className={`w-full max-w-5xl mx-auto px-5 py-4 flex flex-col items-center gap-5 ${className}`}
      onWheel={handleWheel}
    >
      {/* Botões de ação */}
      {pdfFile && (
        <div className="flex flex-col gap-3 w-full">
          {/* Primeira linha - Download e Abrir */}

          {/* Segunda linha - Controles de Zoom e Rotação */}
          <div className="flex gap-2 justify-center items-center">
            <Button
              onClick={handleZoomOut}
              disabled={zoom <= 50}
              size="icon"
              variant="outline"
              title="Diminuir zoom"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>

            <span className="text-sm font-medium min-w-[60px] text-center">
              {zoom}%
            </span>

            <Button
              onClick={handleZoomIn}
              disabled={zoom >= 300}
              size="icon"
              variant="outline"
              title="Aumentar zoom"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>

            <Button
              onClick={handleZoomReset}
              size="sm"
              variant="outline"
              title="Resetar zoom"
            >
              Reset
            </Button>

            <Button
              onClick={handleRotate}
              size="icon"
              variant="outline"
              title="Rotacionar"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex gap-3 justify-center">
            <Button
              onClick={handleDownload}
              className="flex items-center gap-2 h-10 px-4 cursor-pointer"
              size="sm"
            >
              <Download className="w-4 h-4" />
              Baixar PDF
            </Button>

            <Button
              onClick={handleOpenInNewTab}
              variant="outline"
              className="flex items-center gap-2 h-10 px-4 cursor-pointer"
              size="sm"
            >
              <ExternalLink className="w-4 h-4" />
              Abrir PDF
            </Button>
          </div>
        </div>
      )}

      {/* Visualização do PDF */}
      <div className="overflow-auto flex justify-center w-full max-h-[85vh] min-h-[500px]">
        <Document
          file={pdfFile}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={PDFViewerLoading}
        >
          <div
            className={`flex ${
              isLargeScreen ? "gap-2" : ""
            } justify-center min-h-[500px] items-start`}
            style={{
              opacity: isPageLoading ? 0.7 : 1,
              transition: "opacity 0.1s ease-in-out",
            }}
          >
            {getPagesToShow().map((pageNumber, index) => (
              <div key={`${pageNumber}-${index}`} className="flex-shrink-0">
                <Page
                  pageNumber={pageNumber}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                  width={pageWidth}
                  height={undefined}
                  className="w-full h-auto object-contain"
                  loading={PDFViewerLoading}
                  rotate={rotation}
                  onLoadSuccess={onPageLoadSuccess}
                />
              </div>
            ))}
          </div>
        </Document>
      </div>

      {/* Barra de Navegação */}
      {numPages > 0 && (
        <div className="flex flex-col items-center gap-3 w-full">
          <div className="text-center text-sm text-gray-700 font-medium px-3 py-1 bg-gray-50 rounded-md border border-gray-200">
            {isLargeScreen ? (
              <>
                Páginas {getPagesToShow()[0]}-
                {getPagesToShow()[getPagesToShow().length - 1]} de {numPages}
              </>
            ) : (
              <>
                Página {currentPage} de {numPages}
              </>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-center">
            <Button
              onClick={() => goToPage(1)}
              disabled={currentPage === 1}
              size="icon"
            >
              <ChevronsLeft className="w-4 h-4" />
            </Button>

            <Button
              onClick={goToPreviousPages}
              disabled={currentPage === 1}
              size="icon"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <form
              onSubmit={handlePageInputSubmit}
              className="flex items-center gap-1"
            >
              <input
                type="number"
                min="1"
                max={numPages}
                value={pageInput}
                onChange={(e) => setPageInput(e.target.value)}
                className="w-12 h-8 text-center text-sm border border-gray-300 rounded"
              />
              <span className="text-xs text-gray-400">/</span>
              <span className="text-xs text-gray-600">{numPages}</span>
            </form>

            <Button
              onClick={goToNextPages}
              disabled={
                isLargeScreen
                  ? currentPage + 1 >= numPages
                  : currentPage === numPages
              }
              size="icon"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>

            <Button
              onClick={() =>
                goToPage(isLargeScreen ? Math.max(1, numPages - 1) : numPages)
              }
              disabled={currentPage === numPages}
              size="icon"
            >
              <ChevronsRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
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
