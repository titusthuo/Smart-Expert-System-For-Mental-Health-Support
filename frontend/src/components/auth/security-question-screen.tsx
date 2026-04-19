import { AuthScreenShell } from "@/components/auth/auth-shell";
import { AppText, Button, Input } from "@/components/ui";
import { AuthPalette, Colors } from "@/constants/theme";
import { useVerifySecurityAnswerMutation } from "@/graphql/generated/graphql";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, View, useColorScheme } from "react-native";

export function SecurityQuestionScreen() {
  const router = useRouter();
  const { username, question } = useLocalSearchParams();
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme || "light"];

  const [verifySecurityAnswer] = useVerifySecurityAnswerMutation();

  const handleVerify = async () => {
    if (!answer.trim()) {
      Alert.alert("Error", "Please enter your answer.");
      return;
    }

    setLoading(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      const { data } = await verifySecurityAnswer({
        variables: {
          username: username as string,
          answer: answer.trim(),
        },
      });

      if (data?.verifySecurityAnswer?.success) {
        router.push({
          pathname: "/(auth)/otp-verification",
          params: {
            username: username as string,
            otp: data.verifySecurityAnswer.otp,
          },
        });
      } else {
        throw new Error(
          data?.verifySecurityAnswer?.error || "Incorrect answer",
        );
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message || "Incorrect answer. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const dynamicStyles = StyleSheet.create({
    questionBox: {
      backgroundColor: themeColors.card,
      padding: 16,
      borderRadius: 12,
      borderLeftWidth: 4,
      borderLeftColor: AuthPalette.brand,
    },
    questionText: {
      color: themeColors.foreground,
      lineHeight: 22,
    },
  });

  return (
    <AuthScreenShell title="Security Question" onBack={() => router.back()} asModal>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Ionicons name="shield-checkmark-outline" size={48} color={AuthPalette.brand} />
        </View>

        <AppText variant="heading" style={styles.title}>
          Security Question
        </AppText>
        <AppText variant="body" style={styles.subtitle}>
          Answer your security question to receive a verification code.
        </AppText>

        <View style={styles.questionContainer}>
          <AppText variant="body" style={styles.questionLabel}>
            Question:
          </AppText>
          <View style={dynamicStyles.questionBox}>
            <AppText variant="body" style={dynamicStyles.questionText}>
              {question}
            </AppText>
          </View>
        </View>

        <View style={styles.formContainer}>
          <Input
            label="Your Answer"
            iconName="key-outline"
            placeholder="Enter your answer"
            value={answer}
            onChangeText={setAnswer}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Button
            text="Verify Answer"
            rightIcon="checkmark-circle-outline"
            loading={loading}
            disabled={!answer.trim() || loading}
            onPress={handleVerify}
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
  questionContainer: {
    marginBottom: 32,
  },
  questionLabel: {
    fontWeight: "600",
    marginBottom: 8,
  },
  formContainer: {
    flex: 1,
  },
  button: {
    marginTop: 24,
  },
});
