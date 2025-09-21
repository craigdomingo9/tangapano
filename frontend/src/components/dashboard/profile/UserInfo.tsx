import { useAuth } from "@/app/context/AuthContext";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserDialogState } from "@/lib/hooks/store";
import { AtSign, Edit, Mail } from "lucide-react";
import { MoonLoader } from "react-spinners";

function UserInfo() {
  const { user, loading } = useAuth();
  const { setEntities: setDialog } = useUserDialogState();

  if (loading) {
    return (
      <div className="flex justify-center">
        <Loader />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="flex justify-between">
        <CardTitle className="my-auto">User Information</CardTitle>
        <Button
          className="rounded-sm h-10 shadow-md bg-[var(--lapis-lazuli)]"
          onClick={() => setDialog(true)}
        >
          <Edit size={20} /> Edit User Info
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name:
            </label>
            <p className="text-sm text-gray-900 font-semibold">
              {user?.first_name}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name:
            </label>
            <p className="text-sm text-gray-900 font-semibold">
              {user?.last_name}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email:
            </label>
            <p className="text-sm text-gray-900 flex items-center gap-2">
              <Mail size={20} className="text-red-600" /> {user?.email}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username:
            </label>
            <p className="text-sm text-gray-900 flex items-center gap-2">
              <AtSign size={20} className="text-gray-600" /> {user?.username}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default UserInfo;
