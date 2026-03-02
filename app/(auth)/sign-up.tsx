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

import {
  AppText,
  Button,
  Input,
  PasswordRequirements,
  PasswordStrength,
  TabStrip,
} from "@/components/ui";
import { useAuthTheme } from "@/hooks/use-auth-theme";

type FormData = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  country: string;
  password: string;
  confirmPassword: string;
};

export default function SignUpScreen() {
  const router = useRouter();
  const {
    bg,
    surface,
    border,
    text,
    subtle,
    brand,
    error,
    errorSoft,
    success,
    warning,
    info,
  } = useAuthTheme();

  const [form, setForm] = useState<FormData>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    country: "",
    password: "",
    confirmPassword: "",
  });
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);

  const set = (k: keyof FormData, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const inputColors = { border, surface, text, subtle, error, errorSoft };

  const pwdMatch =
    form.confirmPassword.length > 0 && form.password === form.confirmPassword;
  const pwdMismatch =
    form.confirmPassword.length > 0 && form.password !== form.confirmPassword;

  const handleSignUp = () => {
    const {
      firstName,
      lastName,
      username,
      email,
      country,
      password,
      confirmPassword,
    } = form;
    if (
      !firstName ||
      !lastName ||
      !username ||
      !email ||
      !country ||
      !password ||
      !confirmPassword
    ) {
      Alert.alert("Missing fields", "Please fill in all required fields.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert(
        "Passwords do not match",
        "Please make sure both passwords are the same.",
      );
      return;
    }
    if (!canSubmit) {
      Alert.alert(
        "Weak password",
        "Please meet all the password requirements.",
      );
      return;
    }
    if (!terms) {
      Alert.alert("Terms required", "Please accept the terms to continue.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert("Account Created", "Welcome to Mentally!", [
        { text: "Get Started", onPress: () => router.replace("/(tabs)") },
      ]);
    }, 1500);
  };

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              paddingHorizontal: 24,
              paddingTop: 20,
              paddingBottom: 40,
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* ── Brand ── */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                marginBottom: 36,
              }}
            >
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 13,
                  backgroundColor: brand,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="pulse" size={22} color="#fff" />
              </View>
              <View>
                <AppText variant="brandName" color={text}>
                  Mentally
                </AppText>
                <AppText variant="brandSub" color={subtle}>
                  Mental Wellness Platform
                </AppText>
              </View>
            </View>

            {/* ── Heading ── */}
            <View style={{ marginBottom: 28 }}>
              <AppText variant="heading" color={text}>
                Create account
              </AppText>
              <AppText variant="subheading" color={subtle}>
                Join thousands finding better mental health
              </AppText>
            </View>

            {/* ── Card ── */}
            <View
              style={{
                borderRadius: 20,
                borderWidth: 1,
                borderColor: border,
                backgroundColor: surface,
                overflow: "hidden",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 16,
                elevation: 4,
              }}
            >
              <TabStrip
                activeKey="signUp"
                tabs={[
                  {
                    key: "signIn",
                    label: "Sign In",
                    onPress: () => router.push("/(auth)/sign-in"),
                  },
                  { key: "signUp", label: "Sign Up", onPress: () => {} },
                ]}
                colors={{ border, subtle, brand }}
              />

              <View style={{ padding: 20, gap: 14 }}>
                {/* ── Personal Info ── */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 2,
                  }}
                >
                  <Ionicons name="person-outline" size={13} color={subtle} />
                  <AppText variant="sectionLabel" color={subtle}>
                    Personal Info
                  </AppText>
                </View>

                {/* Name row */}
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <View style={{ flex: 1 }}>
                    <Input
                      label="First Name"
                      placeholder="John"
                      value={form.firstName}
                      onChangeText={(v) => set("firstName", v)}
                      autoCapitalize="words"
                      brand={brand}
                      colors={inputColors}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Input
                      label="Last Name"
                      placeholder="Doe"
                      value={form.lastName}
                      onChangeText={(v) => set("lastName", v)}
                      autoCapitalize="words"
                      brand={brand}
                      colors={inputColors}
                    />
                  </View>
                </View>

                <Input
                  label="Username"
                  iconName="at-outline"
                  hint="Used to sign in to your account"
                  placeholder="johndoe"
                  value={form.username}
                  onChangeText={(v) => set("username", v)}
                  autoCapitalize="none"
                  autoCorrect={false}
                  brand={brand}
                  colors={inputColors}
                />

                <Input
                  label="Email Address"
                  iconName="mail-outline"
                  placeholder="john@example.com"
                  value={form.email}
                  onChangeText={(v) => set("email", v)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  brand={brand}
                  colors={inputColors}
                />

                <Input
                  label="Country of Residence"
                  iconName="location-outline"
                  placeholder="e.g. Kenya"
                  value={form.country}
                  onChangeText={(v) => set("country", v)}
                  autoCapitalize="words"
                  brand={brand}
                  colors={inputColors}
                />

                {/* ── Account Security ── */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                    marginTop: 6,
                    marginBottom: 2,
                  }}
                >
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={13}
                    color={subtle}
                  />
                  <AppText variant="sectionLabel" color={subtle}>
                    Account Security
                  </AppText>
                </View>

                <View style={{ gap: 6 }}>
                  <Input
                    label="Password"
                    iconName="lock-closed-outline"
                    placeholder="Min. 8 characters"
                    value={form.password}
                    onChangeText={(v) => set("password", v)}
                    secureTextEntry
                    brand={brand}
                    colors={inputColors}
                  />
                  <PasswordStrength
                    password={form.password}
                    colors={{ border, error, success, warning, info }}
                  />
                </View>

                <View style={{ gap: 6 }}>
                  <Input
                    label="Confirm Password"
                    iconName="lock-closed-outline"
                    placeholder="Re-enter password"
                    value={form.confirmPassword}
                    onChangeText={(v) => set("confirmPassword", v)}
                    secureTextEntry
                    error={pwdMismatch ? "Passwords do not match" : undefined}
                    brand={brand}
                    colors={inputColors}
                  />
                  {pwdMatch && (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 5,
                      }}
                    >
                      <Ionicons
                        name="checkmark-circle"
                        size={13}
                        color={success}
                      />
                      <AppText variant="hint" color={success}>
                        Passwords match
                      </AppText>
                    </View>
                  )}
                </View>

                <PasswordRequirements
                  password={form.password}
                  colors={{ border, surface, subtle, success }}
                  onAllMet={setCanSubmit}
                />

                {/* ── Terms ── */}
                <TouchableOpacity
                  onPress={() => setTerms(!terms)}
                  activeOpacity={0.7}
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-start",
                    gap: 10,
                  }}
                >
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 6,
                      borderWidth: 1.5,
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: 1,
                      flexShrink: 0,
                      backgroundColor: terms ? brand : surface,
                      borderColor: terms ? brand : border,
                    }}
                  >
                    {terms && (
                      <Ionicons name="checkmark" size={11} color="#fff" />
                    )}
                  </View>
                  <AppText
                    variant="body"
                    color={subtle}
                    style={{ flex: 1, fontSize: 13, lineHeight: 20 }}
                  >
                    I agree to the{" "}
                    <AppText variant="link" color={brand}>
                      Terms of Service
                    </AppText>{" "}
                    and{" "}
                    <AppText variant="link" color={brand}>
                      Privacy Policy
                    </AppText>
                  </AppText>
                </TouchableOpacity>
              </View>

              <Button
                text="Create Account"
                rightIcon="arrow-forward"
                brand={brand}
                loading={loading}
                onPress={handleSignUp}
                style={{ marginHorizontal: 20, marginBottom: 20 }}
              />
            </View>

            {/* ── Footer ── */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: 4,
                marginTop: 24,
              }}
            >
              <AppText variant="body" color={subtle}>
                Already have an account?
              </AppText>
              <AppText
                variant="link"
                color={brand}
                onPress={() => router.push("/(auth)/sign-in")}
              >
                Sign In
              </AppText>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
