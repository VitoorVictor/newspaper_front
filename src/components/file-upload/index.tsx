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
}

export function FileUpload({
  accept,
  onFileSelect,
  placeholder,
  hasPreview,
  maxSize = 10,
  multiple = false,
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
