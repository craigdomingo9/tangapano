"use client";
import { Button } from "@/components/ui/button";
import myImageLoader from "@/lib/images/image-loader";
import { getShimmerUrl } from "@/lib/images/shimmer";
import { ChevronRight, Edit, Star, Trash2 } from "lucide-react";
import Image from "next/image";

interface ImageCardProps {
  image: Image;
  onDelete: (id: string) => void;
  onSelectFace: (id: string) => void;
  onLabelChange: (id: string, label: string) => void;
}

const ROOM_TYPES = [
  "Bedroom",
  "Living Room",
  "Kitchen",
  "Dining Room",
  "Bathroom",
];

function ImageCard({
  image,
  onDelete,
  onSelectFace,
  onLabelChange,
}: ImageCardProps) {
  return (
    <div
      className={`
        relative group rounded-xl overflow-hidden border transition-all duration-200
        ${
          image.is_face_image
            ? "border-lapis shadow-md ring-2 ring-lapis/20"
            : "border-slate-200 hover:border-slate-300 shadow-sm"
        }
      `}
    >
      {/* Image Container */}
      <div className="relative aspect-4/3 w-full bg-slate-100">
        <Image
          src={image.display_image}
          alt={image.caption}
          className="w-full h-full object-cover"
          loader={myImageLoader}
          width={100}
          height={100}
          placeholder="blur"
          blurDataURL={getShimmerUrl(700, 475)}
        />

        {/* Delete Button - Top Right */}
        <Button
          onClick={() => {
            onDelete(image.id);
          }}
          className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm text-slate-400 rounded-full shadow-sm hover:bg-crimson hover:text-white transition-colors cursor-pointer"
          title="Remove photo"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
        <button
          onClick={() => {
            console.log("Delete deep", image.id);
            onDelete(image.id);
          }}
        >
          hi
        </button>

        {/* Cover Selection Button - Top Left */}
        <button
          onClick={() => onSelectFace(image.id)}
          disabled={image.is_face_image}
          className={`
            absolute cursor-pointer top-2 left-2 px-2 py-1 rounded-md text-xs font-semibold shadow-sm flex items-center gap-1 transition-all
            ${
              image.is_face_image
                ? "bg-lapis text-white opacity-100"
                : "bg-white/90 text-slate-600 hover:bg-white hover:text-lapis"
            }
          `}
        >
          {image.is_face_image ? (
            <>
              <Star fill="currentColor" className="w-3 h-3" />
              <span>Cover Photo</span>
            </>
          ) : (
            <>
              <Star className="w-3 h-3" />
              <span>Set as Cover</span>
            </>
          )}
        </button>
      </div>

      {/* Caption Bar */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800">
        <div className="relative group/select">
          {/* The visual trigger */}
          <div
            className={`
                flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border
                ${
                  image.is_face_image
                    ? "bg-lapis/5 border-lapis/20 text-lapis dark:bg-sky-500/10 dark:border-sky-500/20 dark:text-sky-400"
                    : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-sm"
                }
            `}
          >
            <div className="flex items-center gap-2.5 truncate flex-1">
              <div
                className={`p-1 rounded-md shrink-0 transition-colors ${
                  image.is_face_image
                    ? "bg-lapis/10 dark:bg-sky-500/10"
                    : "bg-white dark:bg-slate-700 shadow-sm border border-slate-100 dark:border-slate-600 group-hover/select:border-slate-200 dark:group-hover/select:border-slate-500"
                }`}
              >
                <Edit
                  className={`w-3 h-3 ${
                    image.is_face_image
                      ? "opacity-70"
                      : "text-slate-400 dark:text-slate-400"
                  }`}
                />
              </div>
              <div className="flex flex-col min-w-0">
                <span
                  className={`text-xxs font-bold uppercase tracking-wider leading-none mb-0.5 ${
                    image.is_face_image
                      ? "text-lapis/60 dark:text-sky-400/60"
                      : "text-slate-400 dark:text-slate-500"
                  }`}
                >
                  Label
                </span>
                <span className="truncate leading-none pb-0.5">
                  {image.caption || "Select Label"}
                </span>
              </div>
            </div>
            <ChevronRight
              className={`w-4 h-4 shrink-0 transition-transform duration-200 rotate-90 ${
                image.is_face_image
                  ? "opacity-60"
                  : "text-slate-400 dark:text-slate-500 group-hover/select:text-slate-600 dark:group-hover/select:text-slate-300"
              }`}
            />
          </div>

          {/* Native select overlay */}
          <select
            value={image.caption}
            onChange={(e) => onLabelChange(image.id, e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
            title="Change label"
          >
            {ROOM_TYPES.map((type) => (
              <option key={type} value={type} className="text-slate-900">
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default ImageCard;
