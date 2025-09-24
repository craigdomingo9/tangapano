import { axiosInstance } from "@/lib/services/api/config";
import { Input } from "../ui/input";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { UseFormReturn, useWatch } from "react-hook-form";
import createEntityStore from "@/lib/store/entityStore";

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
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <Input
          type="email"
          id="email"
          {...form.register("email")}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="you@example.com"
        />
        {form.formState.errors.email && (
          <p className="mt-1 text-sm text-red-600">
            {form.formState.errors.email.message as string}
          </p>
        )}
        {userExists && response?.data.field === "email" && (
          <p className="mt-1 text-sm text-red-600">{response.data.message}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-700"
        >
          Username
        </label>
        <Input
          type="text"
          id="username"
          {...form.register("username")}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="tinashedivi"
        />
        {form.formState.errors.username && (
          <p className="mt-1 text-sm text-red-600">
            {form.formState.errors.username.message as string}
          </p>
        )}
        {userExists && response?.data.field === "username" && (
          <p className="mt-1 text-sm text-red-600">{response.data.message}</p>
        )}
      </div>
    </div>
  );
}

export default UserEmailFields;
