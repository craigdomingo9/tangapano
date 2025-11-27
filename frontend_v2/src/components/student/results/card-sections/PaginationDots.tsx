import { cn } from "@/lib/utils";

interface PaginationDotsProps {
  total: number;
  currentIndex: number;
}

export default function PaginationDots({
  total,
  currentIndex,
}: PaginationDotsProps) {
  return (
    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
      {Array.from({ length: total }).map((_, idx) => (
        <div
          key={idx}
          className={cn(
            "w-[0.325rem] h-[0.325rem] rounded-full transition-all shadow-sm",
            idx === currentIndex ? "bg-white scale-125" : "bg-white/50"
          )}
        />
      ))}
    </div>
  );
}
