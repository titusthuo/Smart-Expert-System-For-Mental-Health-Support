import { AppText, Button } from "@/components/ui";
import { useSetupSecurityQuestionMutation } from "@/graphql/generated/graphql";
import { useAuthTheme } from "@/hooks/use-auth-theme";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const SECURITY_QUESTIONS = [
  { key: "mother_maiden", label: "What is your mother's maiden name?" },
  { key: "first_pet", label: "What was the name of your first pet?" },
  { key: "primary_school", label: "What primary school did you attend?" },
  { key: "childhood_city", label: "What city did you grow up in?" },
  { key: "first_car", label: "What was your first car?" },
];

type SecurityQuestionModalProps = {
  visible: boolean;
  onComplete: () => void;
  onSkip?: () => void;
};

export function SecurityQuestionModal({
  visible,
  onComplete,
  onSkip,
}: SecurityQuestionModalProps) {
  const [selectedQuestion, setSelectedQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const theme = useAuthTheme();

  const [setupSecurityQuestion] = useSetupSecurityQuestionMutation();

  const handleSetup = async () => {
    setError("");

    if (!selectedQuestion || !answer.trim()) {
      setError("Please select a security question and provide an answer.");
      return;
    }

    setLoading(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      const { data } = await setupSecurityQuestion({
        variables: {
          question: selectedQuestion,
          answer: answer.trim(),
        },
      });

      if (data?.setupSecurityQuestion?.success) {
        console.log("Security question set up successfully");
        onComplete();
      } else {
        setError(
          data?.setupSecurityQuestion?.error ||
            "Failed to set up security question",
        );
      }
    } catch (error: any) {
      console.error("Failed to set up security question:", error);
      setError(
        error.message ||
          "Failed to set up security question. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => {
        onSkip?.();
      }}
    >
      <View style={[styles.container, { backgroundColor: theme.bg }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onSkip} style={styles.skipButton}>
            <AppText
              variant="body"
              style={[styles.skipText, { color: theme.subtle }]}
            >
              Skip
            </AppText>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.contentWrapper}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: theme.isDark ? "#1e1b4b" : "#EEF2FF" },
              ]}
            >
              <Ionicons
                name="shield-checkmark-outline"
                size={64}
                color={theme.brand}
              />
            </View>

            <AppText variant="heading" style={styles.title}>
              Set Up Security Question
            </AppText>
            <AppText
              variant="body"
              style={[styles.subtitle, { color: theme.subtle }]}
            >
              This helps you recover your account if you forget your password.
            </AppText>

            {/* Security Questions */}
            <View style={styles.questionContainer}>
              <AppText
                variant="body"
                style={[styles.label, { color: theme.text }]}
              >
                Select a security question:
              </AppText>
              {SECURITY_QUESTIONS.map((q) => (
                <TouchableOpacity
                  key={q.key}
                  style={[
                    styles.questionOption,
                    { borderColor: theme.border },
                    selectedQuestion === q.key && [
                      styles.selectedQuestion,
                      {
                        borderColor: theme.brand,
                        backgroundColor: theme.isDark ? "#1e1b4b" : "#EEF2FF",
                      },
                    ],
                  ]}
                  onPress={() => {
                    setSelectedQuestion(q.key);
                    setError("");
                  }}
                >
                  <Ionicons
                    name={
                      selectedQuestion === q.key
                        ? "checkmark-circle"
                        : "radio-button-off"
                    }
                    size={20}
                    color={
                      selectedQuestion === q.key ? theme.brand : theme.subtle
                    }
                  />
                  <AppText
                    variant="body"
                    style={[styles.questionText, { color: theme.text }]}
                  >
                    {q.label}
                  </AppText>
                </TouchableOpacity>
              ))}
            </View>

            {/* Answer Input */}
            <View style={styles.inputContainer}>
              <AppText
                variant="body"
                style={[styles.label, { color: theme.text, marginBottom: 8 }]}
              >
                Your Answer
              </AppText>
              <View
                style={[
                  styles.inputWrapper,
                  {
                    borderColor: theme.border,
                    backgroundColor: theme.surface,
                  },
                ]}
              >
                <Ionicons
                  name="key-outline"
                  size={17}
                  color={theme.subtle}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[
                    styles.textInput,
                    {
                      color: theme.text,
                      flex: 1,
                    },
                  ]}
                  placeholder="Enter your answer"
                  placeholderTextColor={theme.subtle}
                  value={answer}
                  onChangeText={(text) => {
                    setAnswer(text);
                    setError("");
                  }}
                  autoCapitalize="none"
                />
              </View>
            </View>

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

            {/* Complete Button */}
            <Button
              text="Complete Setup"
              rightIcon="checkmark-circle-outline"
              loading={loading}
              disabled={!selectedQuestion || !answer.trim() || loading}
              onPress={handleSetup}
              style={styles.button}
            />
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  skipText: {
    fontSize: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 24,
  },
  title: {
    textAlign: "center",
    marginBottom: 8,
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 32,
    fontSize: 16,
    lineHeight: 24,
  },
  questionContainer: {
    marginBottom: 24,
  },
  label: {
    marginBottom: 12,
    fontWeight: "600",
    fontSize: 16,
  },
  questionOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  selectedQuestion: {},
  questionText: {
    marginLeft: 12,
    flex: 1,
    fontSize: 16,
  },
  answerInput: {
    marginBottom: 24,
  },
  button: {
    marginTop: 24,
    height: 56,
  },
  contentWrapper: {
    paddingBottom: 40,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  inputIcon: {
    marginRight: 8,
  },
  textInput: {
    fontSize: 15,
    padding: 0,
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
