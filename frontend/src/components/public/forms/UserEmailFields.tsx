import { axiosInstance } from "@/lib/services/api/config";
import { Input } from "../../ui/input";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { UseFormReturn, useWatch } from "react-hook-form";
import createEntityStore from "@/lib/store/entityStore";
import InputField from "./InputField";

type Props = {
  form: UseFormReturn<any, any, any>;
};

export const useUserExists = createEntityStore<boolean>(false);

function UserEmailFields({ form }: Props) {
  const username = useWatch({ control: form.control, name: "username" });
  const email = useWatch({ control: form.control, name: "email" });

  const debouncedUsername = useDebounce(username, 500);
  const debouncedEmail = useDebounce(email, 500);

  const { entities: userExists, setEntities: setUserExists } = useUserExists();

  const { data: response, status } = useQuery({
    queryKey: ["username_lookup", debouncedUsername, debouncedEmail],
    queryFn: () =>
      axiosInstance.get(
        `/users/lookup?username=${debouncedUsername}&email=${debouncedEmail}`
      ),
    enabled: !!debouncedUsername || !!debouncedEmail, // Only run query when there's something to search
  });

  useEffect(() => {
    if (!response) return;
    setUserExists(response.data.exists);
  }, [debouncedUsername, debouncedEmail, response, status]);

  return (
    <div className="space-y-4">
      <div>
        <InputField
          title="Email"
          form={form}
          fieldName="email"
          placeholder="arnoldmukwati03@example.com"
        />
        {userExists && response?.data.field === "email" && (
          <p className="text-destructive text-xs mt-2">
            {response.data.message}
          </p>
        )}
      </div>
      <div>
        <InputField
          title="Username"
          form={form}
          fieldName="username"
          placeholder="arnoldmukwati"
        />
        {userExists && response?.data.field === "username" && (
          <p className="text-destructive text-xs mt-2">
            {response.data.message}
          </p>
        )}
      </div>
    </div>
  );
}

export default UserEmailFields;
