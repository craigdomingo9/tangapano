import { Map, Sparkles, Tag } from "lucide-react";

interface LATabsProps {
  activeTab: "locations" | "amenities";
  setActiveTab: (tab: "locations" | "amenities") => void;
}

function LATabs({ activeTab, setActiveTab }: LATabsProps) {
  return (
    <div className="dark:bg-app-bg sticky top-16 z-40">
      <div className="p-1 bg-muted/30 border border-border/40 rounded-xl grid grid-cols-2 w-full sm:w-fit">
        <button
          onClick={() => setActiveTab("locations")}
          className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all w-full duration-300 text-center flex justify-center gap-2 cursor-pointer ${
            activeTab === "locations"
              ? "bg-card text-lapis shadow-sm ring-1 ring-border/10"
              : "text-muted-foreground hover:text-foreground hover:bg-white/5"
          }`}
        >
          <Map className="w-4 h-4" />
          Locations
        </button>
        <button
          onClick={() => setActiveTab("amenities")}
          className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all text-center w-full duration-300 flex justify-center gap-2 cursor-pointer ${
            activeTab === "amenities"
              ? "bg-card text-lapis shadow-sm ring-1 ring-border/10"
              : "text-muted-foreground hover:text-foreground hover:bg-white/5"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Amenities
        </button>
      </div>
    </div>
  );
}

export default LATabs;
