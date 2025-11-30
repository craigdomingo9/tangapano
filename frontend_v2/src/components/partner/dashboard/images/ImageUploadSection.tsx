import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus, Loader2 } from "lucide-react";
import React, { useRef, useState, DragEvent, ChangeEvent } from "react";

interface Props {
  onUpload: (files: File[]) => void;
  isUploading: boolean;
}

function ImageUploadSection({ onUpload, isUploading }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  // Handle Drag Events
  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  // Handle Drop
  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndUpload(Array.from(e.dataTransfer.files));
    }
  };

  // Handle Click Select
  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndUpload(Array.from(e.target.files));
    }
  };

  const validateAndUpload = (files: File[]) => {
    // Optional: Add size/type validation here
    onUpload(files);
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => !isUploading && fileInputRef.current?.click()}
      className={cn(
        "relative p-10 rounded-2xl border-2 border-dashed shadow-sm text-center transition-all cursor-pointer overflow-hidden group",
        isDragActive
          ? "border-lapis bg-lapis/5 dark:bg-sky-500/10 scale-[1.01]"
          : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-lapis dark:hover:border-sky-500 hover:bg-slate-50 dark:hover:bg-slate-800/50",
        isUploading && "opacity-50 pointer-events-none"
      )}
    >
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        className="hidden"
        accept="image/*"
        multiple
      />

      <div className="relative z-10 flex flex-col items-center">
        <div
          className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors",
            isDragActive
              ? "bg-lapis text-white shadow-lg shadow-lapis/30"
              : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 group-hover:scale-110 group-hover:text-lapis dark:group-hover:text-sky-400 duration-300"
          )}
        >
          {isUploading ? (
            <Loader2 className="w-8 h-8 animate-spin" />
          ) : (
            <Plus className="w-8 h-8" />
          )}
        </div>

        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
          {isUploading ? "Uploading..." : "Add Property Photos"}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
          Drag and drop your high-quality images here, or click to browse. We
          support JPG, PNG and WebP.
        </p>

        <Button
          disabled={isUploading}
          className={cn(
            "min-w-40 font-semibold",
            isDragActive && "pointer-events-none"
          )}
        >
          {isUploading ? "Uploading..." : "Select Photos"}
        </Button>
      </div>

      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(#0c6291_1px,transparent_1px)] bg-size-[16px_16px]"></div>
      </div>
    </div>
  );
}

export default ImageUploadSection;
