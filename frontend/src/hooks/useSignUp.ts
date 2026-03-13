import { useCallback } from "react";

import { useSignUpMutation } from "@/graphql/generated/graphql";
import { useAuthSession } from "@/stores/useAuthSession";

type ProfileData = {
  name: string;
  email: string;
  phone: string;
  photoUri: string | null;
};

type SignUpInput = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  country: string;
  password: string;
};

export function useSignUp() {
  const [mutate, state] = useSignUpMutation();
  const setSession = useAuthSession((s) => s.setSession);

  const signUp = useCallback(
    async ({
      firstName,
      lastName,
      username,
      email,
      country,
      password,
    }: SignUpInput) => {
      const res = await mutate({
        variables: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          username: username.trim(),
          email: email.trim(),
          country: country.trim(),
          password,
        },
      });

      const payload = res.data?.signUp;

      if (!payload?.success) {
        throw new Error(payload?.error || "Sign up failed");
      }

      const token = payload.token ?? null;
      const user = payload.user ?? null;

      let profileData: ProfileData | null = null;
      if (user) {
        profileData = {
          name:
            typeof user.name === "string" && user.name.trim()
              ? user.name
              : user.username || "User",
          email:
            typeof user.email === "string" && user.email.trim()
              ? user.email
              : "",
          phone:
            typeof user.phone === "string" && user.phone.trim()
              ? user.phone
              : "",
          photoUri: user.profilePictureUrl || null,
        };
      }

      if (token && user && profileData) {
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
      }

      return {
        token,
        user,
        profileData,
        success: true,
      };
    },
    [mutate, setSession],
  );

  return {
    signUp,
    ...state,
  };
}
