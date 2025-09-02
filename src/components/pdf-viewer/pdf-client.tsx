"use client";

import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import HTMLFlipbook from "react-pageflip";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Button } from "../ui/button";
import { RotateCw, Download } from "lucide-react";

// Configura o worker local do pdfjs (sem usar CDN)
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFClientProps {
  file: string;
  className?: string;
}

export default function PDFClient({ file, className = "" }: PDFClientProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<string | null>(null);
  const [rotation, setRotation] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isDocumentLoading, setIsDocumentLoading] = useState<boolean>(true);
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
      setIsDocumentLoading(true);
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

  const handleRotate = useCallback(() => {
    setRotation((prev) => (prev + 90) % 360);
  }, []);

  const handleDownload = useCallback(() => {
    if (pdfFile) {
      const link = document.createElement("a");
      link.href = pdfFile;
      link.download = "documento.pdf";
      link.click();
    }
  }, [pdfFile]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setIsDocumentLoading(false);
  }

  function onDocumentLoadError(error: Error) {
    console.error("Erro ao carregar PDF:", error);
    setError("Erro ao carregar o PDF. Verifique se o arquivo é válido.");
    setIsDocumentLoading(false);
  }

  // Função para atualizar a página atual
  function onFlip(e: any) {
    const newPage = e.data + 1;
    setCurrentPage(newPage);
  }

  // Função para ir para uma página específica
  function goToPage(pageNumber: number) {
    if (flipbookRef.current && pageNumber >= 1 && pageNumber <= numPages) {
      flipbookRef.current.pageFlip().flip(pageNumber - 1);
      setCurrentPage(pageNumber);
    }
  }

  // Gera um array com todas as páginas (otimizado com memo)
  const pages = useMemo(() => {
    return Array.from(new Array(numPages), (_, index) => (
      <div key={`page_${index + 1}`} className="page-wrapper">
        <Page
          pageNumber={index + 1}
          renderAnnotationLayer={false}
          renderTextLayer={false}
          width={isMobile ? 300 : 600}
          className="pdf-page"
          loading="lazy"
        />
      </div>
    ));
  }, [numPages, isMobile]);

  // Mostra loading enquanto faz download ou carrega o documento
  if (loading || isDocumentLoading) {
    return (
      <div className={`pdf-viewer-container ${className}`}>
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center bg-gray-50 rounded-xl my-5 p-10">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-5"></div>
          <p className="text-base text-gray-600 font-medium m-0">
            {loading ? "Fazendo download do PDF..." : "Carregando PDF..."}
          </p>
        </div>
      </div>
    );
  }

  // Mostra erro se houver
  if (error) {
    return (
      <div className={`pdf-viewer-container ${className}`}>
        <div className="error-container">
          <p className="error-message">{error}</p>
          <Button
            onClick={() => {
              setError(null);
              if (isUrl(file)) {
                downloadAndConvertToBlob(file);
              }
            }}
            className="retry-button"
          >
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  // Só renderiza se tiver um arquivo válido
  if (!pdfFile) {
    return null;
  }

  return (
    <div className={`pdf-viewer-container ${className}`} ref={containerRef}>
      <Document
        file={pdfFile}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
        loading="lazy"
      >
        {numPages > 0 && (
          <div className="flipbook-wrapper max-h-[75vh]">
            <HTMLFlipbook
              ref={flipbookRef}
              className="pdf-flipbook"
              style={{
                width: "100%",
                height: "auto",
                transform: `rotate(${rotation}deg)`,
                transformOrigin: "center center",
              }}
              startPage={0}
              size="stretch"
              minWidth={isMobile ? 250 : 300}
              maxWidth={isMobile ? 400 : 800}
              minHeight={isMobile ? 300 : 400}
              maxHeight={isMobile ? 600 : 800}
              showCover={false}
              flippingTime={isMobile ? 600 : 800}
              usePortrait={isMobile}
              startZIndex={0}
              autoSize={true}
              maxShadowOpacity={0.3}
              showPageCorners={!isMobile}
              disableFlipByClick={false}
              width={isMobile ? 300 : 600}
              height={isMobile ? 400 : 800}
              drawShadow={!isMobile}
              mobileScrollSupport={isMobile}
              clickEventForward={true}
              useMouseEvents={!isMobile}
              swipeDistance={isMobile ? 30 : 50}
              onFlip={onFlip}
            >
              {pages}
            </HTMLFlipbook>
          </div>
        )}
      </Document>

      {numPages > 0 && (
        <div className="page-navigation">
          <div className="page-indicator">
            Página {currentPage} de {numPages}
          </div>

          <div className="page-controls">
            <Button
              onClick={() => goToPage(1)}
              disabled={currentPage === 1}
              className="nav-button"
              size="sm"
            >
              {isMobile ? "1ª" : "Primeira"}
            </Button>

            <Button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="nav-button"
              size="sm"
            >
              {isMobile ? "←" : "Anterior"}
            </Button>

            <Button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === numPages}
              className="nav-button"
              size="sm"
            >
              {isMobile ? "→" : "Próxima"}
            </Button>

            <Button
              onClick={() => goToPage(numPages)}
              disabled={currentPage === numPages}
              className="nav-button"
              size="sm"
            >
              {isMobile ? "Últ" : "Última"}
            </Button>
          </div>
        </div>
      )}

      <style jsx>{`
        .pdf-viewer-container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          overflow: hidden;
          touch-action: manipulation;
          position: relative;
        }

        .flipbook-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          margin: 20px 0;
          touch-action: pinch-zoom;
        }

        .pdf-flipbook {
          overflow: hidden !important;
          transition: transform 0.3s ease;
        }

        .page-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          background: white;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          transform-origin: center;
        }

        .pdf-page {
          max-width: 100%;
          height: auto;
          transition: transform 0.3s ease;
        }

        .error-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px;
          text-align: center;
        }

        .error-message {
          color: #e74c3c;
          margin-bottom: 16px;
          font-size: 16px;
        }

        .retry-button {
          margin-top: 16px;
        }

        .page-navigation {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          margin-top: 20px;
        }

        .page-indicator {
          text-align: center;
          font-size: 16px;
          color: #333;
          font-weight: 600;
          padding: 8px 16px;
          background: #f8f9fa;
          border-radius: 8px;
          border: 1px solid #e9ecef;
        }

        .page-controls {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .nav-button {
          min-width: 60px;
        }

        /* Remove scrollbars e overflow */
        .pdf-flipbook * {
          overflow: hidden !important;
        }

        /* Responsivo para mobile */
        @media (max-width: 768px) {
          .pdf-viewer-container {
            padding: 10px;
          }

          .flipbook-wrapper {
            margin: 10px 0;
          }

          .page-controls {
            gap: 6px;
          }

          .nav-button {
            min-width: 50px;
            font-size: 12px;
          }

          .page-indicator {
            font-size: 14px;
            padding: 6px 12px;
          }
        }

        /* Melhorias de performance */
        .pdf-page {
          will-change: transform;
        }

        .page-wrapper {
          will-change: transform;
        }
      `}</style>
    </div>
  );
}
