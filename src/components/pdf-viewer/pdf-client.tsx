"use client";

import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import HTMLFlipbook from "react-pageflip";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";

// Configura o worker local do pdfjs (sem usar CDN)
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
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const flipbookRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Detecta se é mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Detecta se é uma URL ou arquivo local
  const isUrl = useCallback((file: string) => {
    try {
      new URL(file);
      return true;
    } catch {
      return false;
    }
  }, []);

  // Faz download da URL e converte para blob (com proxy CORS para testes)
  const downloadAndConvertToBlob = useCallback(async (url: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

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

  // Limpa o blob URL quando o componente é desmontado
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

  // Função para atualizar a página atual
  function onFlip(e: any) {
    const newPage = e.data + 1;
    setCurrentPage(newPage);
  }

  // Função para ir para uma página específica (desktop com flipbook)
  function goToPage(pageNumber: number) {
    if (pageNumber >= 1 && pageNumber <= numPages) {
      if (isMobile) {
        // Em mobile, apenas atualiza o estado da página atual
        setCurrentPage(pageNumber);
      } else if (flipbookRef.current) {
        // Em desktop, usa o flipbook
        flipbookRef.current.pageFlip().flip(pageNumber - 1);
        setCurrentPage(pageNumber);
      }
    }
  }

  // Gera um array com todas as páginas (otimizado com memo)
  const pages = useMemo(() => {
    return Array.from(new Array(numPages), (_, index) => (
      <div
        key={`page_${index + 1}`}
        className="flex justify-center items-center bg-white shadow-lg transform-gpu origin-center"
        style={{ minHeight: "fit-content" }}
      >
        <Page
          pageNumber={index + 1}
          renderAnnotationLayer={false}
          renderTextLayer={false}
          width={isMobile ? 300 : 556}
          height={undefined}
          className="max-w-full h-auto transition-transform duration-300 ease-in-out will-change-transform"
          loading={PDFViewerLoading}
        />
      </div>
    ));
  }, [numPages, isMobile]);

  // Componente para visualização mobile (página única)
  const MobilePageView = () => {
    const handleSwipeLeft = () => {
      console.log("Swipe left - próxima página");
      if (currentPage < numPages) {
        setCurrentPage(currentPage + 1);
      }
    };

    const handleSwipeRight = () => {
      console.log("Swipe right - página anterior");
      if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    };

    return (
      <div
        className="flex flex-col items-center w-full touch-pan-x"
        onTouchStart={(e) => {
          e.preventDefault();
          const startX = e.touches[0].clientX;
          const startY = e.touches[0].clientY;
          console.log("Touch start:", { startX, startY });

          const handleTouchEnd = (e: TouchEvent) => {
            e.preventDefault();
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const diffX = startX - endX;
            const diffY = startY - endY;

            console.log("Touch end:", { endX, endY, diffX, diffY });

            // Só processa swipe horizontal se for mais horizontal que vertical
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 30) {
              if (diffX > 0) {
                handleSwipeLeft(); // Swipe para esquerda = próxima página
              } else {
                handleSwipeRight(); // Swipe para direita = página anterior
              }
            }

            document.removeEventListener("touchend", handleTouchEnd);
          };

          document.addEventListener("touchend", handleTouchEnd);
        }}
      >
        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-4 w-full max-w-[320px] ">
          <Page
            pageNumber={currentPage}
            renderAnnotationLayer={false}
            renderTextLayer={false}
            width={320}
            height={undefined}
            className="w-full h-auto"
            loading={PDFViewerLoading}
          />
        </div>
        <div className="text-xs text-gray-500 text-center px-4">
          Deslize para esquerda/direita para navegar
        </div>
      </div>
    );
  };

  // Mostra loading enquanto faz download
  if (loading) {
    return <PDFViewerLoading />;
  }

  if (error) {
    return <PDFViewerError />;
  }

  if (!pdfFile) {
    return null;
  }

  // Mostra erro se houver
  if (error) {
    return <PDFViewerError />;
  }

  if (!pdfFile) {
    return null;
  }

  return (
    <div
      className={`w-full max-w-6xl mx-auto px-5 py-4 overflow-hidden touch-manipulation relative ${className}`}
      ref={containerRef}
    >
      <Document
        file={pdfFile}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
        loading={PDFViewerLoading}
      >
        {numPages > 0 && (
          <div className="flex justify-center items-center overflow-visible my-5 touch-pinch-zoom">
            {isMobile ? (
              <MobilePageView />
            ) : (
              <HTMLFlipbook
                ref={flipbookRef}
                className="transition-transform duration-300 ease-in-out"
                style={{
                  width: "100%",
                  height: "auto",
                  transformOrigin: "center center",
                }}
                startPage={0}
                size="stretch"
                minWidth={300}
                maxWidth={800}
                minHeight={400}
                maxHeight={1200}
                showCover={false}
                flippingTime={800}
                usePortrait={false}
                startZIndex={0}
                autoSize={true}
                maxShadowOpacity={0.3}
                showPageCorners={true}
                disableFlipByClick={false}
                width={600}
                height={900}
                drawShadow={true}
                mobileScrollSupport={false}
                clickEventForward={true}
                useMouseEvents={true}
                swipeDistance={50}
                onFlip={onFlip}
              >
                {pages}
              </HTMLFlipbook>
            )}
          </div>
        )}
      </Document>

      {numPages > 0 && (
        <div className="flex flex-col items-center gap-4 mt-5">
          <div className="text-center text-base text-gray-800 font-semibold px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
            Página {currentPage} de {numPages}
          </div>

          {isMobile ? (
            // Navegação mobile otimizada
            <div className="mobile-nav-buttons">
              <Button
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
                className="flex-1 min-w-[70px] h-12 text-sm font-medium"
                size="sm"
              >
                Primeira
              </Button>

              <Button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex-1 min-w-[70px] h-12 text-sm font-medium"
                size="sm"
              >
                Anterior
              </Button>

              <Button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === numPages}
                className="flex-1 min-w-[70px] h-12 text-sm font-medium"
                size="sm"
              >
                Próxima
              </Button>

              <Button
                onClick={() => goToPage(numPages)}
                disabled={currentPage === numPages}
                className="flex-1 min-w-[70px] h-12 text-sm font-medium"
                size="sm"
              >
                Última
              </Button>
            </div>
          ) : (
            // Navegação desktop
            <div className="flex gap-2 flex-wrap justify-center">
              <Button
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
                className="min-w-[60px] h-10"
                size="sm"
              >
                Primeira
              </Button>

              <Button
                onClick={() => goToPage(currentPage - 2)}
                disabled={currentPage === 1}
                className="min-w-[60px] h-10"
                size="sm"
              >
                Anterior
              </Button>

              <Button
                onClick={() => goToPage(currentPage + 2)}
                disabled={currentPage === numPages}
                className="min-w-[60px] h-10"
                size="sm"
              >
                Próxima
              </Button>

              <Button
                onClick={() => goToPage(numPages)}
                disabled={currentPage === numPages}
                className="min-w-[60px] h-10"
                size="sm"
              >
                Última
              </Button>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        /* Remove scrollbars e overflow do flipbook */
        .pdf-flipbook * {
          overflow: visible !important;
        }

        /* Garantindo que as páginas não sejam cortadas */
        .react-pdf__Page {
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
        }

        .react-pdf__Page__canvas {
          max-width: 100% !important;
          height: auto !important;
        }

        /* Estilos específicos para mobile */
        @media (max-width: 768px) {
          .nav-button {
            min-width: 50px;
            font-size: 12px;
          }

          /* Melhora a visualização mobile */
          .mobile-pdf-container {
            padding: 10px;
            max-width: 100%;
          }

          /* Botões de navegação mobile */
          .mobile-nav-buttons {
            display: flex;
            gap: 8px;
            width: 100%;
            max-width: 320px;
          }

          .mobile-nav-buttons button {
            flex: 1;
            min-height: 48px;
            font-size: 14px;
            font-weight: 500;
          }
        }

        /* Ajustes para telas muito pequenas */
        @media (max-width: 480px) {
          .mobile-pdf-container {
            padding: 5px;
          }

          .mobile-nav-buttons {
            gap: 6px;
            max-width: 280px;
          }

          .mobile-nav-buttons button {
            min-height: 44px;
            font-size: 13px;
          }
        }

        /* Melhora a experiência de swipe */
        .touch-pan-x {
          touch-action: pan-x;
        }
      `}</style>
    </div>
  );
}

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

function PDFViewerError() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center bg-gray-50 rounded-xl my-5 p-10">
      <p className="text-base text-gray-600 font-medium m-0">
        Erro ao carregar o PDF. Verifique se o arquivo é válido.
      </p>
    </div>
  );
}
