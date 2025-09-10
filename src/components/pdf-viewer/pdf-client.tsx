"use client";

import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink } from "lucide-react";

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

  // Ajusta largura do PDF conforme a tela
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth <= 480) {
        setPageWidth(250); // mobile
      } else if (window.innerWidth <= 768) {
        setPageWidth(350); // tablet
      } else {
        setPageWidth(450); // desktop
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  // Função para ir para uma página específica
  function goToPage(pageNumber: number) {
    if (pageNumber >= 1 && pageNumber <= numPages) {
      setCurrentPage(pageNumber);
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

  // Componente de loading
  if (loading) return <PDFViewerLoading />;

  // Componente de erro
  if (error) return <PDFViewerError />;

  if (!pdfFile) return null;

  return (
    <div
      className={`w-full max-w-4xl mx-auto px-5 py-4 flex flex-col items-center gap-5 ${className}`}
    >
      {/* Botões de ação */}
      {pdfFile && (
        <div className="flex gap-3 justify-center w-full">
          <Button
            onClick={handleDownload}
            className="flex items-center gap-2 h-10 px-4"
            size="sm"
          >
            <Download className="w-4 h-4" />
            Baixar PDF
          </Button>

          <Button
            onClick={handleOpenInNewTab}
            variant="outline"
            className="flex items-center gap-2 h-10 px-4"
            size="sm"
          >
            <ExternalLink className="w-4 h-4" />
            Abrir PDF
          </Button>
        </div>
      )}

      {/* Visualização do PDF */}
      <div className="overflow-hidden flex justify-center w-full">
        <Document
          file={pdfFile}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={PDFViewerLoading}
        >
          <Page
            pageNumber={currentPage}
            renderAnnotationLayer={false}
            renderTextLayer={false}
            width={pageWidth} // <--- Ajusta a largura dinamicamente
            height={undefined} // <--- Mantém proporção da altura
            className="w-full h-auto object-contain"
            loading={PDFViewerLoading}
          />
        </Document>
      </div>

      {/* Barra de Navegação */}
      {numPages > 0 && (
        <div className="flex flex-col items-center gap-3 w-full">
          {/* Indicador de página atual */}
          <div className="text-center text-sm text-gray-700 font-medium px-3 py-1 bg-gray-50 rounded-md border border-gray-200">
            Página {currentPage} de {numPages}
          </div>

          {/* Controles de navegação */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <Button
              onClick={() => goToPage(1)}
              disabled={currentPage === 1}
              className="min-w-[60px] h-10"
              size="sm"
            >
              Primeira
            </Button>

            <Button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="min-w-[60px] h-10"
              size="sm"
            >
              Anterior
            </Button>

            {/* Seletor de página no meio */}
            <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 shadow-sm px-3 py-1">
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
                  className="w-12 h-8 text-center text-sm border border-gray-300 rounded px-1 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                  placeholder="1"
                />
                <span className="text-xs text-gray-400">/</span>
                <span className="text-xs text-gray-600 font-medium">
                  {numPages}
                </span>
                <Button
                  type="submit"
                  size="sm"
                  className="h-8 min-w-8 px-2 text-xs"
                >
                  Ir
                </Button>
              </form>
            </div>

            <Button
              onClick={() => goToPage(currentPage + 1)}
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
