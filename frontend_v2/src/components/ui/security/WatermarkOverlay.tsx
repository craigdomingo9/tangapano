function WatermarkOverlay({ identity }: { identity: string }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-1 flex flex-wrap content-center justify-center overflow-hidden opacity-[0.5] select-none"
      aria-hidden="true"
    >
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="w-48 sm:w-64 h-48 sm:h-64 flex items-center justify-center -rotate-45 transform"
        >
          <span className="text-xl font-black text-lapis whitespace-nowrap">
            {identity}
          </span>
        </div>
      ))}
    </div>
  );
}

export default WatermarkOverlay;
