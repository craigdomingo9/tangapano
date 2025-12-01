import { Button } from "@/components/ui/button";
import { Building, Edit, MapPin, Phone } from "lucide-react";
import React from "react";
import { ProfileInput } from "./ProfileInput"; // Import the component
import { renderReadOnlyField } from "./ReadOnlyField";

interface LandlordCardInformationProps {
  editingSection: string | null;
  setEditingSection: React.Dispatch<
    React.SetStateAction<"user" | "landlord" | null>
  >;
  handleSave: () => void;
  handleCancel: () => void;
  landlord: any; // Ideally type this with your Landlord interface
}

function LandlordCardInformation({
  editingSection,
  setEditingSection,
  handleSave,
  handleCancel,
  landlord,
}: LandlordCardInformationProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
          Landlord Information
        </h3>
        {editingSection !== "landlord" && (
          <Button
            onClick={() => setEditingSection("landlord")}
            className="bg-lapis hover:bg-lapis-hover dark:bg-sky-600 dark:hover:bg-sky-500 text-white shadow-sm text-xs h-9"
          >
            <Edit className="w-3 h-3 mr-0" />
            Edit Landlord Info
          </Button>
        )}
      </div>

      <div className="p-6">
        {editingSection === "landlord" ? (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* FIX: Use Component Syntax to prevent Hook errors */}
            <ProfileInput
              label="Company Name"
              field="company_name"
              icon={<Building className="w-4 h-4" />}
            />

            <ProfileInput
              label="Phone Number"
              field="phone_number"
              icon={<Phone className="w-4 h-4" />}
              type="tel"
            />

            <ProfileInput
              label="Address"
              field="address"
              icon={<MapPin className="w-4 h-4" />}
            />

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="ghost"
                onClick={handleCancel}
                className="dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="bg-lapis hover:bg-lapis-hover dark:bg-sky-600 dark:hover:bg-sky-500 text-white"
              >
                Save Changes
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* renderReadOnlyField is safe because it has no hooks */}
            {renderReadOnlyField(
              "Company Name",
              landlord.company_name || landlord.companyName,
              <Building className="w-4 h-4" />
            )}
            {renderReadOnlyField(
              "Phone Number",
              landlord.phone_number || landlord.phoneNumber,
              <Phone className="w-4 h-4" />
            )}
            {renderReadOnlyField(
              "Address",
              landlord.address,
              <MapPin className="w-4 h-4" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default LandlordCardInformation;
