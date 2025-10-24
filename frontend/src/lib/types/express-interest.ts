/**
 * Express Interest Form Types and Interfaces
 * Centralized type definitions for the multi-step interest form
 */

export interface FormData {
  // Step 1: Room Selection
  selectedRoomId: string | null;

  // Step 2: Move-in & Financial
  moveInTimeline: MoveInTimeline;
  depositReadiness: DepositReadiness;
  paymentMethod: PaymentMethod;

  // Step 3: Identity Verification
  fullName: string;
  studentId: string;
  whatsappNumber: string;

  // Step 4: Academic Information
  program: string;
  yearOfStudy: YearOfStudy;
  agreeToTerms: boolean;
}

export type MoveInTimeline =
  | "immediately"
  | "2_weeks"
  | "1_month"
  | "next_semester"
  | "";
export type DepositReadiness = "ready_now" | "within_24h" | "need_time" | "";
export type PaymentMethod = "cash" | "mobile" | "bank_transfer" | "";
export type YearOfStudy = "1" | "2" | "3" | "4+" | "";

export interface StepProps {
  formData: FormData;
  onUpdate: (updates: Partial<FormData>) => void;
  onNext: () => void;
  onBack?: () => void;
  onComplete?: () => void;
}

export interface StepConfig {
  id: number;
  name: string;
  component: React.ComponentType<StepProps>;
  validation?: (formData: FormData) => boolean;
}

export interface WhatsAppMessageData {
  formData: FormData;
  listingName: string;
  selectedRoom: Room | null;
  selectedListing: any;
}
