"use client";

import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import HTMLFlipbook from "react-pageflip";
import { useState, useRef, useEffect } from "react";
import { Button } from "../ui/button";

// Configura o worker local do pdfjs (sem usar CDN)
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFClientProps {
  file: string;
  className?: string;
}

export default function PDFClient({ file, className = "" }: PDFClientProps) {
  console.log(file);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<string | null>(null);
  const flipbookRef = useRef<any>(null);

  // Detecta se é uma URL ou arquivo local
  const isUrl = (file: string) => {
    try {
      new URL(file);
      return true;
    } catch {
      return false;
    }
  };

  // Faz download da URL e converte para blob (com proxy CORS para testes)
  const downloadAndConvertToBlob = async (url: string) => {
    try {
      setLoading(true);
      setError(null);

      console.log(url);

      const response = await fetch(url);

      console.log(response);
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
  };

  // Processa o arquivo quando a prop file muda
  useEffect(() => {
    if (file) {
      if (isUrl(file)) {
        // Se for URL, faz download
        downloadAndConvertToBlob(file);
      } else {
        // Se for arquivo local, usa diretamente
        setPdfFile(file);
        setLoading(false);
        setError(null);
      }
    }
  }, [file]);

  // Limpa o blob URL quando o componente é desmontado
  useEffect(() => {
    return () => {
      if (pdfFile && isUrl(file)) {
        URL.revokeObjectURL(pdfFile);
      }
    };
  }, [pdfFile, file]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  function onDocumentLoadError(error: Error) {
    console.error("Erro ao carregar PDF:", error);
    setError("Erro ao carregar o PDF. Verifique se o arquivo é válido.");
  }

  // Função para atualizar a página atual
  function onFlip(e: any) {
    const newPage = e.data + 1; // +1 porque o flipbook começa em 0
    setCurrentPage(newPage);
  }

  // Função para ir para uma página específica
  function goToPage(pageNumber: number) {
    if (flipbookRef.current && pageNumber >= 1 && pageNumber <= numPages) {
      flipbookRef.current.pageFlip().flip(pageNumber - 1); // -1 porque o flipbook começa em 0
      setCurrentPage(pageNumber);
    }
  }

  // Gera um array com todas as páginas
  const pages = Array.from(new Array(numPages), (_, index) => (
    <div key={`page_${index + 1}`} className="page-wrapper">
      <Page
        pageNumber={index + 1}
        renderAnnotationLayer={false}
        renderTextLayer={false}
        width={600}
        className="pdf-page"
      />
    </div>
  ));

  // Mostra loading enquanto faz download
  if (loading) {
    return (
      <div className={`pdf-viewer-container ${className}`}>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Fazendo download do PDF...</p>
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
    <div className={`pdf-viewer-container ${className}`}>
      <Document
        file={pdfFile}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
      >
        {numPages > 0 && (
          <div className="flipbook-wrapper max-h-[75vh]">
            <HTMLFlipbook
              ref={flipbookRef}
              className="pdf-flipbook"
              style={{ width: "100%", height: "auto" }}
              startPage={0}
              size="stretch"
              minWidth={300}
              maxWidth={800}
              minHeight={400}
              maxHeight={800}
              showCover={false}
              flippingTime={800}
              usePortrait={false}
              startZIndex={0}
              autoSize={true}
              maxShadowOpacity={0.3}
              showPageCorners={true}
              disableFlipByClick={false}
              width={600}
              height={800}
              drawShadow={true}
              mobileScrollSupport={false}
              clickEventForward={true}
              useMouseEvents={true}
              swipeDistance={50}
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
            >
              Primeira
            </Button>

            <Button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="nav-button"
            >
              Anterior
            </Button>

            <Button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === numPages}
              className="nav-button"
            >
              Próxima
            </Button>

            <Button
              onClick={() => goToPage(numPages)}
              disabled={currentPage === numPages}
              className="nav-button"
            >
              Última
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
        }

        .flipbook-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          margin: 20px 0;
        }

        .pdf-flipbook {
          overflow: hidden !important;
        }

        .page-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          background: white;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .pdf-page {
          max-width: 100%;
          height: auto;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px;
          text-align: center;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3498db;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
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
          min-width: 80px;
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
            min-width: 70px;
          }
        }
      `}</style>
    </div>
  );
}
