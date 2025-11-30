import React from "react";
import ImageCard from "./ImageCard";

interface ImageCardProps {
  images: Image[];
  onDelete: (id: string) => void;
  onSelectFace: (id: string) => void;
  onLabelChange: (id: string, label: string) => void;
}

function ImageGrid({
  images,
  onDelete,
  onSelectFace,
  onLabelChange,
}: ImageCardProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          Gallery
          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-400 font-medium">
            {images.length}
          </span>
        </h3>
      </div>

      {images.length === 0 ? (
        <div className="text-center py-16 bg-slate-50/50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 border-dashed">
          <p className="text-slate-400 dark:text-slate-500 font-medium text-sm">
            No photos uploaded yet
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((img) => (
            <ImageCard
              key={img.id}
              image={img}
              onDelete={(id) => onDelete(id)}
              onSelectFace={(id) => onSelectFace(id)}
              onLabelChange={(id, label) => onLabelChange(id, label)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ImageGrid;
