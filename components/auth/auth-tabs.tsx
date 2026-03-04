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
  Card,
  Input,
  PasswordRequirements,
  PasswordStrength,
  TabStrip,
} from "@/components/ui";
import { useColorScheme } from "@/hooks/use-color-scheme";

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
  const scheme = useColorScheme() ?? "light";
  const isDark = scheme === "dark";

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
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <ScrollView
            contentContainerClassName="flex-grow px-6 pt-5 pb-10"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* ── Brand ── */}
            <View className="flex-row items-center gap-3 mb-9">
              <View className="w-11 h-11 rounded-full items-center justify-center">
                <Image
                  source={logoImage}
                  className="w-7 h-7 rounded-full"
                  resizeMode="contain"
                  accessibilityLabel="Mentally logo"
                />
              </View>
              <View>
                <AppText variant="brandName">Mentally</AppText>
                <AppText variant="brandSub">Mental Wellness Platform</AppText>
              </View>
            </View>

            {/* ── Heading ── */}
            <View className="mb-7">
              {activeTab === "signIn" ? (
                <>
                  <AppText variant="heading">Welcome back</AppText>
                  <AppText variant="subheading">
                    Sign in to continue your wellness journey
                  </AppText>
                </>
              ) : (
                <>
                  <AppText variant="heading">Create account</AppText>
                  <AppText variant="subheading">
                    Join thousands finding better mental health
                  </AppText>
                </>
              )}
            </View>

            {/* ── Card ── */}
            <Card>
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
              />

              {activeTab === "signIn" ? (
                <View className="p-5 gap-4">
                  <Input
                    label="Username"
                    iconName="person-outline"
                    placeholder="johndoe"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />

                  <Input
                    label="Password"
                    iconName="lock-closed-outline"
                    placeholder="••••••••"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />

                  <AppText
                    variant="link"
                    style={{ textAlign: "right", marginTop: -4 }}
                    onPress={() => router.push("/(auth)/forgot-password")}
                  >
                    Forgot password?
                  </AppText>

                  <Button
                    text="Sign In"
                    rightIcon="arrow-forward"
                    loading={signInLoading}
                    onPress={handleSignIn}
                    className="mt-2"
                  />
                </View>
              ) : (
                <View className="p-5 gap-3.5">
                  {/* ── Personal Info ── */}
                  <View className="flex-row items-center gap-1.5 mb-1">
                    <AppText variant="sectionLabel">Personal Info</AppText>
                  </View>

                  {/* Name row */}
                  <View className="flex-row gap-2.5">
                    <View className="flex-1">
                      <Input
                        label="First Name"
                        placeholder="John"
                        value={form.firstName}
                        onChangeText={(v) => setField("firstName", v)}
                        autoCapitalize="words"
                      />
                    </View>
                    <View className="flex-1">
                      <Input
                        label="Last Name"
                        placeholder="Doe"
                        value={form.lastName}
                        onChangeText={(v) => setField("lastName", v)}
                        autoCapitalize="words"
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
                  />

                  <Input
                    label="Country of Residence"
                    iconName="location-outline"
                    placeholder="e.g. Kenya"
                    value={form.country}
                    onChangeText={(v) => setField("country", v)}
                    autoCapitalize="words"
                  />

                  {/* ── Account Security ── */}
                  <View className="flex-row items-center gap-1.5 mt-2 mb-1">
                    <AppText variant="sectionLabel">Account Security</AppText>
                  </View>

                  <View className="gap-1.5">
                    <Input
                      label="Password"
                      iconName="lock-closed-outline"
                      placeholder="Min. 8 characters"
                      value={form.password}
                      onChangeText={(v) => setField("password", v)}
                      secureTextEntry
                    />
                    <PasswordStrength password={form.password} />
                  </View>

                  <View className="gap-1.5">
                    <Input
                      label="Confirm Password"
                      iconName="lock-closed-outline"
                      placeholder="Re-enter password"
                      value={form.confirmPassword}
                      onChangeText={(v) => setField("confirmPassword", v)}
                      secureTextEntry
                      error={pwdMismatch ? "Passwords do not match" : undefined}
                    />
                    {pwdMatch && (
                      <AppText variant="hint" className="text-success">
                        Passwords match
                      </AppText>
                    )}
                  </View>

                  <PasswordRequirements
                    password={form.password}
                    onAllMet={setCanSubmit}
                  />

                  {/* ── Terms ── */}
                  <TouchableOpacity
                    onPress={() => setTerms(!terms)}
                    activeOpacity={0.7}
                    className="flex-row items-start gap-2.5"
                  >
                    <View
                      className={[
                        "w-5 h-5 rounded-md border-2 items-center justify-center mt-[1px] flex-shrink-0",
                        terms
                          ? "bg-brand border-brand"
                          : "bg-card border-border",
                      ].join(" ")}
                    >
                      {terms && (
                        <AppText variant="hint" className="text-white">
                          ✓
                        </AppText>
                      )}
                    </View>
                    <AppText
                      variant="body"
                      className="flex-1 text-[13px] leading-[20px] text-muted-foreground"
                    >
                      I agree to the{" "}
                      <AppText variant="link">Terms of Service</AppText> and{" "}
                      <AppText variant="link">Privacy Policy</AppText>
                    </AppText>
                  </TouchableOpacity>

                  <Button
                    text="Create Account"
                    rightIcon="arrow-forward"
                    loading={signUpLoading}
                    onPress={handleSignUp}
                    className="mt-3"
                  />
                </View>
              )}
            </Card>

            {/* ── Footer ─*/}
            <View className="flex-row justify-center items-center gap-1 mt-6">
              {activeTab === "signIn" ? (
                <>
                  <AppText variant="body" className="text-muted-foreground">
                    New to Mentally?
                  </AppText>
                  <AppText
                    variant="link"
                    onPress={() => setActiveTab("signUp")}
                  >
                    Create account
                  </AppText>
                </>
              ) : (
                <>
                  <AppText variant="body" className="text-muted-foreground">
                    Already have an account?
                  </AppText>
                  <AppText
                    variant="link"
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
