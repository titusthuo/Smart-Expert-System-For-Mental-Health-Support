import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppText, Button, Input } from "@/components/ui";
import { useAuthTheme } from "@/hooks/use-auth-theme";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { isDark, bg, text, subtle, brand, brandSoft, success, successSoft } =
    useAuthTheme();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const headerTitle = sent ? "Check your email" : "Reset password";
  const heroTitle = sent ? "Reset link sent!" : "Forgot password?";
  const heroIconName = sent ? "mail-open-outline" : "lock-open-outline";
  const heroIconColor = sent ? success : brand;
  const heroBgClass = sent ? `bg-${successSoft}` : `bg-${brandSoft}`;

  const handleSubmit = () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      Alert.alert("Required", "Please enter your email address.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      Alert.alert("Invalid email", "Please enter a valid email address.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1400);
  };

  return (
    <View className="flex-1" style={{ backgroundColor: bg }}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
          keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between px-5 py-4 border-b border-border/60 bg-surface/80 backdrop-blur-sm">
            <TouchableOpacity
              onPress={() => router.back()}
              activeOpacity={0.7}
              className="w-10 h-10 rounded-xl border border-border/50 bg-surface items-center justify-center shadow-sm"
            >
              <Ionicons name="arrow-back" size={22} color={text} />
            </TouchableOpacity>

            <AppText variant="label" className="text-lg font-semibold">
              {headerTitle}
            </AppText>

            <View className="w-10" />
          </View>

          <ScrollView
            className="flex-1"
            contentContainerStyle={{
              flexGrow: 1,
              paddingHorizontal: 24,
              paddingTop: 40,
              paddingBottom: 60,
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View className="items-center mb-10">
              <View
                className={`w-20 h-20 rounded-2xl items-center justify-center mb-5 shadow-md ${
                  heroBgClass
                }`}
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
                      {email}
                    </AppText>
                    . Please check your inbox (and spam folder).
                  </>
                ) : (
                  "No worries. Enter your email and we'll send you a secure link to reset your password."
                )}
              </AppText>
            </View>

            {!sent ? (
              <View
                className={`bg-surface rounded-2xl border border-border/40 p-6 shadow-md gap-6`}
              >
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
                />

                <Button
                  text="Send Reset Link"
                  rightIcon="send-outline"
                  brand={brand}
                  loading={loading}
                  onPress={handleSubmit}
                  className="h-14 rounded-xl text-base font-semibold"
                  disabled={loading || !email.trim()}
                />
              </View>
            ) : (
              <View className="bg-surface rounded-2xl border border-border/40 p-6 shadow-md gap-6">
                <View className="gap-4">
                  {[
                    { n: "1", t: "Open the email from Mentally" },
                    { n: "2", t: "Tap the password reset link" },
                    { n: "3", t: "Create your new secure password" },
                  ].map((step) => (
                    <View key={step.n} className="flex-row items-start gap-3">
                      <View
                        className={`w-9 h-9 rounded-full bg-${brandSoft}/30 items-center justify-center flex-shrink-0 mt-0.5`}
                      >
                        <AppText
                          variant="stepNum"
                          className="text-base font-bold"
                        >
                          {step.n}
                        </AppText>
                      </View>
                      <AppText variant="stepText" className="flex-1 leading-6">
                        {step.t}
                      </AppText>
                    </View>
                  ))}
                </View>

                <Button
                  text="Enter New Password"
                  rightIcon="arrow-forward"
                  brand={brand}
                  onPress={() => router.push("/(auth)/reset-password")}
                  className="h-14 rounded-xl text-base font-semibold mt-2"
                />

                <TouchableOpacity
                  onPress={() => {
                    setSent(false);
                    setEmail("");
                  }}
                  className="items-center py-2"
                >
                  <AppText variant="body" className="text-sm">
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
            >
              <Ionicons name="arrow-back-outline" size={16} color={subtle} />
              <AppText variant="hint" className="font-medium">
                Back to Sign In
              </AppText>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
