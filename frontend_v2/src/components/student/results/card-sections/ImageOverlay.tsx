import { MapPin } from "lucide-react";

interface ImageOverlayProps {
  title: string;
  neighborhood: string;
}

export default function ImageOverlay({
  title,
  neighborhood,
}: ImageOverlayProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
      <h3 className="text-lg font-bold text-white mb-1 tracking-tight leading-tight shadow-sm drop-shadow-md">
        {title}
      </h3>
      <div className="flex items-center gap-1.5 text-slate-200 text-xs font-medium drop-shadow-sm">
        <MapPin className="w-4 h-4 opacity-80" />
        <span>{neighborhood}</span>
      </div>
    </div>
  );
}
