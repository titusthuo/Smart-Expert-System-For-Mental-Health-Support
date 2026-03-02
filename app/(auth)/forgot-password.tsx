import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
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
  const {
    isDark,
    bg,
    surface,
    border,
    text,
    subtle,
    brand,
    brandSoft,
    error,
    errorSoft,
    success,
    successSoft,
  } = useAuthTheme();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const inputColors = { border, surface, text, subtle, error, errorSoft };

  const handleSubmit = () => {
    if (!email) {
      Alert.alert("Required", "Please enter your email address.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert("Invalid email", "Please enter a valid email address.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1500);
  };

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          {/* ── Header ── */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 20,
              paddingVertical: 12,
              borderBottomWidth: 1,
              borderBottomColor: border,
            }}
          >
            <TouchableOpacity
              onPress={() => router.back()}
              activeOpacity={0.7}
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: border,
                backgroundColor: surface,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="arrow-back" size={20} color={text} />
            </TouchableOpacity>
            <AppText variant="label" color={text} style={{ fontSize: 16 }}>
              {sent ? "Check Email" : "Reset Password"}
            </AppText>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              paddingHorizontal: 24,
              paddingTop: 32,
              paddingBottom: 40,
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {!sent ? (
              <>
                <View
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: 22,
                    backgroundColor: brandSoft,
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 24,
                  }}
                >
                  <Ionicons name="lock-open-outline" size={32} color={brand} />
                </View>

                <AppText
                  variant="heading"
                  color={text}
                  style={{ fontSize: 26 }}
                >
                  Forgot your password?
                </AppText>
                <AppText
                  variant="body"
                  color={subtle}
                  style={{ marginTop: 10, marginBottom: 28 }}
                >
                  No worries. Enter the email address linked to your account and
                  we will send you a secure reset link.
                </AppText>

                <View
                  style={{
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: border,
                    backgroundColor: surface,
                    padding: 20,
                    gap: 16,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.06,
                    shadowRadius: 16,
                    elevation: 4,
                  }}
                >
                  <Input
                    label="Email Address"
                    iconName="mail-outline"
                    placeholder="your@email.com"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    brand={brand}
                    colors={inputColors}
                  />
                  <Button
                    text="Send Reset Link"
                    rightIcon="send-outline"
                    brand={brand}
                    loading={loading}
                    onPress={handleSubmit}
                  />
                </View>
              </>
            ) : (
              <>
                <View
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: 22,
                    backgroundColor: successSoft,
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 24,
                  }}
                >
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={32}
                    color={success}
                  />
                </View>

                <AppText
                  variant="heading"
                  color={text}
                  style={{ fontSize: 26 }}
                >
                  Email sent!
                </AppText>
                <AppText
                  variant="body"
                  color={subtle}
                  style={{ marginTop: 10, marginBottom: 28 }}
                >
                  We have sent a reset link to{" "}
                  <AppText variant="link" color={text}>
                    {email}
                  </AppText>
                  . Check your inbox and follow the instructions.
                </AppText>

                <View
                  style={{
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: border,
                    backgroundColor: surface,
                    padding: 20,
                    gap: 16,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.06,
                    shadowRadius: 16,
                    elevation: 4,
                  }}
                >
                  {[
                    { n: "1", t: "Open the email from Mentally" },
                    { n: "2", t: "Tap the reset link in the email" },
                    { n: "3", t: "Choose a new secure password" },
                  ].map((s) => (
                    <View
                      key={s.n}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 12,
                      }}
                    >
                      <View
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 15,
                          backgroundColor: brandSoft,
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <AppText variant="stepNum" color={brand}>
                          {s.n}
                        </AppText>
                      </View>
                      <AppText
                        variant="stepText"
                        color={text}
                        style={{ flex: 1 }}
                      >
                        {s.t}
                      </AppText>
                    </View>
                  ))}

                  <Button
                    text="Enter New Password"
                    rightIcon="arrow-forward"
                    brand={brand}
                    onPress={() =>
                      router.push({ pathname: "/(auth)/reset-password" as any })
                    }
                  />

                  <TouchableOpacity
                    style={{ alignItems: "center", paddingVertical: 4 }}
                  >
                    <AppText
                      variant="body"
                      color={subtle}
                      style={{ fontSize: 13 }}
                    >
                      Wrong email?{" "}
                      <AppText
                        variant="link"
                        color={brand}
                        onPress={() => {
                          setSent(false);
                          setEmail("");
                        }}
                      >
                        Try again
                      </AppText>
                    </AppText>
                  </TouchableOpacity>
                </View>
              </>
            )}

            <TouchableOpacity
              onPress={() => router.push("/(auth)/sign-in")}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                marginTop: 28,
              }}
            >
              <Ionicons name="arrow-back-outline" size={15} color={subtle} />
              <AppText
                variant="hint"
                color={subtle}
                style={{ fontWeight: "500" }}
              >
                Back to Sign In
              </AppText>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
