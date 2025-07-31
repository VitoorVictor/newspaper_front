"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X } from "lucide-react";

interface FileUploadProps {
  accept: string;
  onFileSelect: (file: File, dataUrl: string) => void;
  placeholder: string;
  maxSize?: number; // em MB
}

export function FileUpload({
  accept,
  onFileSelect,
  placeholder,
  maxSize = 10,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file.size > maxSize * 1024 * 1024) {
      alert(`Arquivo muito grande. Máximo ${maxSize}MB`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setPreview(dataUrl);
      onFileSelect(file, dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const clearPreview = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
        {preview ? (
          <div className="relative">
            {accept.includes("image") ? (
              <img
                src={preview || "/placeholder.svg"}
                alt="Preview"
                className="max-w-full max-h-32 mx-auto rounded"
              />
            ) : (
              <div className="p-4 bg-muted rounded">
                <div className="text-sm font-medium">Arquivo selecionado</div>
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              className="absolute -top-2 -right-2 bg-transparent"
              onClick={clearPreview}
              type="button"
            >
              <X className="h-4 w-4" />
            </Button>
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
              Selecionar Arquivo
            </Button>
          </div>
        )}
      </div>

      <Input
        ref={fileInputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileSelect(file);
        }}
      />
    </div>
  );
}
