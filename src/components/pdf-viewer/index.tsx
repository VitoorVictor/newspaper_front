"use client";

import dynamic from "next/dynamic";

// Carrega o PDFViewer apenas no cliente (sem SSR)
const PDFViewerClient = dynamic(() => import("./pdf-client"), {
  ssr: false,
});

interface PDFViewerProps {
  file: string;
}

export default function PDFViewer({ file }: PDFViewerProps) {
  return <PDFViewerClient file={file} />;
}
