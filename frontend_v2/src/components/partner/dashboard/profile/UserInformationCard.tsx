import { Button } from "@/components/ui/button";
import { AtSign, Edit, Mail } from "lucide-react";
import React from "react";
import { renderReadOnlyField } from "./ReadOnlyField";
import { ProfileInput } from "./ProfileInput";

interface UserInformationCardProps {
  editingSection: string | null;
  setEditingSection: React.Dispatch<
    React.SetStateAction<"user" | "landlord" | null>
  >;
  handleSave: () => void;
  handleCancel: () => void;
  user: User;
}

function UserInformationCard({
  editingSection,
  setEditingSection,
  handleSave,
  handleCancel,
  user,
}: UserInformationCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
          User Information
        </h3>
        {editingSection !== "user" && (
          <Button
            onClick={() => setEditingSection("user")}
            className="bg-lapis hover:bg-lapis-hover dark:bg-sky-600 dark:hover:bg-sky-500 text-white shadow-sm text-xs h-9"
          >
            <Edit className="w-3 h-3 mr-0" />
            Edit User Info
          </Button>
        )}
      </div>

      <div className="p-6">
        {editingSection === "user" ? (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProfileInput label="First Name" field="first_name" />
              <ProfileInput label="Last Name" field="last_name" />

              <div className="md:col-span-2">
                <ProfileInput
                  label="Username"
                  field="username"
                  icon={<AtSign className="w-4 h-4" />}
                />
              </div>
            </div>

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
              {renderReadOnlyField("First Name", user.first_name)}
              {renderReadOnlyField("Last Name", user.last_name)}

              <div className="md:col-span-2">
                {renderReadOnlyField("Username", `@${user.username}`)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserInformationCard;
