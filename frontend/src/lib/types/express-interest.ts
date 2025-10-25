/**
 * Express Interest Form Types and Interfaces
 * Centralized type definitions for the multi-step interest form
 */

export interface InterestModel {
  room: any;
  contacted_agent: string;
  full_name: string;
  student_id: string;
  phone_number: string;
  year_of_study: string;
  program: string;
  move_in_timeline: "immediately" | "2_weeks" | "1_month" | "next_semester";
  deposit_readiness: "ready_now" | "within_24h" | "need_time";
  payment_method: "cash" | "mobile" | "bank_transfer";
  agree_to_terms: boolean;
}

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

export type MoveInTimeline = InterestModel["move_in_timeline"];
export type DepositReadiness = InterestModel["deposit_readiness"];
export type PaymentMethod = InterestModel["payment_method"];
export type YearOfStudy = InterestModel["year_of_study"];

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
