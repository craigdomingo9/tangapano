import { Image as ImageIcon, Star } from "lucide-react";

interface ImageHeaderStatsProps {
  images: Image[];
}

function ImageHeaderStats({ images }: ImageHeaderStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-transform hover:scale-[1.02]">
        <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
          <ImageIcon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Total Photos
          </p>
          <p className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            {images.length}
          </p>
        </div>
      </div>
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-transform hover:scale-[1.02]">
        <div className="w-12 h-12 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
          <Star className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Cover Photo
          </p>
          <p className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[120px]">
            {images.find((i) => i.is_face_image)?.caption || "None Selected"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ImageHeaderStats;
