import { AuthScreenShell } from "@/components/auth/auth-shell";
import { AppText, Button, Input } from "@/components/ui";
import { useAuthTheme } from "@/hooks/use-auth-theme";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

export function OTPVerificationScreen() {
  const router = useRouter();
  const { username, otp } = useLocalSearchParams();
  const [enteredOTP, setEnteredOTP] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const theme = useAuthTheme();

  const handleVerifyOTP = () => {
    setError("");

    if (enteredOTP !== otp) {
      setError("The code you entered is incorrect.");
      return;
    }

    // Navigate to new password screen
    router.push({
      pathname: "/(auth)/new-password",
      params: {
        username: username as string,
        otp: otp as string,
      },
    });
  };

  return (
    <AuthScreenShell title="Enter OTP" onBack={() => router.back()}>
      <View style={styles.container}>
        {/* Demo OTP Display Box */}
        <View style={styles.demoBox}>
          <View style={styles.demoHeader}>
            <Ionicons name="flask-outline" size={20} color="#F97316" />
            <AppText variant="body" style={styles.demoLabel}>
              DEMO MODE
            </AppText>
          </View>
          <AppText variant="body" style={styles.demoSubLabel}>
            In production, this code would be sent via SMS.
            {"\n"}
            Your reset code is:
          </AppText>
          <AppText variant="heading" style={styles.otpDisplay}>
            {otp}
          </AppText>
          <AppText variant="hint" style={styles.demoNote}>
            This code expires in 10 minutes
          </AppText>
        </View>

        <View style={styles.iconContainer}>
          <Ionicons name="phone-portrait-outline" size={48} color="#4F46E5" />
        </View>

        <AppText variant="heading" style={styles.title}>
          Enter Verification Code
        </AppText>
        <AppText variant="body" style={styles.subtitle}>
          Type the 6-digit code shown above to continue.
        </AppText>

        <View style={styles.formContainer}>
          <Input
            label="Verification Code"
            iconName="keypad-outline"
            placeholder="000000"
            value={enteredOTP}
            onChangeText={(text) => {
              setEnteredOTP(text);
              setError("");
            }}
            keyboardType="number-pad"
            maxLength={6}
            textAlign="center"
            style={styles.otpInput}
          />

          {/* Error Message */}
          {error ? (
            <View style={styles.errorContainer}>
              <Ionicons
                name="close-circle"
                size={16}
                color={theme.error}
                style={styles.errorIcon}
              />
              <AppText
                variant="body"
                style={[styles.errorText, { color: theme.error }]}
              >
                {error}
              </AppText>
            </View>
          ) : null}

          <Button
            text="Verify Code"
            rightIcon="checkmark-circle-outline"
            loading={loading}
            disabled={enteredOTP.length !== 6 || loading}
            onPress={handleVerifyOTP}
            style={styles.button}
          />
        </View>

        <View style={styles.footer}>
          <AppText variant="hint" style={styles.footerText}>
            Didn't receive the code? Check your demo box above.
          </AppText>
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
  demoBox: {
    backgroundColor: "#FFF7ED",
    borderWidth: 1.5,
    borderColor: "#F97316",
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    alignItems: "center",
  },
  demoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  demoLabel: {
    color: "#C2410C",
    fontWeight: "bold",
    marginLeft: 8,
  },
  demoSubLabel: {
    color: "#92400E",
    textAlign: "center",
    marginBottom: 12,
    fontSize: 13,
  },
  otpDisplay: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1F2937",
    letterSpacing: 6,
    marginBottom: 8,
  },
  demoNote: {
    color: "#92400E",
    textAlign: "center",
    fontSize: 12,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#EEF2FF",
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
  otpInput: {
    fontSize: 20,
    letterSpacing: 6,
    textAlign: "center",
    height: 56,
    paddingTop: 0,
    paddingBottom: 0,
  },
  button: {
    marginTop: 24,
  },
  footer: {
    alignItems: "center",
    marginTop: 24,
  },
  footerText: {
    color: "#6B7280",
    textAlign: "center",
    fontSize: 12,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.2)",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  errorIcon: {
    marginRight: 8,
  },
  errorText: {
    fontSize: 14,
    flex: 1,
  },
});
