import { useCallback } from "react";

import { useSignInMutation } from "@/graphql/generated/graphql";
import { useAuthSession } from "@/stores/useAuthSession";

type ProfileData = {
  name: string;
  email: string;
  phone: string;
  photoUri: string | null;
};

export function useSignIn() {
  const [mutate, state] = useSignInMutation();
  const setSession = useAuthSession((s) => s.setSession);

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

      const profileData: ProfileData = {
        name:
          typeof user.name === "string" && user.name.trim()
            ? user.name
            : user.username || "User",
        email:
          typeof user.email === "string" && user.email.trim() ? user.email : "",
        phone:
          typeof user.phone === "string" && user.phone.trim() ? user.phone : "",
        photoUri: user.profilePictureUrl || null,
      };

      await setSession({
        jwt: token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email ?? null,
          name: user.name ?? null,
          phone: user.phone ?? null,
          country: user.country ?? null,
        },
        profile: profileData,
      });

      return {
        token,
        user,
        profileData,
      };
    },
    [mutate, setSession],
  );

  return {
    signIn,
    ...state,
  };
}
