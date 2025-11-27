import {
  depositOptions,
  moveInOptions,
  paymentOptions,
} from "@/lib/constants/express-interest";
import {
  ExpressInterestState,
  useExpressInterestStore,
} from "@/lib/stores/expressInterestStore";
import { cn } from "@/lib/utils";
import { CalendarDays, Check } from "lucide-react";

interface MoveInPlusFinancialProps {
  updateStore: (key: keyof ExpressInterestState, value: any) => void;
}

function SelectButton({
  optionValue,
  optionDisplayText,
  storeKey,
  updateStore,
  currentValue,
}: any) {
  return (
    <button
      onClick={() => updateStore(storeKey, optionValue)}
      className={cn(
        "py-4 px-5 rounded-xl border text-sm font-semibold transition-all text-left shadow-sm cursor-pointer",
        currentValue === optionValue
          ? "border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500 dark:border-blue-500 dark:bg-blue-900/20 dark:text-blue-100"
          : "border-slate-200 text-slate-600 dark:bg-transparent dark:border-slate-700 dark:text-slate-300 hover:bg-slate-50 hover:border-slate-300 dark:hover:border-slate-600"
      )}
    >
      {optionDisplayText}
    </button>
  );
}

function MoveInPlusFinancial({ updateStore }: MoveInPlusFinancialProps) {
  const {
    entities: { moveInTimeline, depositReadiness, paymentMethod },
  } = useExpressInterestStore();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex items-center gap-3 mb-6">
        <CalendarDays className="text-pink-500 drop-shadow-md" size={24} />
        <h3 className="font-bold text-slate-900 dark:text-white text-lg">
          Timeline & Readiness
        </h3>
      </div>

      {/* Move In Timeline */}
      <div className="space-y-4">
        <label className="block font-bold text-slate-800 dark:text-slate-100 text-base">
          1. Move-In Timeline
        </label>
        <p className="text-sm text-slate-500 dark:text-slate-400 -mt-3 mb-4">
          When exactly do you need to move in?
        </p>
        <div className="grid grid-cols-1 gap-3">
          {Object.entries(moveInOptions).map(
            ([optionValue, optionDisplayText], idx) => (
              <SelectButton
                key={optionValue + idx}
                optionValue={optionValue}
                optionDisplayText={optionDisplayText}
                storeKey="moveInTimeline"
                updateStore={updateStore}
                currentValue={moveInTimeline}
              />
            )
          )}
        </div>
      </div>

      {/* Deposit Readiness */}
      <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-app-header">
        <label className="block font-bold text-slate-800 dark:text-slate-100 text-base">
          2. Deposit Readiness
        </label>
        <p className="text-sm text-slate-500 dark:text-slate-400 -mt-3 mb-4">
          Do you have the security deposit available?
        </p>
        <div className="grid grid-cols-1 gap-3">
          {Object.entries(depositOptions).map(
            ([optionValue, optionDisplayText]) => (
              <SelectButton
                key={optionValue}
                optionValue={optionValue}
                optionDisplayText={optionDisplayText}
                storeKey="depositReadiness"
                updateStore={updateStore}
                currentValue={depositReadiness}
              />
            )
          )}
        </div>
      </div>

      {/* Payment Method */}
      <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-app-header">
        <label className="block font-bold text-slate-800 dark:text-slate-100 text-base">
          3. Payment Method
        </label>
        <p className="text-sm text-slate-500 dark:text-slate-400 -mt-3 mb-4">
          How would you pay the deposit?
        </p>
        {paymentOptions.map((opt) => {
          const isSelected = paymentMethod === opt.id;
          const Icon = opt.icon;
          return (
            <div
              key={opt.id}
              onClick={() => updateStore("paymentMethod", opt.id)}
              className={`
                    flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200
                    ${
                      isSelected
                        ? "bg-blue-50 dark:bg-blue-900/20 border-blue-500 dark:border-blue-500 shadow-sm"
                        : "bg-white dark:bg-transparent border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                    }
                  `}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${opt.iconBg}`}
              >
                <Icon className={opt.iconColor} size={24} />
              </div>
              <div className="flex-1">
                <h4
                  className={`font-semibold text-sm ${
                    isSelected
                      ? "text-blue-900 dark:text-blue-100"
                      : "text-slate-900 dark:text-white"
                  }`}
                >
                  {opt.label}
                </h4>
                <p
                  className={`text-xs ${
                    isSelected
                      ? "text-blue-600 dark:text-blue-300"
                      : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {opt.subtext}
                </p>
              </div>
              {isSelected && (
                <div className="animate-in zoom-in duration-200">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <Check size={12} className="text-white" strokeWidth={3} />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MoveInPlusFinancial;
