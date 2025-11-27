import { Banknote, Landmark, Smartphone } from "lucide-react";

export const moveInOptions = {
  immediately: "Immediately (Within 1 week)",
  "2_weeks": "Within 2 weeks",
  "1_month": "Within 1 month",
  next_semester: "Next Semester",
};

export const depositOptions = {
  ready_now: "Yes, ready now",
  within_24h: "Will arrange within 24 hours",
  need_time: "Need time to get funds",
};

export const paymentOptions = [
  {
    id: "cash",
    label: "Cash",
    subtext: "Physical cash payment",
    icon: Banknote,
    iconColor: "text-green-500",
    iconBg: "bg-green-100 dark:bg-green-900/30",
  },
  {
    id: "mobile",
    label: "Mobile Payment",
    subtext: "Ecocash, OneMoney, etc.",
    icon: Smartphone,
    iconColor: "text-purple-500",
    iconBg: "bg-purple-100 dark:bg-purple-900/30",
  },
  {
    id: "bank",
    label: "Bank Transfer",
    subtext: "Direct bank transfer",
    icon: Landmark,
    iconColor: "text-slate-500 dark:text-slate-400",
    iconBg: "bg-slate-100 dark:bg-slate-700/50",
  },
];
