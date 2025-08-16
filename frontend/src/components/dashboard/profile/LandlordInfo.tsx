import { useAuth } from "@/app/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLandlordDialogState } from "@/lib/hooks/store";
import { Edit, MapPin, Phone } from "lucide-react";

function LandlordInfo() {
  const { user } = useAuth();
  const { setEntities: setDialog } = useLandlordDialogState();

  const landlordProfile = user?.landlord_profile;

  if (!landlordProfile) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="flex justify-between">
        <CardTitle className="my-auto">Landlord Information</CardTitle>
        <Button
          className="rounded-sm h-10 shadow-md bg-blue-500"
          onClick={() => setDialog(true)}
        >
          <Edit size={20} /> Edit Landlord Info
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Name:
            </label>
            <p className="text-sm text-gray-900 font-semibold">
              {landlordProfile?.company_name}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number:
            </label>
            <p className="text-sm text-gray-900 flex items-center gap-2">
              <Phone size={20} className="text-green-600" />{" "}
              {landlordProfile?.phone_number}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address:
            </label>
            <p className="text-sm text-gray-900 flex items-start gap-2">
              <MapPin size={20} className="text-indigo-500 flex-shrink-0" />{" "}
              {landlordProfile?.address}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default LandlordInfo;
