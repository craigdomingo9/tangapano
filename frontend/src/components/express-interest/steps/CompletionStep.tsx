import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSelectedListingByStudent } from "@/lib/hooks/store";
import { FormData } from "@/lib/types/express-interest";

interface CompletionStepProps {
  formData: FormData;
  listingName: string;
  selectedRoom: Room | null;
  onComplete: () => void;
  onBack: () => void;
}

export const CompletionStep: React.FC<CompletionStepProps> = ({
  formData,
  listingName,
  selectedRoom,
  onComplete,
  onBack,
}) => {
  const { entities: selectedListing } = useSelectedListingByStudent();

  const formatTimeline = (timeline: string) => {
    const map: Record<string, string> = {
      immediately: "Immediately (Within 1 week)",
      "2_weeks": "Within 2 weeks",
      "1_month": "Within 1 month",
      next_semester: "Next Semester",
    };
    return map[timeline] || timeline;
  };

  const formatDeposit = (deposit: string) => {
    const map: Record<string, string> = {
      ready_now: "Yes, ready now",
      within_24h: "Will arrange within 24 hours",
      need_time: "Need time to get funds",
    };
    return map[deposit] || deposit;
  };

  const formatPayment = (payment: string) => {
    const map: Record<string, string> = {
      cash: "Cash",
      mobile: "Mobile Payment",
      bank_transfer: "Bank Transfer",
    };
    return map[payment] || payment;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">✅</span>
        </div>
        <h3 className="text-lg font-semibold text-green-700">
          Ready to Connect!
        </h3>
        <p className="text-gray-600 mt-2">
          Review your details before sending to the landlord
        </p>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-6">
          {/* Property & Room Info */}
          <div className="border-b pb-4">
            <h4 className="font-semibold text-lg">{listingName}</h4>
            <p className="text-gray-600">
              {selectedListing.campus?.name} •{" "}
              {selectedListing.neighborhood?.name}
            </p>
            {selectedRoom && (
              <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                <p className="font-medium text-blue-900">
                  Room {selectedRoom.room_number}
                </p>
                <p className="text-blue-700">
                  ${parseFloat(selectedRoom.rent_per_month).toFixed(2)}/month
                </p>
              </div>
            )}
          </div>

          {/* Student Details */}
          <div className="space-y-4">
            <div>
              <h5 className="font-medium mb-2">👤 About You</h5>
              <div className="space-y-1 text-sm">
                <div>
                  <strong>Name:</strong> {formData.fullName}
                </div>
                <div>
                  <strong>Student ID:</strong> {formData.studentId}
                </div>
                <div>
                  <strong>Program:</strong> {formData.program} - Year{" "}
                  {formData.yearOfStudy}
                </div>
                <div>
                  <strong>WhatsApp:</strong> {formData.whatsappNumber}
                </div>
              </div>
            </div>

            <div>
              <h5 className="font-medium mb-2">📅 Your Timeline</h5>
              <div className="space-y-1 text-sm">
                <div>
                  <strong>Move-in:</strong>{" "}
                  {formatTimeline(formData.moveInTimeline)}
                </div>
                <div>
                  <strong>Deposit:</strong>{" "}
                  {formatDeposit(formData.depositReadiness)}
                </div>
                <div>
                  <strong>Payment:</strong>{" "}
                  {formatPayment(formData.paymentMethod)}
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps Info */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h6 className="font-medium text-blue-900 mb-2">
              What happens next?
            </h6>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• We'll open WhatsApp with a pre-filled message</li>
              <li>• Review and send the message to our operator</li>
              <li>• Our operator will refer you to the landlord</li>
              <li>• Remember: You pay ZERO agent fees through TangaPano</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between pt-4 w-full">
        <Button variant="outline" onClick={onBack} className="h-12 min-w-1/3">
          Edit Details
        </Button>
        <Button
          onClick={onComplete}
          className="bg-green-600 hover:bg-green-700 min-w-1/3 h-12"
        >
          Open WhatsApp
        </Button>
      </div>
    </div>
  );
};
