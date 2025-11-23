import { MoonLoader } from "react-spinners";
import { Icons } from "./extras/Icons";
import { useState } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ListingImageCardProps {
  image: Image;
  onDelete: (id: string) => void;
  onSelectFace: (id: string) => void;
}

export const ListingImageCard: React.FC<ListingImageCardProps> = ({
  image,
  onDelete,
  onSelectFace,
}) => {
  const [isSelecting, setIsSelecting] = useState(false);

  return (
    <div
      className={`
        relative group rounded-xl overflow-hidden border-2 transition-all duration-200
        ${
          image.is_face_image
            ? "border-blue-600 shadow-lg ring-2 ring-blue-100"
            : "border-transparent hover:border-gray-300 shadow-sm"
        }
      `}
    >
      {/* Image Container */}
      <div className="relative aspect-4/3 w-full bg-gray-100">
        <Avatar className="w-full h-full rounded-none">
          <AvatarImage src={image.image} className="h-full w-full" />
          <AvatarFallback className="rounded-md">
            {image.caption.toUpperCase() || "Property Image"}
          </AvatarFallback>
        </Avatar>

        {/* Delete Button - Top Right */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(image.id);
          }}
          className="absolute top-2 right-2 p-1.5 bg-white/90 text-red-500 rounded-full shadow-sm hover:bg-red-500 hover:text-white transition-colors"
          title="Remove image"
        >
          <Icons.Trash />
        </button>

        {/* Face Selection Badge/Button - Top Left */}
        <button
          onClick={() => {
            if (!image.is_face_image) {
              setIsSelecting(true);
              onSelectFace(image.id);
            }
          }}
          disabled={isSelecting}
          className={`
            absolute top-2 left-2 px-2 py-1 rounded-md text-xs font-semibold shadow-sm flex items-center gap-1 transition-all
            ${
              image.is_face_image
                ? "bg-blue-600 text-white opacity-100"
                : "text-gray-600 bg-blue-50 hover:text-blue-600 opacity-100"
            }
            ${isSelecting ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
          `}
        >
          {image.is_face_image ? (
            <>
              <Icons.Star filled={true} />
              <span>Face Image</span>
            </>
          ) : (
            <>
              {isSelecting ? (
                <MoonLoader size={12} />
              ) : (
                <>
                  <Icons.Star filled={false} />
                  <span>Set as Face</span>
                </>
              )}
            </>
          )}
        </button>
      </div>

      {/* Caption Bar */}
      <div
        className={`
        px-3 py-2 flex items-center justify-between text-sm font-medium transition-colors
        ${
          image.is_face_image
            ? "bg-blue-600 text-white"
            : "bg-slate-500 text-white"
        }
      `}
      >
        <span className="truncate">{image.caption}</span>
        {image.is_face_image && (
          <div className="bg-white/20 p-1 rounded-full">
            <Icons.Check />
          </div>
        )}
      </div>
    </div>
  );
};
