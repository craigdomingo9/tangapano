/**
 * Custom Hook for Express Interest Form State Management
 */

import { useState, useCallback } from "react";
import { FormData } from "../types/express-interest";
import { StorageService } from "../services/storageService";

const INITIAL_FORM_DATA: FormData = {
  selectedRoomId: null,
  moveInTimeline: "immediately",
  depositReadiness: "ready_now",
  paymentMethod: "cash",
  fullName: "",
  studentId: "",
  whatsappNumber: "",
  program: "",
  yearOfStudy: "1",
  agreeToTerms: false,
};

/**
 * Custom Hook for Express Interest Form State Management and Data Persistence
 *  @returns Form state and handlers
 */

export const useExpressInterestForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(() => {
    const savedData = StorageService.getFormData();
    return savedData
      ? { ...INITIAL_FORM_DATA, ...savedData }
      : INITIAL_FORM_DATA;
  });

  const updateFormData = useCallback((updates: Partial<FormData>) => {
    setFormData((prev) => {
      const newData = { ...prev, ...updates };
      StorageService.saveFormData(newData);
      return newData;
    });
  }, []);

  const resetForm = useCallback(() => {
    const savedData = StorageService.getFormData(); // Retain saved data for persistence
    StorageService.setItem(StorageService.STORAGE_KEYS.INTEREST_FORM, {
      ...savedData,
      selectedRoomId: INITIAL_FORM_DATA.selectedRoomId,
      moveInTimeline: INITIAL_FORM_DATA.moveInTimeline,
      depositReadiness: INITIAL_FORM_DATA.depositReadiness,
      paymentMethod: INITIAL_FORM_DATA.paymentMethod,
      agreeToTerms: INITIAL_FORM_DATA.agreeToTerms,
    });
    setCurrentStep(1);
  }, []);

  const goToNextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, 5)); // Now 5 steps total
  }, []);

  const goToPreviousStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }, []);

  return {
    currentStep,
    formData,
    updateFormData,
    resetForm,
    goToNextStep,
    goToPreviousStep,
    setCurrentStep,
  };
};
