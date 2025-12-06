import createEntityStore from "./entityStore";

export interface ExpressInterestState {
  selectedRoom: Room | null;
  moveInTimeline: "immediately" | "2_weeks" | "1_month" | "next_semester";
  depositReadiness: "ready_now" | "within_24h" | "need_time";
  paymentMethod: "cash" | "mobile" | "bank_transfer";
  fullName: string;
  studentId: string;
  whatsappNumber: string;
  program: string;
  yearOfStudy: "1st Year" | "2nd Year" | "3rd Year" | "4th Year+";
  confirmed: boolean;
}

const ExpressInterestInitialState: ExpressInterestState = {
  selectedRoom: null,
  moveInTimeline: "immediately",
  depositReadiness: "ready_now",
  paymentMethod: "mobile",
  fullName: "",
  studentId: "",
  whatsappNumber: "",
  program: "",
  yearOfStudy: "1st Year",
  confirmed: false,
};

export const useExpressInterestStore = createEntityStore<ExpressInterestState>(
  ExpressInterestInitialState,
  {
    name: "express-interest",
  }
);
