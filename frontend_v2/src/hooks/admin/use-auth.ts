import { changeAdminPasswordFn } from "@/lib/api/admin/auth";
import { errorToast, successToast } from "@/lib/toast";
import { useMutation } from "@tanstack/react-query";
import React from "react";

function useAuthAdmin(accessToken: string) {
  const { isPending: isChangingPassword, mutate: changePassword } = useMutation(
    {
      mutationFn: (data: { username: string; new_password: string }) =>
        changeAdminPasswordFn(accessToken, data.username, data.new_password),
      onSuccess(data, variables, onMutateResult, context) {
        successToast("Password changed successfully.");
      },
      onError(error, variables, onMutateResult, context) {
        // Handle error appropriately
        console.log(error);
        errorToast("Failed to change password. Please try again.");
      },
    },
  );
  return { isChangingPassword, changePassword };
}

export default useAuthAdmin;
