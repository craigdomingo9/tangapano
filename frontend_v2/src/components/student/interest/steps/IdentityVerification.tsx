import {
  ExpressInterestState,
  useExpressInterestStore,
} from "@/lib/stores/expressInterestStore";
import { Check, AlertCircle, ClipboardList } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { validation } from "@/lib/student-utils/validation";

interface IdentityVerificationProps {
  updateStore: (key: keyof ExpressInterestState, value: any) => void;
}

function IdentityVerification({ updateStore }: IdentityVerificationProps) {
  const {
    entities: { whatsappNumber, fullName, studentId },
  } = useExpressInterestStore();

  const [errors, setErrors] = useState<{
    whatsappNumber?: string;
    studentId?: string;
    fullName?: string;
  }>({});

  const [touched, setTouched] = useState<{
    whatsappNumber: boolean;
    studentId: boolean;
    fullName: boolean;
  }>({
    whatsappNumber: false,
    studentId: false,
    fullName: false,
  });

  const handleWhatsAppChange = (value: string) => {
    const formatted = validation.whatsappNumber.format(value);
    updateStore("whatsappNumber", formatted);

    // Clear error while typing
    if (errors.whatsappNumber) {
      setErrors({ ...errors, whatsappNumber: undefined });
    }
  };

  const handleWhatsAppBlur = () => {
    setTouched({ ...touched, whatsappNumber: true });
    const result = validation.whatsappNumber.validate(whatsappNumber);
    if (!result.isValid) {
      setErrors({ ...errors, whatsappNumber: result.error });
    }
  };

  const handleStudentIdChange = (value: string) => {
    const formatted = validation.studentId.format(value);
    updateStore("studentId", formatted);

    // Clear error while typing
    if (errors.studentId) {
      setErrors({ ...errors, studentId: undefined });
    }
  };

  const handleStudentIdBlur = () => {
    setTouched({ ...touched, studentId: true });
    const result = validation.studentId.validate(studentId);
    if (!result.isValid) {
      setErrors({ ...errors, studentId: result.error });
    }
  };

  const handleFullNameBlur = () => {
    setTouched({ ...touched, fullName: true });
    if (!fullName || fullName.trim().length < 2) {
      setErrors({ ...errors, fullName: "Please enter your full name" });
    } else {
      setErrors({ ...errors, fullName: undefined });
    }
  };

  const handleFullNameChange = (value: string) => {
    updateStore("fullName", value);
    if (errors.fullName) {
      setErrors({ ...errors, fullName: undefined });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
          <ClipboardList
            className="text-orange-500 dark:text-orange-400"
            size={24}
          />
        </div>
        <h3 className="font-bold text-slate-900 dark:text-white text-lg">
          Let's Get You Verified
        </h3>
      </div>

      <div className="space-y-6">
        {/* Full Name */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
            4. Full Legal Name
          </label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={(e) => handleFullNameChange(e.target.value)}
            onBlur={handleFullNameBlur}
            placeholder="e.g. Craig K"
            className={cn(
              "w-full px-4 mt-2 py-3.5 text-sm rounded-lg border dark:border-slate-700 dark:bg-app-input dark:text-white dark:focus:ring-blue-400 focus:ring-1 outline-none text-slate-900 placeholder:text-slate-400 bg-slate-50/30 transition-colors",
              errors.fullName && touched.fullName
                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                : "border-slate-300 focus:border-lapis focus:ring-lapis"
            )}
          />
          {errors.fullName && touched.fullName && (
            <p className="text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.fullName}
            </p>
          )}
        </div>

        {/* Student ID */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
            5. Student ID Number
          </label>
          <input
            type="text"
            id="studentId"
            value={studentId}
            onChange={(e) => handleStudentIdChange(e.target.value)}
            onBlur={handleStudentIdBlur}
            placeholder="e.g. R247636N"
            maxLength={8}
            className={cn(
              "w-full px-4 mt-2 py-3.5 text-sm rounded-lg border dark:border-slate-700 dark:bg-app-input dark:text-white dark:focus:ring-blue-400 focus:ring-1 outline-none text-slate-900 placeholder:text-slate-400 bg-slate-50/30 transition-colors uppercase",
              errors.studentId && touched.studentId
                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                : "border-slate-300 focus:border-lapis focus:ring-lapis"
            )}
          />
          {errors.studentId && touched.studentId ? (
            <p className="text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.studentId}
            </p>
          ) : (
            <p className="text-xs text-slate-500">
              Format: R######X (e.g., R247636N)
            </p>
          )}
        </div>

        {/* WhatsApp Number */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
            6. WhatsApp Number
          </label>
          <input
            type="tel"
            id="whatsappNumber"
            value={whatsappNumber}
            onChange={(e) => handleWhatsAppChange(e.target.value)}
            onBlur={handleWhatsAppBlur}
            placeholder="e.g. +263776808964"
            className={cn(
              "w-full px-4 mt-2 py-3.5 text-sm rounded-lg border dark:border-slate-700 dark:bg-app-input dark:text-white dark:focus:ring-blue-400 focus:ring-1 outline-none text-slate-900 placeholder:text-slate-400 bg-slate-50/30 transition-colors",
              errors.whatsappNumber && touched.whatsappNumber
                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                : "border-slate-300 focus:border-lapis focus:ring-lapis"
            )}
          />
          {errors.whatsappNumber && touched.whatsappNumber ? (
            <p className="text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.whatsappNumber}
            </p>
          ) : (
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Check className="w-3 h-3 text-emerald-500" />
              We'll use this for important updates and viewings
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default IdentityVerification;
