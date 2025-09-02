"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X, Plus } from "lucide-react";

interface FileData {
  file: File;
  dataUrl: string;
  id: string;
}

interface FileUploadProps {
  accept: string;
  onFileSelect: (files: File[] | File) => void; // Updated to support both single file and array
  placeholder: string;
  hasPreview?: string[];
  maxSize?: number; // em MB
  multiple?: boolean;
  bannerType?: string; // Tipo do banner para orientações específicas
}

export function FileUpload({
  accept,
  onFileSelect,
  placeholder,
  hasPreview,
  maxSize = 10,
  multiple = false,
  bannerType,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<FileData[]>(() => {
    if (hasPreview && hasPreview.length > 0) {
      return hasPreview.map((preview, index) => ({
        file: new File([], `preview-${index}`),
        dataUrl: preview,
        id: `preview-${index}-${Date.now()}`,
      }));
    }
    return [];
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getBannerGuidelines = (type?: string) => {
    switch (type) {
      case "side":
        return {
          title: "Banner Lateral (9:16)",
          dimensions: ["1080 × 1920 px", "720 × 1280 px", "1440 × 2560 px"],
          description: "Proporção vertical para banners laterais",
        };
      case "pop up":
        return {
          title: "Banner Pop-up (1:1)",
          dimensions: ["1080 × 1080 px", "1500 × 1500 px", "2048 × 2048 px"],
          description: "Proporção quadrada para pop-ups",
        };
      default:
        return {
          title: "Banner Padrão (15:2)",
          dimensions: ["1500 × 200 px", "3000 × 400 px", "4500 × 600 px"],
          description: "Proporção horizontal para banners padrão",
        };
    }
  };

  const guidelines = getBannerGuidelines(bannerType);

  const notifyFileChange = (updatedFiles: FileData[]) => {
    const fileArray = updatedFiles.map((f) => f.file);
    onFileSelect(multiple ? fileArray : fileArray[0] || null);
  };

  const processFiles = (newFiles: File[]) => {
    for (const file of newFiles) {
      if (file.size > maxSize * 1024 * 1024) {
        alert(`Arquivo "${file.name}" muito grande. Máximo ${maxSize}MB`);
        continue;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const fileData: FileData = {
          file,
          dataUrl,
          id: `${file.name}-${Date.now()}-${Math.random()}`,
        };

        setFiles((prevFiles) => {
          const updatedFiles = multiple ? [...prevFiles, fileData] : [fileData];
          setTimeout(() => notifyFileChange(updatedFiles), 0);
          return updatedFiles;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      processFiles(droppedFiles);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removeFile = (fileId: string) => {
    setFiles((prevFiles) => {
      const updatedFiles = prevFiles.filter((f) => f.id !== fileId);
      setTimeout(() => notifyFileChange(updatedFiles), 0);
      return updatedFiles;
    });
  };

  const clearAllFiles = () => {
    setFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setTimeout(() => notifyFileChange([]), 0);
  };

  return (
    <div className="space-y-4">
      {/* Orientações do Banner */}
      {bannerType && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">
            {guidelines.title}
          </h4>
          <p className="text-sm text-blue-700 mb-3">{guidelines.description}</p>
          <div className="space-y-1">
            <p className="text-sm font-medium text-blue-800">
              Dimensões recomendadas:
            </p>
            <ul className="text-sm text-blue-700 space-y-1">
              {guidelines.dimensions.map((dimension, index) => (
                <li key={index} className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  {dimension}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {files.length > 0 ? (
          <div className="space-y-4">
            <div
              className={`grid gap-4 ${
                multiple ? "grid-cols-2 md:grid-cols-3" : "grid-cols-1"
              }`}
            >
              {files.map((fileData) => (
                <div key={fileData.id} className="relative">
                  {accept.includes("image") ? (
                    <img
                      src={fileData.dataUrl || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full h-24 object-cover rounded border"
                    />
                  ) : (
                    <div className="p-4 bg-muted rounded border">
                      <div className="text-xs font-medium truncate">
                        {fileData.file.name || "Arquivo"}
                      </div>
                    </div>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 p-0 bg-background border"
                    onClick={() => removeFile(fileData.id)}
                    type="button"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 justify-center">
              {multiple && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  type="button"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Mais
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFiles}
                type="button"
              >
                <X className="h-4 w-4 mr-2" />
                Limpar {multiple && files.length > 1 ? "Todos" : ""}
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <div className="text-sm text-muted-foreground mb-2">
              {placeholder}
            </div>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              type="button"
            >
              Selecionar {multiple ? "Arquivos" : "Arquivo"}
            </Button>
          </div>
        )}
      </div>

      <Input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => {
          const selectedFiles = Array.from(e.target.files || []);
          if (selectedFiles.length > 0) {
            processFiles(selectedFiles);
          }
        }}
      />
    </div>
  );
}
