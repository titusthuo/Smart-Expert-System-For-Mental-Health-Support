import { AuthScreenShell } from '@/components/auth/auth-shell';
import { AppText, Button, Input } from '@/components/ui';
import { useGetSecurityQuestionMutation } from '@/graphql/generated/graphql';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';

export function ForgotPasswordUsernameScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const [getSecurityQuestion] = useGetSecurityQuestionMutation();

  const handleNext = async () => {
    if (!username.trim()) {
      Alert.alert('Error', 'Please enter your username.');
      return;
    }

    setLoading(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      const { data } = await getSecurityQuestion({
        variables: {
          username: username.trim(),
        },
      });

      if (data?.getSecurityQuestion?.success) {
        router.push({
          pathname: '/(auth)/security-question',
          params: {
            username: username.trim(),
            question: data.getSecurityQuestion.question,
            questionKey: data.getSecurityQuestion.questionKey,
          },
        });
      } else {
        throw new Error(data?.getSecurityQuestion?.error || 'User not found');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'User not found or no security question set.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScreenShell title="Forgot Password" onBack={() => router.back()}>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Ionicons name="help-circle-outline" size={48} color="#4F46E5" />
        </View>

        <AppText variant="heading" style={styles.title}>
          Forgot Password?
        </AppText>
        <AppText variant="body" style={styles.subtitle}>
          Enter your username to recover your account using your security question.
        </AppText>

        <View style={styles.formContainer}>
          <Input
            label="Username"
            iconName="person-outline"
            placeholder="Enter your username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Button
            text="Continue"
            rightIcon="arrow-forward"
            loading={loading}
            disabled={!username.trim() || loading}
            onPress={handleNext}
            style={styles.button}
          />
        </View>

        <View style={styles.footer}>
          <AppText variant="body" style={styles.footerText}>
            Remember your password?
          </AppText>
          <TouchableOpacity onPress={() => router.push('/(auth)/sign-in')}>
            <AppText variant="body" style={styles.signInLink}>
              Sign In
            </AppText>
          </TouchableOpacity>
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
  button: {
    marginTop: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
  footerText: {
    color: '#6B7280',
    marginRight: 8,
  },
  signInLink: {
    color: '#4F46E5',
    fontWeight: '600',
  },
});
