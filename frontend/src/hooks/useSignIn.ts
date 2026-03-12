import { useCallback } from "react";

import { useSignInMutation } from "@/graphql/generated/graphql";
import { setStoredJson, setStoredString } from "@/lib/storage";

type ProfileData = {
  name: string;
  email: string;
  phone: string;
};

export function useSignIn() {
  const [mutate, state] = useSignInMutation();

  const signIn = useCallback(
    async ({ username, password }: { username: string; password: string }) => {
      const res = await mutate({
        variables: {
          username: username.trim(),
          password,
        },
      });

      const payload = res.data?.signIn;
      const token = payload?.token;
      const user = payload?.user;

      if (!token || !user) {
        throw new Error("Sign in failed");
      }

      await setStoredString("authToken", token);

      const profileData: ProfileData = {
        name: typeof user.name === "string" && user.name.trim() ? user.name : "John Doe",
        email: typeof user.email === "string" && user.email.trim() ? user.email : "",
        phone: typeof user.phone === "string" && user.phone.trim() ? user.phone : "",
      };
      await setStoredJson("profileData", profileData);

      return {
        token,
        user,
        profileData,
      };
    },
    [mutate]
  );

  return {
    signIn,
    ...state,
  };
}
