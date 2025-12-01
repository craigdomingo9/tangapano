import { useRouterPush } from "@/hooks/use-router-push";
import { RouteProps } from "@/routing/types";
import { ErrorPage } from "../overview/ErrorPage";
import { FullScreenView } from "@/components/ui/FullScreenView";
import { useEffect, useState } from "react";
import createEntityStore from "@/lib/stores/entityStore";
import { cn } from "@/lib/utils";
import UserInformationCard from "../profile/UserInformationCard";
import LandlordCardInformation from "../profile/LandlordCardInformation";
import useUserActions from "@/hooks/use-user-actions";
import LoadingScreen from "@/components/student/interest/states/LoadingScreen";

export interface ProfileFormState {
  first_name: string;
  last_name: string;
  username: string;
  phone_number: string;
  address: string;
  company_name: string;
}
export const useProfileFormData = createEntityStore<ProfileFormState>(
  {} as ProfileFormState
);

function ProfileManagement({ serverData }: RouteProps) {
  const { push } = useRouterPush();
  const { accessToken } = serverData;
  const [editingSection, setEditingSection] = useState<
    "user" | "landlord" | null
  >(null);
  const { entities: formData, setEntities: setFormData } = useProfileFormData();

  const { getMe, updateUser } = useUserActions(accessToken);
  const { data: user, isLoading } = getMe;

  useEffect(() => {
    if (!user) return;
    setFormData({
      ...user,
      phone_number: user.landlord_profile.phone_number || "",
      address: user.landlord_profile.address || "",
      company_name: user.landlord_profile.company_name || "",
    });
  }, [user]);

  const handleChange = (field: keyof User, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = () => {
    console.log("save", formData);
    if (editingSection === "user") {
      // Update User Profile
      const payload = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        username: formData.username,
      };
      console.log("Payload", payload);
      updateUser.mutate(payload);
    }
    if (editingSection === "landlord") {
      // Update Landlord Profile
      const payload = {
        ...user,
        landlord_profile: {
          phone_number: formData.phone_number,
          address: formData.address,
          company_name: formData.company_name,
        },
      } as Partial<User>;
      updateUser.mutate(payload);
      console.log("Payload", payload);
    }
    setEditingSection(null);
  };

  const handleCancel = () => {
    setEditingSection(null);
  };

  // Guards
  if (!accessToken) return <ErrorPage type="access" />;
  if (!user && !isLoading) return <ErrorPage type="404" />;
  if (isLoading) return <LoadingScreen />;

  return (
    <FullScreenView
      title="My Profile"
      onBack={() => push({ page: "overview" })}
    >
      <div className={cn("w-full max-w-4xl mx-auto space-y-8 py-2")}>
        {/* Header */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Profile
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xsm">
            Manage your personal and landlord account details.
          </p>
        </div>

        {/* User Information Card */}
        <UserInformationCard
          editingSection={editingSection}
          setEditingSection={setEditingSection}
          handleSave={handleSave}
          handleCancel={handleCancel}
          user={user!!}
        />

        {/* Landlord Information Card */}
        <LandlordCardInformation
          editingSection={editingSection}
          setEditingSection={setEditingSection}
          handleSave={handleSave}
          handleCancel={handleCancel}
          landlord={user?.landlord_profile}
        />
      </div>
    </FullScreenView>
  );
}

export default ProfileManagement;
