import { AuthFeedbackModal, useAuthFeedback } from "@/components/auth/auth-feedback";
import { AuthScreenShell } from "@/components/auth/auth-shell";
import { AppText, Button, Input, PasswordRequirements, PasswordStrength } from "@/components/ui";
import { useAuthTheme } from "@/hooks/use-auth-theme";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { View } from "react-native";

export function ResetPasswordScreen() {
  const router = useRouter();
  const { brandSoft, success, successSoft, successNoteBg, successNoteBorder } =
    useAuthTheme();

  const feedback = useAuthFeedback();

  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [loading, setLoading] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const hasConfirm = confirmPwd.length > 0;
  const pwdMatch = hasConfirm && newPwd === confirmPwd;
  const pwdMismatch = hasConfirm && newPwd !== confirmPwd;

  const submitEnabled = !loading && canSubmit && pwdMatch;

  const submitError = useMemo(() => {
    if (!newPwd || !confirmPwd) return "Please fill in both password fields.";
    if (!canSubmit) return "Please meet all the password requirements.";
    if (!pwdMatch) return "Passwords do not match.";
    return "";
  }, [canSubmit, confirmPwd, newPwd, pwdMatch]);

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

    setLoading(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    setTimeout(() => {
      setLoading(false);
      setResetSuccess(true);
    }, 950);
  }, [feedback, submitEnabled, submitError]);

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
