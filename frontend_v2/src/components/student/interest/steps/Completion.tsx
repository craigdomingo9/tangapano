import { axiosInstance } from "@/lib/api/config";
import { postInterest } from "@/lib/api/interests";
import {
  depositOptions,
  moveInOptions,
  paymentOptions,
} from "@/lib/constants/express-interest";
import { WhatsAppService } from "@/lib/services/whatsapp.service";
import {
  ExpressInterestState,
  useExpressInterestStore,
} from "@/lib/stores/expressInterestStore";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { Calendar, Check, MapPin, Pencil, Send, User } from "lucide-react";
import { useRouter } from "next/navigation";

interface CompletionProps {
  listing: Listing;
  updateStore: (key: keyof ExpressInterestState, value: any) => void;
  handleEditClick: () => void;
}

function Completion({
  listing,
  updateStore,
  handleEditClick,
}: CompletionProps) {
  const {
    entities: {
      selectedRoom,
      fullName,
      studentId,
      program,
      yearOfStudy,
      confirmed,
      whatsappNumber,
      moveInTimeline,
      depositReadiness,
      paymentMethod,
    },
  } = useExpressInterestStore();
  const mutation = useMutation({
    mutationFn: (data: Interest) => postInterest(data),
  });
  const router = useRouter();

  function handleSendInterest() {
    if (!selectedRoom) return;
    const message = WhatsAppService.templates.expressInterest({
      listing: {
        title: listing.title,
        location: listing.campus.name,
        neighborhood: listing.neighborhood.name,
        roomName: `Room ${selectedRoom?.room_number}`,
        price: `$${selectedRoom.rent_per_month}/month`,
      },
      applicant: {
        name: fullName,
        studentId: studentId,
        program: program,
        year: yearOfStudy,
      },
      timeline: {
        moveIn: moveInTimeline,
        deposit: depositReadiness,
        payment: paymentMethod,
      },
    });

    const destinationPhone = listing.campus.agent.phone_number;

    WhatsAppService.openChat({
      phone: destinationPhone,
      message: message,
    });

    // Send interest to backend
    postStudentRequest();

    // Reset store
    resetExpressInterestStore();

    // redirect to student portal
    router.push("/portal?page=home");
  }

  async function postStudentRequest() {
    await mutation.mutate({
      room: selectedRoom?.id,
      contacted_agent: listing.campus.agent.id,
      full_name: fullName,
      student_id: studentId,
      phone_number: whatsappNumber,
      year_of_study: yearOfStudy,
      program: program,
      move_in_timeline: moveInTimeline,
      deposit_readiness: depositReadiness,
      payment_method: paymentMethod,
      agree_to_terms: confirmed,
    });
  }

  function resetExpressInterestStore() {
    updateStore("selectedRoom", null);
    updateStore("confirmed", false);
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300 text-center pt-2">
      {/* Property Header */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-lg shadow-gray-200/50 dark:shadow-none relative overflow-hidden transition-colors duration-300">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-bl-full -mr-8 -mt-8 pointer-events-none" />
        <div className="relative text-left">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1 transition-colors">
            {listing.title}
          </h2>
          <div className="flex items-center gap-1.5 text-xsm text-gray-500 dark:text-gray-400 transition-colors">
            <MapPin size={14} className="text-blue-500 dark:text-blue-500" />
            <span className="text-ellipsis truncate">
              {listing.campus.name} • {listing.neighborhood.name},{" "}
              {listing.neighborhood.city}
            </span>
          </div>
        </div>
      </div>

      {/* Room Info */}
      <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-4 border border-blue-100 dark:border-blue-900/30">
        <div className="text-xs font-bold text-blue-500 dark:text-blue-400 uppercase tracking-wider mb-3">
          Selected Room
        </div>
        <div className="flex justify-between items-center">
          <p className="font-bold text-slate-900 dark:text-white text-base">
            Room {selectedRoom?.room_number || "No Room Selected"}
          </p>
          <div className="bg-white dark:bg-slate-800 border border-blue-100 dark:border-gray-700 px-3 py-1.5 rounded-lg shadow-sm transition-colors">
            <span className="text-blue-600 dark:text-blue-400 font-bold">
              ${selectedRoom?.rent_per_month}
              <span className="text-xs">/mo</span>
            </span>
          </div>
        </div>

        {/* Agent Fee Breakdown in Summary - Dark Mode Compatible */}
        <div className="flex justify-between items-center mt-3 pt-3 border-t border-blue-200/50 dark:border-blue-800/30">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            One-time Agent Fee
          </span>
          <span
            className={cn(
              "font-bold",
              listing.apply_agent_fee
                ? "text-amber-600 dark:text-amber-400"
                : "text-emerald-600 dark:text-emerald-400"
            )}
          >
            {selectedRoom?.agent_fee
              ? `$${parseInt(selectedRoom?.agent_fee).toFixed(2)}`
              : "Waived"}
          </span>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid gap-6 sm:grid-cols-1">
        {/* About You Section */}
        <div className="space-y-3">
          <h3 className="text-[0.875rem] font-semibold text-gray-900 dark:text-white flex items-center gap-2 transition-colors">
            <User size={16} className="text-blue-500 dark:text-blue-500" />
            About You
          </h3>
          <div className="bg-gray-50 dark:bg-slate-900/50 rounded-xl border border-gray-200 dark:border-gray-800 divide-y divide-gray-200 dark:divide-gray-800 transition-colors duration-300">
            <div className="grid grid-cols-3 p-3 gap-2">
              <span className="text-xsm font-medium text-gray-700 dark:text-white text-left">
                Name:
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400 col-span-2 text-right">
                {fullName}
              </span>
            </div>
            <div className="grid grid-cols-3 p-3 gap-2">
              <span className="text-xsm font-medium text-gray-700 dark:text-white text-left">
                Student ID:
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400 col-span-2 text-right">
                {studentId}
              </span>
            </div>
            <div className="grid grid-cols-3 p-3 gap-2">
              <span className="text-xsm font-medium text-gray-700 dark:text-white text-left">
                Program:
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400 col-span-2 text-right">
                {program}
              </span>
            </div>
            <div className="grid grid-cols-3 p-3 gap-2">
              <span className="text-xsm font-medium text-gray-700 dark:text-white text-left">
                Year of Study:
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400 col-span-2 text-right">
                {yearOfStudy}
              </span>
            </div>
            <div className="grid grid-cols-3 p-3 gap-2">
              <span className="text-xsm font-medium text-gray-700 dark:text-white text-left">
                WhatsApp:
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400 col-span-2 text-right">
                {whatsappNumber}
              </span>
            </div>
          </div>
        </div>

        {/* Your Timeline Section */}
        <div className="space-y-3">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2 transition-colors">
            <Calendar size={18} className="text-blue-500 dark:text-blue-500" />
            Your Timeline
          </h3>
          <div className="bg-gray-50 dark:bg-slate-900/50 rounded-xl border border-gray-200 dark:border-gray-800 divide-y divide-gray-200 dark:divide-gray-800 transition-colors duration-300">
            <div className="grid grid-cols-3 p-3 gap-2 items-start">
              <span className="text-xsm font-medium text-gray-700 dark:text-white text-left">
                Move-in:
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400 col-span-2 text-right">
                {moveInOptions[moveInTimeline] ?? moveInTimeline}
              </span>
            </div>
            <div className="grid grid-cols-3 p-3 gap-2">
              <span className="text-xsm font-medium text-gray-700 dark:text-white text-left">
                Deposit:
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400 col-span-2 text-right">
                {depositOptions[depositReadiness] ?? depositReadiness}
              </span>
            </div>
            <div className="grid grid-cols-3 p-3 gap-2">
              <span className="text-xsm font-medium text-gray-700 dark:text-white text-left">
                Payment:
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400 col-span-2 text-right">
                {paymentOptions.find((opt) => opt.id == paymentMethod)?.label ??
                  paymentMethod}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-start">
        <button
          className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm active:scale-[0.98] cursor-pointer"
          onClick={handleEditClick}
        >
          <Pencil size={14} className="text-slate-500 dark:text-slate-400" />
          Edit Details
        </button>
      </div>

      {/* What happens next? Section */}
      <div className="bg-blue-50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/20 rounded-xl p-5 text-left transition-colors duration-300">
        <h3 className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-3">
          What happens next?
        </h3>
        <ul className="space-y-2">
          <li className="flex items-start gap-3">
            <div className="mt-2 w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400 shrink-0 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
            <span className="text-xsm text-gray-600 dark:text-gray-300 leading-relaxed">
              We'll open WhatsApp with a pre-filled message
            </span>
          </li>
          <li className="flex items-start gap-3">
            <div className="mt-2 w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400 shrink-0 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
            <span className="text-xsm text-gray-600 dark:text-gray-300 leading-relaxed">
              Review and send the message to our operator
            </span>
          </li>
          <li className="flex items-start gap-3">
            <div className="mt-2 w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400 shrink-0 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
            <span className="text-xsm text-gray-600 dark:text-gray-300 leading-relaxed">
              Our operator will refer you to the landlord
            </span>
          </li>
        </ul>
      </div>

      {/* Confirmation Checkbox */}
      <div
        className="group flex items-start gap-3 p-3 -mx-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer select-none text-left"
        onClick={() => updateStore("confirmed", !confirmed)}
      >
        <div className="relative mt-0.5">
          <input
            type="checkbox"
            checked={confirmed}
            readOnly
            className="peer sr-only"
          />
          <div
            className={`
            w-5 h-5 rounded border flex items-center justify-center transition-all duration-200
            ${
              confirmed
                ? "bg-blue-600 dark:bg-blue-500 border-blue-600 dark:border-blue-500 shadow-lg shadow-blue-500/20"
                : "bg-white dark:bg-slate-950 border-gray-300 dark:border-gray-600 group-hover:border-gray-400 dark:group-hover:border-gray-500"
            }
          `}
          >
            <Check
              size={12}
              strokeWidth={3}
              className={`text-white transform transition-transform ${
                confirmed ? "scale-100" : "scale-0"
              }`}
            />
          </div>
        </div>

        <div className="flex-1 space-y-1">
          <h4
            className={`text-xsm font-medium leading-none transition-colors ${
              confirmed
                ? "text-gray-900 dark:text-white"
                : "text-gray-500 dark:text-gray-200"
            }`}
          >
            By continuing, I confirm all information is accurate
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-500 leading-relaxed group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors">
            I understand that this information will be shared with the landlord
            to process my interest in this accommodation.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 gap-3">
        <button
          onClick={handleSendInterest}
          className={`
          w-full px-6 py-3.5 rounded-xl text-sm font-medium shadow-lg flex items-center justify-center gap-2 transition-all
          ${
            confirmed
              ? "bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white shadow-blue-500/20 dark:shadow-blue-900/30 active:scale-[0.98] cursor-pointer"
              : "bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-80"
          }
        `}
        >
          <Send size={16} />
          Send Interest
        </button>
      </div>
    </div>
  );
}

export default Completion;
