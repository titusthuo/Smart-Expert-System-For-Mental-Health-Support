import { AuthScreenShell } from "@/components/auth/auth-shell";
import { AppText, Button, Input } from "@/components/ui";
import { AuthPalette } from "@/constants/theme";
import { useResetPasswordWithOtpMutation } from "@/graphql/generated/graphql";
import { useAuthTheme } from "@/hooks/use-auth-theme";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";

export function NewPasswordScreen() {
  const router = useRouter();
  const { username, otp } = useLocalSearchParams();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const theme = useAuthTheme();

  const [resetPasswordWithOtp] = useResetPasswordWithOtpMutation();

  const handleReset = async () => {
    if (password !== confirm) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      const { data } = await resetPasswordWithOtp({
        variables: {
          username: username as string,
          otp: otp as string,
          newPassword: password,
        },
      });

      if (data?.resetPasswordWithOtp?.success) {
        setSuccess(true);
        setTimeout(() => {
          router.replace("/(auth)/sign-in");
        }, 2000);
      } else {
        throw new Error(
          data?.resetPasswordWithOtp?.error || "Something went wrong.",
        );
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScreenShell title="New Password" onBack={() => router.back()} asModal>
      <View style={styles.container}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: theme.isDark ? theme.brandSoft : AuthPalette.brandSoft },
          ]}
        >
          <Ionicons
            name="shield-checkmark-outline"
            size={48}
            color={theme.brand}
          />
        </View>

        <AppText variant="heading" style={styles.title}>
          New Password
        </AppText>
        <AppText
          variant="body"
          style={[styles.subtitle, { color: theme.subtle }]}
        >
          Almost done! Set your new password below.
        </AppText>

        <View style={styles.formContainer}>
          <Input
            label="New Password"
            iconName="lock-closed-outline"
            placeholder="Min. 8 characters"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <Input
            label="Confirm Password"
            iconName="lock-closed-outline"
            placeholder="Re-enter password"
            secureTextEntry
            value={confirm}
            onChangeText={setConfirm}
          />

          {/* Success Message */}
          {success ? (
            <View style={styles.successContainer}>
              <Ionicons
                name="checkmark-circle"
                size={24}
                color="#10B981"
                style={styles.successIcon}
              />
              <AppText
                variant="body"
                style={[styles.successText, { color: theme.success }]}
              >
                Password reset successful! Redirecting to sign in...
              </AppText>
            </View>
          ) : null}

          <Button
            text="Reset Password"
            rightIcon="checkmark-circle-outline"
            loading={loading}
            onPress={handleReset}
            style={styles.button}
          />
        </View>
      </View>
    </AuthScreenShell>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: AuthPalette.brandSoft,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 24,
  },
  title: {
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
    color: "#6B7280",
    marginBottom: 32,
  },
  formContainer: {
    flex: 1,
  },
  button: {
    marginTop: 24,
  },
  successContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.2)",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 16,
  },
  successIcon: {
    marginRight: 12,
  },
  successText: {
    fontSize: 14,
    flex: 1,
    fontWeight: "500",
  },
});
