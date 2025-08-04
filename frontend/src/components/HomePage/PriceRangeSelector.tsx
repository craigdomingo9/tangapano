"use client";

import { useState, useEffect, useRef } from "react";
import { UseFormReturn } from "react-hook-form";
import { Input } from "../ui/input";
import { FormLabel } from "../ui/form";

type Props = {
  form: UseFormReturn<any, any, any>;
};

export default function PriceRangeSelector({ form }: Props) {
  const min = 40;
  const max = 200;
  const [minValue, setMinValue] = useState(min);
  const [maxValue, setMaxValue] = useState(max);

  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const range = max - min;
    const left = ((minValue - min) / range) * 100;
    const right = ((maxValue - min) / range) * 100;
    if (progressRef.current) {
      progressRef.current.style.left = `${left}%`;
      progressRef.current.style.width = `${right - left}%`;
    }
    // console.log("Min Value:", minValue, "Max Value:", maxValue);
    form.setValue("price_min", minValue);
    form.setValue("price_max", maxValue);
  }, [minValue, maxValue, min, max, form]);

  return (
    <div className="space-y-4 shadow-2xl p-3 rounded-md">
      <div>
        <FormLabel className="font-semibold">Price Range</FormLabel>
      </div>

      <div className="flex w-full">
        <div>
          <FormLabel className="font-semibold mx-2 justify-center w-6">
            ${minValue}
          </FormLabel>
        </div>

        <div className="relative h-5 w-[200px] mt-[-5px]">
          {/* Range background */}
          <div className="absolute top-1/2 h-[4px] rounded-sm w-full bg-stone-400 -translate-y-1/2 z-0" />

          {/* Selected range highlight */}
          <div
            ref={progressRef}
            className="absolute top-1/2 h-[4px] pr-0 mr-0 bg-[var(--lapis-lazuli)] -translate-y-1/2 z-0"
          />

          {/* Min range */}
          <Input
            className="absolute border-0 pl-0 pr-0 w-[200px] h-[30px] appearance-none bg-none z-10
              pointer-events-none
              [&::-webkit-slider-thumb]:pointer-events-auto
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:h-[20px]
              [&::-webkit-slider-thumb]:w-[20px]
              [&::-webkit-slider-thumb]:mt-[-7px]
              [&::-webkit-slider-thumb]:bg-white
              [&::-webkit-slider-thumb]:border
              [&::-webkit-slider-thumb]:border-gray-600
              [&::-webkit-slider-thumb]:rounded-sm
              [&::-webkit-slider-thumb]:cursor-pointer
              hover:[&::-webkit-slider-thumb]:bg-blue-100
              hover:[&::-webkit-slider-thumb]:border-blue-500"
            type="range"
            step={10}
            min={min}
            max={max}
            value={minValue}
            onChange={(e) =>
              setMinValue(Math.min(Number(e.target.value), maxValue - 10))
            }
          />

          {/* Max range */}
          <Input
            className="absolute border-0 pl-0 pr-0 w-[200px] h-[30px] appearance-none bg-none z-10
              pointer-events-none
              [&::-webkit-slider-thumb]:pointer-events-auto
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:h-[20px]
              [&::-webkit-slider-thumb]:w-[20px]
              [&::-webkit-slider-thumb]:mt-[-7px]
              [&::-webkit-slider-thumb]:bg-white
              [&::-webkit-slider-thumb]:border
              [&::-webkit-slider-thumb]:border-gray-600
              [&::-webkit-slider-thumb]:rounded-sm
              [&::-webkit-slider-thumb]:cursor-pointer
              hover:[&::-webkit-slider-thumb]:bg-blue-100
              hover:[&::-webkit-slider-thumb]:border-blue-500"
            type="range"
            step={10}
            min={min}
            max={max}
            value={maxValue}
            onChange={(e) =>
              setMaxValue(Math.max(Number(e.target.value), minValue + 10))
            }
          />
        </div>

        <div>
          <FormLabel className="font-semibold mx-2 w-6">${maxValue}</FormLabel>
        </div>
      </div>
    </div>
  );
}
