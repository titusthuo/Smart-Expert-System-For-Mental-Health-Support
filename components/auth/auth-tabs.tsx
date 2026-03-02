import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
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

type AuthTabsProps = {
  initialTab: "signIn" | "signUp";
};

export function AuthTabsScreen({ initialTab }: AuthTabsProps) {
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
    warning,
    info,
  } = useAuthTheme();

  const logoImage = require("../../assets/logos/brain.jpg");

  const [activeTab, setActiveTab] = useState<"signIn" | "signUp">(initialTab);

  // Sign in state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [signInLoading, setSignInLoading] = useState(false);

  // Sign up state
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
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);

  const setField = (k: keyof FormData, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const inputColors = { border, surface, text, subtle, error, errorSoft };

  const pwdMatch =
    form.confirmPassword.length > 0 && form.password === form.confirmPassword;
  const pwdMismatch =
    form.confirmPassword.length > 0 && form.password !== form.confirmPassword;

  const handleSignIn = () => {
    if (!username || !password) {
      Alert.alert("Missing fields", "Please enter your username and password.");
      return;
    }
    setSignInLoading(true);
    setTimeout(() => {
      setSignInLoading(false);
      router.replace("/(tabs)");
    }, 1500);
  };

  const handleSignUp = () => {
    const {
      firstName,
      lastName,
      username: uname,
      email,
      country,
      password: pwd,
      confirmPassword,
    } = form;
    if (
      !firstName ||
      !lastName ||
      !uname ||
      !email ||
      !country ||
      !pwd ||
      !confirmPassword
    ) {
      Alert.alert("Missing fields", "Please fill in all required fields.");
      return;
    }
    if (pwd !== confirmPassword) {
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
    setSignUpLoading(true);
    setTimeout(() => {
      setSignUpLoading(false);
      Alert.alert("Account Created", "Welcome to Mentally!", [
        { text: "Get Started", onPress: () => router.replace("/(tabs)") },
      ]);
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
                  borderRadius: 22,
                  backgroundColor: brandSoft,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  source={logoImage}
                  style={{ width: 28, height: 28, borderRadius: 14 }}
                  resizeMode="contain"
                  accessibilityLabel="Mentally logo"
                />
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
              {activeTab === "signIn" ? (
                <>
                  <AppText variant="heading" color={text}>
                    Welcome back
                  </AppText>
                  <AppText variant="subheading" color={subtle}>
                    Sign in to continue your wellness journey
                  </AppText>
                </>
              ) : (
                <>
                  <AppText variant="heading" color={text}>
                    Create account
                  </AppText>
                  <AppText variant="subheading" color={subtle}>
                    Join thousands finding better mental health
                  </AppText>
                </>
              )}
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
                activeKey={activeTab}
                tabs={[
                  {
                    key: "signIn",
                    label: "Sign In",
                    onPress: () => setActiveTab("signIn"),
                  },
                  {
                    key: "signUp",
                    label: "Sign Up",
                    onPress: () => setActiveTab("signUp"),
                  },
                ]}
                colors={{ border, subtle, brand }}
              />

              {activeTab === "signIn" ? (
                <View style={{ padding: 20, gap: 16 }}>
                  <Input
                    label="Username"
                    iconName="person-outline"
                    placeholder="johndoe"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                    autoCorrect={false}
                    brand={brand}
                    colors={inputColors}
                  />

                  <Input
                    label="Password"
                    iconName="lock-closed-outline"
                    placeholder="••••••••"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    brand={brand}
                    colors={inputColors}
                  />

                  <AppText
                    variant="link"
                    color={brand}
                    style={{ textAlign: "right", marginTop: -4 }}
                    onPress={() => router.push("/(auth)/forgot-password")}
                  >
                    Forgot password?
                  </AppText>

                  <Button
                    text="Sign In"
                    rightIcon="arrow-forward"
                    brand={brand}
                    loading={signInLoading}
                    onPress={handleSignIn}
                    style={{ marginTop: 8 }}
                  />
                </View>
              ) : (
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
                        onChangeText={(v) => setField("firstName", v)}
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
                        onChangeText={(v) => setField("lastName", v)}
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
                    onChangeText={(v) => setField("username", v)}
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
                    onChangeText={(v) => setField("email", v)}
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
                    onChangeText={(v) => setField("country", v)}
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
                      onChangeText={(v) => setField("password", v)}
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
                      onChangeText={(v) => setField("confirmPassword", v)}
                      secureTextEntry
                      error={pwdMismatch ? "Passwords do not match" : undefined}
                      brand={brand}
                      colors={inputColors}
                    />
                    {pwdMatch && (
                      <AppText variant="hint" color={success}>
                        Passwords match
                      </AppText>
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
                        <AppText variant="hint" color="#fff">
                          ✓
                        </AppText>
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

                  <Button
                    text="Create Account"
                    rightIcon="arrow-forward"
                    brand={brand}
                    loading={signUpLoading}
                    onPress={handleSignUp}
                    style={{ marginTop: 12 }}
                  />
                </View>
              )}
            </View>

            {/* ── Footer ─*/}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: 4,
                marginTop: 24,
              }}
            >
              {activeTab === "signIn" ? (
                <>
                  <AppText variant="body" color={subtle}>
                    New to Mentally?
                  </AppText>
                  <AppText
                    variant="link"
                    color={brand}
                    onPress={() => setActiveTab("signUp")}
                  >
                    Create account
                  </AppText>
                </>
              ) : (
                <>
                  <AppText variant="body" color={subtle}>
                    Already have an account?
                  </AppText>
                  <AppText
                    variant="link"
                    color={brand}
                    onPress={() => setActiveTab("signIn")}
                  >
                    Sign In
                  </AppText>
                </>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

