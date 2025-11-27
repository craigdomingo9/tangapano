"use client";
import {
  ExpressInterestState,
  useExpressInterestStore,
} from "@/lib/stores/expressInterestStore";
import { useEffect, useRef, useState } from "react";
import ProgressSection from "./ProgressSection";
import RoomSelection from "./steps/RoomSelection";
import MoveInPlusFinancial from "./steps/MoveInPlusFinancial";
import IdentityVerification from "./steps/IdentityVerification";
import AcademicInformation from "./steps/AcademicInformation";
import Completion from "./steps/Completion";
import FooterActions from "./FooterActions";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const STEPS = [
  { id: 1, title: "Room Selection" },
  { id: 2, title: "Move-in & Financial" },
  { id: 3, title: "Identity Verification" },
  { id: 4, title: "Academic Information" },
  { id: 5, title: "Completion" },
];

interface StepsOrchestratorProps {
  listing: Listing;
}

function StepsOrchestrator({ listing }: StepsOrchestratorProps) {
  const router = useRouter();
  const params = useSearchParams();
  const { entities, setEntities } = useExpressInterestStore();
  const pathname = usePathname();
  const topRef = useRef<HTMLDivElement>(null);

  /**
   * 1. DERIVE STATE directly from the URL.
   * 2. GENERIC NAVIGATOR
   * 3. HANDLERS
   */

  const currentStep = parseInt(params.get("step") ?? "1", 10);

  const navigateToStep = (newStep: number) => {
    // Clone current params so we don't lose 'listing' or 'expressInterest'
    const newParams = new URLSearchParams(params.toString());

    // Set the new values
    newParams.set("step", String(newStep));
    newParams.set("expressInterest", "true"); // Ensure this persists
    if (listing.id) newParams.set("listing", listing.id); // Ensure this persists

    // Push the new URL
    router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
  };

  // 2. SCROLL LOGIC
  useEffect(() => {
    // Only scroll if we are not on the very first render of step 1
    // (Optional: remove the 'currentStep > 1' check if you want it to always snap top)
    if (currentStep > 1) {
      // scrollIntoView works regardless of which container is scrollable (body vs div)
      topRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start", // Aligns the top of the element with the top of the viewport
      });
    }
  }, [currentStep]);

  /**
   * 3. HANDLERS
   */
  const nextStep = () => {
    const next = Math.min(currentStep + 1, STEPS.length);
    navigateToStep(next);
  };

  const prevStep = () => {
    const prev = Math.max(currentStep - 1, 1);
    navigateToStep(prev);
  };

  const getStepProgress = () => ((currentStep - 1) / (STEPS.length - 1)) * 100;

  function updateStore(
    key: keyof ExpressInterestState,
    value: string | Room | number | null
  ) {
    setEntities({ ...entities, [key]: value });
  }

  function handleEditClick() {
    navigateToStep(1);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <ProgressSection
        currentStep={currentStep}
        getStepProgress={getStepProgress}
        STEPS={STEPS}
      />
      <div ref={topRef} className="scroll-mt-24" />
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-0 shadow-sm rounded-xl overflow-hidden">
        <div className="p-4">
          {currentStep === 1 && (
            <RoomSelection listing={listing} updateStore={updateStore} />
          )}

          {currentStep === 2 && (
            <MoveInPlusFinancial updateStore={updateStore} />
          )}

          {currentStep === 3 && (
            <IdentityVerification updateStore={updateStore} />
          )}

          {currentStep === 4 && (
            <AcademicInformation updateStore={updateStore} />
          )}

          {currentStep === 5 && (
            <Completion
              listing={listing}
              updateStore={updateStore}
              handleEditClick={handleEditClick}
            />
          )}
        </div>
        <FooterActions
          currentStep={currentStep}
          nextStep={nextStep}
          prevStep={prevStep}
          setCurrentStep={navigateToStep}
        />
      </div>
    </div>
  );
}

export default StepsOrchestrator;
