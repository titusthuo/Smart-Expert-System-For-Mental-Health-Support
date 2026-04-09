import {
  AuthFeedbackModal,
  useAuthFeedback,
} from "@/components/auth/auth-feedback";
import { AuthScreenShell } from "@/components/auth/auth-shell";
import {
  AppText,
  Button,
  Input,
  PasswordRequirements,
  PasswordStrength,
} from "@/components/ui";
import { useResetPasswordMutation } from "@/graphql/generated/graphql";
import { useAuthTheme } from "@/hooks/use-auth-theme";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { View } from "react-native";

export function ResetPasswordScreen() {
  const router = useRouter();
  const { token } = useLocalSearchParams();
  const { brandSoft, success, successSoft, successNoteBg, successNoteBorder } =
    useAuthTheme();

  const feedback = useAuthFeedback();

  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [loading, setLoading] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [manualToken, setManualToken] = useState("");

  const [resetPasswordMutation] = useResetPasswordMutation();

  // Get token from URL params or manual input
  const urlToken = token as string;
  const resetToken =
    urlToken === "reset-password" || !urlToken ? manualToken : urlToken;

  // Debug: Log the token to see if it's being read correctly
  console.log("Reset token from URL:", urlToken);
  console.log("Raw token param:", token);
  console.log("Manual token:", manualToken);
  console.log("Final reset token:", resetToken);

  const hasConfirm = confirmPwd.length > 0;
  const pwdMatch = hasConfirm && newPwd === confirmPwd;
  const pwdMismatch = hasConfirm && newPwd !== confirmPwd;

  const submitEnabled = !loading && canSubmit && pwdMatch && !!resetToken;

  // Debug: Log submit conditions
  console.log("Submit conditions:", {
    loading,
    canSubmit,
    pwdMatch,
    resetToken,
    submitEnabled,
  });

  const submitError = useMemo(() => {
    if (!resetToken)
      return "Invalid reset link. Please request a new password reset.";
    if (!newPwd || !confirmPwd) return "Please fill in both password fields.";
    if (!canSubmit) return "Please meet all the password requirements.";
    if (!pwdMatch) return "Passwords do not match.";
    return "";
  }, [canSubmit, confirmPwd, newPwd, pwdMatch, resetToken]);

  const handleReset = useCallback(async () => {
    if (!submitEnabled) {
      await feedback.show({
        title: "Unable to reset",
        message: submitError || "Please review your inputs and try again.",
        variant: "error",
        haptic: "error",
      });
      return;
    }

    if (!resetToken) {
      await feedback.show({
        title: "Invalid Reset Link",
        message: "This password reset link is invalid or has expired.",
        variant: "error",
        haptic: "error",
      });
      return;
    }

    setLoading(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      console.log("Calling resetPassword mutation with:", {
        token: resetToken,
        newPassword: newPwd,
      });

      const { data } = await resetPasswordMutation({
        variables: {
          token: resetToken,
          newPassword: newPwd,
        },
      });

      console.log("Reset password response:", data);

      if (data?.resetPassword?.success) {
        setResetSuccess(true);
        await feedback.show({
          title: "Success",
          message:
            data.resetPassword.message ||
            "Password has been reset successfully.",
          variant: "success",
          haptic: "success",
        });
      } else {
        throw new Error(
          data?.resetPassword?.error || "Failed to reset password",
        );
      }
    } catch (error: any) {
      console.log("Reset password error details:", error);
      console.log("Error message:", error.message);
      console.log("Error object:", JSON.stringify(error, null, 2));

      await feedback.show({
        title: "Reset Failed",
        message: error.message || "Failed to reset password. Please try again.",
        variant: "error",
        haptic: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [
    feedback,
    submitEnabled,
    submitError,
    resetToken,
    resetPasswordMutation,
    newPwd,
  ]);

  return (
    <>
      <AuthScreenShell
        title={resetSuccess ? "Success" : "New password"}
        onBack={resetSuccess ? undefined : () => router.back()}
      >
        {!resetSuccess ? (
          <>
            <View
              className="w-[72px] h-[72px] rounded-2xl items-center justify-center mb-6"
              style={{ backgroundColor: brandSoft }}
            >
              <Ionicons
                name="shield-checkmark-outline"
                size={32}
                color="#FFFFFF"
              />
            </View>

            <AppText variant="heading" className="text-[26px]">
              Create new password
            </AppText>

            <AppText
              variant="body"
              className="mt-2.5 mb-7 text-muted-foreground"
            >
              Your new password must be different from any previously used
              passwords.
            </AppText>

            <View className="rounded-2xl border border-border bg-card p-5 gap-4 shadow-sm">
              {/* Manual token input for testing */}
              {!resetToken && (
                <View className="gap-1.5">
                  <Input
                    label="Reset Token (from console)"
                    iconName="key-outline"
                    placeholder="Paste token from Django console"
                    value={manualToken}
                    onChangeText={setManualToken}
                  />
                </View>
              )}

              <View className="gap-1.5">
                <Input
                  label="New Password"
                  iconName="lock-closed-outline"
                  placeholder="Min. 8 characters"
                  value={newPwd}
                  onChangeText={setNewPwd}
                  secureTextEntry
                />
                <PasswordStrength password={newPwd} />
              </View>

              <View className="gap-1.5">
                <Input
                  label="Confirm Password"
                  iconName="lock-closed-outline"
                  placeholder="Re-enter password"
                  value={confirmPwd}
                  onChangeText={setConfirmPwd}
                  secureTextEntry
                  error={pwdMismatch ? "Passwords do not match" : undefined}
                />

                {pwdMatch && (
                  <View className="flex-row items-center gap-1.5">
                    <Ionicons
                      name="checkmark-circle"
                      size={13}
                      color={success}
                    />
                    <AppText variant="hint" className="text-success">
                      Passwords match
                    </AppText>
                  </View>
                )}
              </View>

              <PasswordRequirements password={newPwd} onAllMet={setCanSubmit} />

              <Button
                text="Reset Password"
                rightIcon="checkmark-circle-outline"
                loading={loading}
                disabled={!submitEnabled}
                onPress={handleReset}
                className="h-14"
              />
            </View>
          </>
        ) : (
          <>
            <View
              className="w-[72px] h-[72px] rounded-2xl items-center justify-center mb-6"
              style={{ backgroundColor: successSoft }}
            >
              <Ionicons name="checkmark-circle" size={36} color={success} />
            </View>

            <AppText variant="heading" className="text-[26px]">
              Password updated!
            </AppText>

            <AppText
              variant="body"
              className="mt-2.5 mb-7 text-muted-foreground"
            >
              Your password has been changed successfully. You can now sign in
              with your new password.
            </AppText>

            <View className="rounded-2xl border border-border bg-card p-5 gap-4 shadow-sm">
              <View
                className="flex-row items-start gap-2.5 border rounded-xl p-3.5"
                style={{
                  borderColor: successNoteBorder,
                  backgroundColor: successNoteBg,
                }}
              >
                <Ionicons name="shield-checkmark" size={16} color={success} />
                <AppText
                  variant="body"
                  className="flex-1 text-[13px] leading-[19px] font-medium"
                  style={{ color: success }}
                >
                  All other sessions have been signed out for your security.
                </AppText>
              </View>

              <Button
                text="Sign In Now"
                rightIcon="arrow-forward"
                onPress={() => router.replace("/(auth)/sign-in")}
                className="h-14"
              />
            </View>
          </>
        )}
      </AuthScreenShell>

      <AuthFeedbackModal {...feedback.modalProps} />
    </>
  );
}
