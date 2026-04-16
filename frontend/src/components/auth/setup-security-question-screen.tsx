import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSetupSecurityQuestionMutation } from '@/graphql/generated/graphql';
import { AuthScreenShell } from '@/components/auth/auth-shell';
import { AppText, Button, Input } from '@/components/ui';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

const SECURITY_QUESTIONS = [
  { key: 'mother_maiden', label: "What is your mother's maiden name?" },
  { key: 'first_pet', label: "What was the name of your first pet?" },
  { key: 'primary_school', label: "What primary school did you attend?" },
  { key: 'childhood_city', label: "What city did you grow up in?" },
  { key: 'first_car', label: "What was your first car?" },
];

export function SetupSecurityQuestionScreen() {
  const router = useRouter();
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const [setupSecurityQuestion] = useSetupSecurityQuestionMutation();

  const handleSetup = async () => {
    if (!selectedQuestion || !answer.trim()) {
      Alert.alert('Error', 'Please select a question and provide an answer.');
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
        Alert.alert(
          'Success!',
          'Security question has been set up successfully.',
          [
            {
              text: 'Continue',
              onPress: () => router.replace('/(tabs)/'),
            },
          ]
        );
      } else {
        throw new Error(data?.setupSecurityQuestion?.error || 'Setup failed');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to set up security question.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScreenShell title="Security Question" onBack={() => router.back()}>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Ionicons name="shield-checkmark-outline" size={48} color="#4F46E5" />
        </View>

        <AppText variant="heading" style={styles.title}>
          Set Up Security Question
        </AppText>
        <AppText variant="body" style={styles.subtitle}>
          This will help you recover your account if you forget your password.
        </AppText>

        <View style={styles.formContainer}>
          <View style={styles.questionContainer}>
            <AppText variant="body" style={styles.label}>
              Select a security question:
            </AppText>
            {SECURITY_QUESTIONS.map((q) => (
              <TouchableOpacity
                key={q.key}
                style={[
                  styles.questionOption,
                  selectedQuestion === q.key && styles.selectedQuestion,
                ]}
                onPress={() => setSelectedQuestion(q.key)}
              >
                <Ionicons
                  name={selectedQuestion === q.key ? 'checkmark-circle' : 'radio-button-off'}
                  size={20}
                  color={selectedQuestion === q.key ? '#4F46E5' : '#9CA3AF'}
                />
                <AppText variant="body" style={styles.questionText}>
                  {q.label}
                </AppText>
              </TouchableOpacity>
            ))}
          </View>

          <Input
            label="Your Answer"
            iconName="key-outline"
            placeholder="Enter your answer"
            value={answer}
            onChangeText={setAnswer}
            autoCapitalize="none"
          />

          <Button
            text="Complete Setup"
            rightIcon="checkmark-circle-outline"
            loading={loading}
            disabled={!selectedQuestion || !answer.trim() || loading}
            onPress={handleSetup}
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
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 24,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    color: '#6B7280',
    marginBottom: 32,
  },
  formContainer: {
    flex: 1,
  },
  questionContainer: {
    marginBottom: 24,
  },
  label: {
    marginBottom: 12,
    fontWeight: '600',
  },
  questionOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 8,
  },
  selectedQuestion: {
    backgroundColor: '#EEF2FF',
    borderColor: '#4F46E5',
  },
  questionText: {
    marginLeft: 12,
    flex: 1,
  },
  button: {
    marginTop: 'auto',
  },
});
