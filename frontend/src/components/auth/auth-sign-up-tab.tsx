import * as Haptics from "expo-haptics";
import React, { useCallback, useMemo, useState } from "react";
import { TouchableOpacity, View } from "react-native";

import {
    AppText,
    Button,
    Input,
    PasswordRequirements,
    PasswordStrength,
} from "@/components/ui";
import { useAuthTheme } from "@/hooks/use-auth-theme";
import { useSignUp } from "@/hooks/useSignUp";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ShowFeedback = (opts: {
  title: string;
  message: string;
  variant?: "default" | "success" | "error";
  haptic?: "success" | "error" | "none";
  onClose?: () => void;
}) => Promise<void>;

type FormData = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  country: string;
  password: string;
  confirmPassword: string;
};

type AuthSignUpTabProps = {
  onSignedUp: () => void;
  onShowFeedback: ShowFeedback;
  onNavigate: (route: any) => void;
  signUp: (opts: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    country: string;
    password: string;
  }) => Promise<{
    token: string | null;
    user: {
      __typename?: "UserType";
      id: string;
      username: string;
      email?: string | null;
      name?: string | null;
      phone?: string | null;
      country?: string | null;
      profilePictureUrl?: string | null;
    } | null;
    profileData: {
      name: string;
      email: string;
      phone: string;
      photoUri: string | null;
    } | null;
    success: boolean;
  }>;
};

