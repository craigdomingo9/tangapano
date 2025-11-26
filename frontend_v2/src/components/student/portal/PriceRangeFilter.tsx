import { Label } from "@/components/ui/label";
import useStudentFilters, {
  StudentFilters,
} from "@/lib/stores/studentFilterStore";

interface PriceRangeFilterProps {
  updateFilter: (
    key: keyof StudentFilters,
    value: string | number | null | string[]
  ) => void;
}

const MIN_BUDGET = 40;
const MAX_BUDGET = 250;

function PriceRangeFilter({ updateFilter }: PriceRangeFilterProps) {
  const getPercent = (value: number) => {
    return ((value - MIN_BUDGET) / (MAX_BUDGET - MIN_BUDGET)) * 100;
  };

  const {
    entities: { minPrice: min, maxPrice: max },
  } = useStudentFilters();

  const minPrice = min ? min : 60;
  const maxPrice = max ? max : 150;

  const setMinPrice = (value: number) => updateFilter("minPrice", value);
  const setMaxPrice = (value: number) => updateFilter("maxPrice", value);

  return (
    <div className="space-y-4">
      <Label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
        Monthly Budget
      </Label>
      <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-inner">
        <div className="flex items-end justify-between mb-4">
          <div className="flex flex-col">
            <span className="text-[0.625rem] text-slate-500 dark:text-slate-400 font-medium uppercase">
              Min
            </span>
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              ${minPrice}
            </span>
          </div>
          <div className="h-8 w-px bg-slate-300 dark:bg-slate-600 mx-2"></div>
          <div className="flex flex-col text-right">
            <span className="text-[0.625rem] text-slate-500 dark:text-slate-400 font-medium uppercase">
              Max
            </span>
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              ${maxPrice}
            </span>
          </div>
        </div>

        {/* Visual Range Slider Simulation */}
        <div className="relative h-10 flex items-center isolate">
          <style>{`
              .range-slider-input {
                  -webkit-appearance: none;
                  appearance: none;
                  background: transparent;
                  pointer-events: none;
                  position: absolute;
                  width: 100%;
                  height: 100%;
                  z-index: 20;
                  margin: 0;
                  top: 0;
                  left: 0;
              }
              .range-slider-input::-webkit-slider-thumb {
                  -webkit-appearance: none;
                  appearance: none;
                  pointer-events: auto;
                  width: 24px;
                  height: 24px;
                  border-radius: 50%;
                  background: transparent;
                  cursor: grab;
              }
              .range-slider-input::-moz-range-thumb {
                  -moz-appearance: none;
                  appearance: none;
                  pointer-events: auto;
                  width: 24px;
                  height: 24px;
                  border-radius: 50%;
                  background: transparent;
                  cursor: grab;
                  border: none;
              }
          `}</style>
          <input
            type="range"
            min={MIN_BUDGET}
            max={MAX_BUDGET}
            step="5"
            value={minPrice}
            onChange={(e) => {
              const val = Math.min(Number(e.target.value), maxPrice - 10);
              setMinPrice(val);
            }}
            className="range-slider-input"
          />
          <input
            type="range"
            min={MIN_BUDGET}
            max={MAX_BUDGET}
            step="5"
            value={maxPrice}
            onChange={(e) => {
              const val = Math.max(Number(e.target.value), minPrice + 10);
              setMaxPrice(val);
            }}
            className="range-slider-input"
          />

          {/* Track */}
          <div className="w-full h-[0.425rem] bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden relative z-10 pointer-events-none">
            <div
              className="absolute top-0 bottom-0 bg-crimson dark:bg-red-600"
              style={{
                left: `${getPercent(minPrice)}%`,
                right: `${100 - getPercent(maxPrice)}%`,
              }}
            ></div>
          </div>

          {/* Thumbs (Visual Only) */}
          <div
            className="absolute w-[1.35rem] h-[1.35rem] bg-white dark:bg-slate-200 border-2 border-crimson dark:border-red-600 rounded-full shadow-md pointer-events-none transition-all z-10"
            style={{ left: `calc(${getPercent(minPrice)}% - 12px)` }}
          ></div>
          <div
            className="absolute w-[1.35rem] h-[1.35rem] bg-white dark:bg-slate-200 border-2 border-crimson dark:border-red-600 rounded-full shadow-md pointer-events-none transition-all z-10"
            style={{ left: `calc(${getPercent(maxPrice)}% - 12px)` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default PriceRangeFilter;
