import {
    AuthFeedbackModal,
    useAuthFeedback,
} from "@/components/auth/auth-feedback";
import { AuthScreenShell } from "@/components/auth/auth-shell";
import { AppText, Button, Input } from "@/components/ui";
import { useForgotPasswordMutation } from "@/graphql/generated/graphql";
import { useAuthTheme } from "@/hooks/use-auth-theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { TouchableOpacity, View } from "react-native";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ForgotPasswordScreen() {
  const router = useRouter();
  const { brand, brandSoft, success, successSoft, subtle } = useAuthTheme();
  const feedback = useAuthFeedback();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const [forgotPasswordMutation] = useForgotPasswordMutation();

  const trimmedEmail = email.trim();

  const headerTitle = sent ? "Check your email" : "Reset password";
  const heroTitle = sent ? "Reset link sent!" : "Forgot password?";
  const heroIconName = sent ? "mail-open-outline" : "lock-open-outline";
  const heroIconColor = sent ? success : brand;
  const heroBg = sent ? successSoft : brandSoft;

  const emailError = useMemo(() => {
    if (!trimmedEmail) return "";
    return EMAIL_RE.test(trimmedEmail)
      ? ""
      : "Please enter a valid email address.";
  }, [trimmedEmail]);

  const canSubmit = !sent && !loading && !!trimmedEmail && !emailError;

  const handleSubmit = useCallback(async () => {
    // Redirect to the new username-based forgot password flow
    router.push("/(auth)/forgot-password-username");
  }, [router]);

  return (
    <>
      <AuthScreenShell title={headerTitle} onBack={() => router.back()} asModal>
        <View className="items-center mb-10">
          <View
            className="w-20 h-20 rounded-2xl items-center justify-center mb-5"
            style={{ backgroundColor: heroBg }}
          >
            <Ionicons name={heroIconName} size={40} color={heroIconColor} />
          </View>

          <AppText
            variant="heading"
            className="text-3xl font-bold text-center mb-3"
          >
            {heroTitle}
          </AppText>

          <AppText
            variant="body"
            className="text-center leading-6 max-w-[320px]"
          >
            {sent ? (
              <>
                We sent a password reset link to{" "}
                <AppText variant="link" className="font-medium">
                  {trimmedEmail}
                </AppText>
                . Please check your inbox (and spam folder).
              </>
            ) : (
              "No worries. Enter your email and we'll send you a secure link to reset your password."
            )}
          </AppText>
        </View>

        {!sent ? (
          <View className="bg-card rounded-2xl border border-border p-6 shadow-sm gap-6">
            <Input
              label="Email address"
              iconName="mail-outline"
              placeholder="you@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="send"
              onSubmitEditing={handleSubmit}
              error={trimmedEmail ? emailError : undefined}
            />

            <Button
              text="Send Reset Link"
              rightIcon="send-outline"
              loading={loading}
              onPress={handleSubmit}
              className="h-14"
              disabled={!canSubmit}
            />
          </View>
        ) : (
          <View className="bg-card rounded-2xl border border-border p-6 shadow-sm gap-6">
            <View className="gap-4">
              {[
                { n: "1", t: "Open the email from Mentally" },
                { n: "2", t: "Tap the password reset link" },
                { n: "3", t: "Create your new secure password" },
              ].map((step) => (
                <View key={step.n} className="flex-row items-start gap-3">
                  <View
                    className="w-9 h-9 rounded-full items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: brandSoft }}
                  >
                    <AppText
                      variant="label"
                      className="text-base font-bold text-white"
                    >
                      {step.n}
                    </AppText>
                  </View>
                  <AppText variant="body" className="flex-1 leading-6">
                    {step.t}
                  </AppText>
                </View>
              ))}
            </View>

            <Button
              text="Enter New Password"
              rightIcon="arrow-forward"
              onPress={() => router.push("/(auth)/reset-password")}
              className="h-14 mt-2"
            />

            <TouchableOpacity
              onPress={() => {
                setSent(false);
                setEmail("");
              }}
              className="items-center py-2"
              accessibilityRole="button"
              accessibilityLabel="Try a different email"
            >
              <AppText variant="body" className="text-sm text-muted-foreground">
                Wrong email?{" "}
                <AppText variant="link" className="font-medium">
                  Try again
                </AppText>
              </AppText>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          onPress={() => router.push("/(auth)/sign-in")}
          className="flex-row items-center justify-center gap-2 mt-10 opacity-80 active:opacity-100"
          accessibilityRole="button"
          accessibilityLabel="Back to Sign In"
        >
          <Ionicons name="arrow-back-outline" size={16} color={subtle} />
          <AppText variant="hint" className="font-medium">
            Back to Sign In
          </AppText>
        </TouchableOpacity>
      </AuthScreenShell>

      <AuthFeedbackModal {...feedback.modalProps} />
    </>
  );
}