export function AuthSignUpTab({
  onSignedUp,
  onShowFeedback,
  onNavigate,
  signUp,
}: AuthSignUpTabProps) {
  const { border, brand, surface } = useAuthTheme();
  const { signUp: signUpHook } = useSignUp();

  const [form, setForm] = useState<FormData>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    country: "",
    password: "",
    confirmPassword: "",
  });

  const [terms, setTerms] = useState(false);
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);

  const setField = (k: keyof FormData, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const pwdMatch =
    form.confirmPassword.length > 0 && form.password === form.confirmPassword;
  const pwdMismatch =
    form.confirmPassword.length > 0 && form.password !== form.confirmPassword;

  const trimmedSignUpEmail = form.email.trim();
  const signUpEmailError = useMemo(() => {
    if (!trimmedSignUpEmail) return "";
    return EMAIL_RE.test(trimmedSignUpEmail)
      ? ""
      : "Please enter a valid email address.";
  }, [trimmedSignUpEmail]);

  const signUpMissingFields = useMemo(() => {
    const {
      firstName,
      lastName,
      username: uname,
      email,
      country,
      password: pwd,
      confirmPassword,
    } = form;

    const missing: string[] = [];
    if (!firstName.trim()) missing.push("First name");
    if (!lastName.trim()) missing.push("Last name");
    if (!uname.trim()) missing.push("Username");
    if (!email.trim()) missing.push("Email");
    if (!country.trim()) missing.push("Country");
    if (!pwd) missing.push("Password");
    if (!confirmPassword) missing.push("Confirm password");
    return missing;
  }, [form]);

  const handleSignUp = useCallback(async () => {
    const pwd = form.password;
    const confirmPassword = form.confirmPassword;

    if (signUpMissingFields.length > 0) {
      await onShowFeedback({
        title: "Missing fields",
        message: "Please fill in all required fields.",
        variant: "error",
        haptic: "error",
      });
      return;
    }

    if (signUpEmailError) {
      await onShowFeedback({
        title: "Invalid email",
        message: signUpEmailError,
        variant: "error",
        haptic: "error",
      });
      return;
    }

    if (pwd !== confirmPassword) {
      await onShowFeedback({
        title: "Passwords do not match",
        message: "Please make sure both passwords are the same.",
        variant: "error",
        haptic: "error",
      });
      return;
    }

    if (!canSubmit) {
      await onShowFeedback({
        title: "Weak password",
        message: "Please meet all the password requirements.",
        variant: "error",
        haptic: "error",
      });
      return;
    }

    if (!terms) {
      await onShowFeedback({
        title: "Terms required",
        message: "Please accept the terms to continue.",
        variant: "error",
        haptic: "error",
      });
      return;
    }

    setSignUpLoading(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      await signUp({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        username: form.username.trim(),
        email: form.email.trim(),
        country: form.country.trim(),
        password: form.password,
      });

      // Show success message and then redirect to security question setup
      onSignedUp();
    } catch (e) {
      await onShowFeedback({
        title: "Sign up failed",
        message:
          e instanceof Error
            ? e.message
            : "Unable to create your account. Please try again.",
        variant: "error",
        haptic: "error",
      });
    } finally {
      setSignUpLoading(false);
    }
  }, [
    canSubmit,
    form.confirmPassword,
    form.country,
    form.email,
    form.firstName,
    form.lastName,
    form.password,
    form.username,
    onNavigate,
    onShowFeedback,
    onSignedUp,
    signUp,
    signUpEmailError,
    signUpMissingFields.length,
    terms,
  ]);

  return (
    <View className="p-5 gap-3.5">
      {/* ── Personal Info ── */}
      <View className="flex-row items-center gap-1.5 mb-1">
        <AppText variant="sectionLabel">Personal Info</AppText>
      </View>

      {/* Name row */}
      <View className="flex-row gap-2.5">
        <View className="flex-1">
          <Input
            label="First Name"
            placeholder="John"
            value={form.firstName}
            onChangeText={(v) => setField("firstName", v)}
            autoCapitalize="words"
          />
        </View>
        <View className="flex-1">
          <Input
            label="Last Name"
            placeholder="Doe"
            value={form.lastName}
            onChangeText={(v) => setField("lastName", v)}
            autoCapitalize="words"
          />
        </View>
      </View>

      <Input
        label="Username"
        iconName="at-outline"
        hint="Used to sign in to your account"
        placeholder="johndoe"
        value={form.username}
        onChangeText={(v) => setField("username", v)}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <Input
        label="Email Address"
        iconName="mail-outline"
        placeholder="john@example.com"
        value={form.email}
        onChangeText={(v) => setField("email", v)}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        error={trimmedSignUpEmail ? signUpEmailError : undefined}
      />

      <Input
        label="Country of Residence"
        iconName="location-outline"
        placeholder="e.g. Kenya"
        value={form.country}
        onChangeText={(v) => setField("country", v)}
        autoCapitalize="words"
      />

      {/* ── Account Security ── */}
      <View className="flex-row items-center gap-1.5 mt-2 mb-1">
        <AppText variant="sectionLabel">Account Security</AppText>
      </View>

      <View className="gap-1.5">
        <Input
          label="Password"
          iconName="lock-closed-outline"
          placeholder="Min. 8 characters"
          value={form.password}
          onChangeText={(v) => setField("password", v)}
          secureTextEntry
        />
        <PasswordStrength password={form.password} />
      </View>

      <View className="gap-1.5">
        <Input
          label="Confirm Password"
          iconName="lock-closed-outline"
          placeholder="Re-enter password"
          value={form.confirmPassword}
          onChangeText={(v) => setField("confirmPassword", v)}
          secureTextEntry
          error={pwdMismatch ? "Passwords do not match" : undefined}
        />
        {pwdMatch && (
          <AppText variant="hint" className="text-success">
            Passwords match
          </AppText>
        )}
      </View>

      <PasswordRequirements password={form.password} onAllMet={setCanSubmit} />

      {/* ── Terms ── */}
      <TouchableOpacity
        onPress={() => setTerms(!terms)}
        activeOpacity={0.7}
        className="flex-row items-start gap-2.5"
      >
        <View
          className="w-5 h-5 rounded-md border-2 items-center justify-center mt-[1px] flex-shrink-0"
          style={{
            backgroundColor: terms ? brand : surface,
            borderColor: terms ? brand : border,
          }}
        >
          {terms && (
            <AppText variant="hint" className="text-white">
              ✓
            </AppText>
          )}
        </View>
        <AppText
          variant="body"
          className="flex-1 text-[13px] leading-[20px] text-muted-foreground"
        >
          I agree to the <AppText variant="link">Terms of Service</AppText> and{" "}
          <AppText variant="link">Privacy Policy</AppText>
        </AppText>
      </TouchableOpacity>

      <Button
        text="Create Account"
        rightIcon="arrow-forward"
        loading={signUpLoading}
        onPress={handleSignUp}
        className="mt-3 h-14"
        disabled={signUpLoading}
      />
    </View>
  );
}
