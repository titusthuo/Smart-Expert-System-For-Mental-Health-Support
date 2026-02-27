import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const set = (k: keyof FormData, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const strength = (() => {
    const p = form.password;
    if (!p) return null;
    const s = [/[a-z]/, /[A-Z]/, /\d/, /[^a-zA-Z0-9]/].filter((r) =>
      r.test(p),
    ).length;
    if (p.length < 6) return { level: 1, label: "Too short", color: error };
    if (s <= 2) return { level: 2, label: "Weak", color: error };
    if (s === 3) return { level: 3, label: "Good", color: success };
    return { level: 4, label: "Strong", color: success };
  })();

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
    if (password.length < 8) {
      Alert.alert("Weak password", "Password must be at least 8 characters.");
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

  // Shared input box style
  const box = (key: string, hasError = false) => ({
    borderColor: hasError ? error : focused === key ? brand : border,
    backgroundColor: hasError ? errorSoft : surface,
  });

  return (
    <View style={[styles.root, { backgroundColor: bg }]}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Brand */}
              <View style={styles.brandRow}>
              <View style={[styles.logoMark, { backgroundColor: brand }]}>
                <Ionicons name="pulse" size={22} color="#fff" />
              </View>
              <View>
                <Text style={[styles.brandName, { color: text }]}>
                  Mentally
                </Text>
                <Text style={[styles.brandSub, { color: subtle }]}>
                  Mental Wellness Platform
                </Text>
              </View>
            </View>

            {/* Heading */}
            <View style={styles.headingBlock}>
              <Text style={[styles.heading, { color: text }]}>
                Create account
              </Text>
              <Text style={[styles.headingSub, { color: subtle }]}>
                Join thousands finding better mental health
              </Text>
            </View>

            {/* Card */}
            <View
              style={[
                styles.card,
                { backgroundColor: surface, borderColor: border },
              ]}
            >
              {/* Tabs */}
              <View style={[styles.tabStrip, { borderBottomColor: border }]}>
                <TouchableOpacity
                  style={styles.tabInactive}
                  onPress={() => router.push("/(auth)/sign-in")}
                >
                  <Text style={[styles.tabInactiveText, { color: subtle }]}>
                    Sign In
                  </Text>
                </TouchableOpacity>
                <View style={styles.tabActive}>
                  <Text style={[styles.tabActiveText, { color: brand }]}>
                    Sign Up
                  </Text>
                  <View
                    style={[styles.tabUnderline, { backgroundColor: brand }]}
                  />
                </View>
              </View>

              <View style={styles.formBody}>
                {/* ── Section: Personal ── */}
                <SectionLabel
                  icon="person-outline"
                  label="Personal Info"
                  subtle={subtle}
                />

                {/* Name row */}
                <View style={styles.nameRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.label, { color: text }]}>
                      First Name
                    </Text>
                    <View style={[styles.inputBox, box("firstName")]}>
                      <TextInput
                        style={[styles.input, { color: text }]}
                        placeholder="John"
                        placeholderTextColor={subtle}
                        value={form.firstName}
                        onChangeText={(v) => set("firstName", v)}
                        autoCapitalize="words"
                        onFocus={() => setFocused("firstName")}
                        onBlur={() => setFocused(null)}
                      />
                    </View>
                  </View>
                  <View style={{ width: 10 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.label, { color: text }]}>
                      Last Name
                    </Text>
                    <View style={[styles.inputBox, box("lastName")]}>
                      <TextInput
                        style={[styles.input, { color: text }]}
                        placeholder="Doe"
                        placeholderTextColor={subtle}
                        value={form.lastName}
                        onChangeText={(v) => set("lastName", v)}
                        autoCapitalize="words"
                        onFocus={() => setFocused("lastName")}
                        onBlur={() => setFocused(null)}
                      />
                    </View>
                  </View>
                </View>

                {/* Username */}
                <View style={styles.fieldWrap}>
                  <Text style={[styles.label, { color: text }]}>Username</Text>
                  <View style={[styles.inputBox, box("username")]}>
                    <Ionicons
                      name="at-outline"
                      size={17}
                      color={focused === "username" ? brand : subtle}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={[styles.input, { color: text }]}
                      placeholder="johndoe"
                      placeholderTextColor={subtle}
                      value={form.username}
                      onChangeText={(v) => set("username", v)}
                      autoCapitalize="none"
                      autoCorrect={false}
                      onFocus={() => setFocused("username")}
                      onBlur={() => setFocused(null)}
                    />
                  </View>
                  <Text style={[styles.hint, { color: subtle }]}>
                    Used to sign in to your account
                  </Text>
                </View>

                {/* Email */}
                <View style={styles.fieldWrap}>
                  <Text style={[styles.label, { color: text }]}>
                    Email Address
                  </Text>
                  <View style={[styles.inputBox, box("email")]}>
                    <Ionicons
                      name="mail-outline"
                      size={17}
                      color={focused === "email" ? brand : subtle}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={[styles.input, { color: text }]}
                      placeholder="john@example.com"
                      placeholderTextColor={subtle}
                      value={form.email}
                      onChangeText={(v) => set("email", v)}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      onFocus={() => setFocused("email")}
                      onBlur={() => setFocused(null)}
                    />
                  </View>
                </View>

                {/* Country */}
                <View style={styles.fieldWrap}>
                  <Text style={[styles.label, { color: text }]}>
                    Country of Residence
                  </Text>
                  <View style={[styles.inputBox, box("country")]}>
                    <Ionicons
                      name="location-outline"
                      size={17}
                      color={focused === "country" ? brand : subtle}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={[styles.input, { color: text }]}
                      placeholder="e.g. Kenya"
                      placeholderTextColor={subtle}
                      value={form.country}
                      onChangeText={(v) => set("country", v)}
                      autoCapitalize="words"
                      onFocus={() => setFocused("country")}
                      onBlur={() => setFocused(null)}
                    />
                  </View>
                </View>

                {/* ── Section: Security ── */}
                <SectionLabel
                  icon="shield-checkmark-outline"
                  label="Account Security"
                  subtle={subtle}
                />

                {/* Password */}
                <View style={styles.fieldWrap}>
                  <Text style={[styles.label, { color: text }]}>Password</Text>
                  <View style={[styles.inputBox, box("password")]}>
                    <Ionicons
                      name="lock-closed-outline"
                      size={17}
                      color={focused === "password" ? brand : subtle}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={[styles.input, { color: text }]}
                      placeholder="Min. 8 characters"
                      placeholderTextColor={subtle}
                      value={form.password}
                      onChangeText={(v) => set("password", v)}
                      secureTextEntry={!showPwd}
                      onFocus={() => setFocused("password")}
                      onBlur={() => setFocused(null)}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPwd(!showPwd)}
                      style={styles.eyeBtn}
                    >
                      <Ionicons
                        name={showPwd ? "eye-outline" : "eye-off-outline"}
                        size={17}
                        color={subtle}
                      />
                    </TouchableOpacity>
                  </View>
                  {strength && (
                    <View style={styles.strengthRow}>
                      <View style={styles.strengthBars}>
                        {[1, 2, 3, 4].map((i) => (
                          <View
                            key={i}
                            style={[
                              styles.strengthBar,
                              {
                                backgroundColor:
                                  i <= strength.level ? strength.color : border,
                              },
                            ]}
                          />
                        ))}
                      </View>
                      <Text
                        style={[
                          styles.strengthLabel,
                          { color: strength.color },
                        ]}
                      >
                        {strength.label}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Confirm Password */}
                <View style={styles.fieldWrap}>
                  <Text style={[styles.label, { color: text }]}>
                    Confirm Password
                  </Text>
                  <View
                    style={[
                      styles.inputBox,
                      box("confirmPassword", pwdMismatch),
                    ]}
                  >
                    <Ionicons
                      name="lock-closed-outline"
                      size={17}
                      color={
                        pwdMismatch
                          ? error
                          : focused === "confirmPassword"
                            ? brand
                            : subtle
                      }
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={[styles.input, { color: text }]}
                      placeholder="Re-enter password"
                      placeholderTextColor={subtle}
                      value={form.confirmPassword}
                      onChangeText={(v) => set("confirmPassword", v)}
                      secureTextEntry={!showConfirm}
                      onFocus={() => setFocused("confirmPassword")}
                      onBlur={() => setFocused(null)}
                    />
                    <TouchableOpacity
                      onPress={() => setShowConfirm(!showConfirm)}
                      style={styles.eyeBtn}
                    >
                      <Ionicons
                        name={showConfirm ? "eye-outline" : "eye-off-outline"}
                        size={17}
                        color={subtle}
                      />
                    </TouchableOpacity>
                  </View>
                  {pwdMismatch && (
                    <View style={styles.validRow}>
                      <Ionicons name="close-circle" size={13} color={error} />
                      <Text style={[styles.validText, { color: error }]}>
                        Passwords do not match
                      </Text>
                    </View>
                  )}
                  {pwdMatch && (
                    <View style={styles.validRow}>
                      <Ionicons
                        name="checkmark-circle"
                        size={13}
                        color={success}
                      />
                      <Text style={[styles.validText, { color: success }]}>
                        Passwords match
                      </Text>
                    </View>
                  )}
                </View>

                {/* Requirements */}
                <View
                  style={[
                    styles.reqBox,
                    {
                      backgroundColor: surface,
                      borderColor: border,
                    },
                  ]}
                >
                  {[
                    {
                      label: "At least 8 characters",
                      met: form.password.length >= 8,
                    },
                    {
                      label: "Uppercase letter (A–Z)",
                      met: /[A-Z]/.test(form.password),
                    },
                    {
                      label: "Lowercase letter (a–z)",
                      met: /[a-z]/.test(form.password),
                    },
                    { label: "Number (0–9)", met: /\d/.test(form.password) },
                  ].map((r, i) => (
                    <View key={i} style={styles.reqRow}>
                      <Ionicons
                        name={r.met ? "checkmark-circle" : "ellipse-outline"}
                        size={14}
                        color={r.met ? success : subtle}
                      />
                      <Text
                        style={[
                          styles.reqText,
                          {
                            color: r.met ? success : subtle,
                            fontWeight: r.met ? "600" : "400",
                          },
                        ]}
                      >
                        {r.label}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Terms */}
                <TouchableOpacity
                  style={styles.termsRow}
                  onPress={() => setTerms(!terms)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.checkbox,
                      {
                        backgroundColor: terms ? brand : surface,
                        borderColor: terms ? brand : border,
                      },
                    ]}
                  >
                    {terms && (
                      <Ionicons name="checkmark" size={11} color="#fff" />
                    )}
                  </View>
                    <Text style={[styles.termsText, { color: subtle }]}>
                    I agree to the{" "}
                    <Text style={{ color: brand, fontWeight: "700" }}>
                      Terms of Service
                    </Text>{" "}
                    and{" "}
                    <Text style={{ color: brand, fontWeight: "700" }}>
                      Privacy Policy
                    </Text>
                  </Text>
                </TouchableOpacity>
              </View>

              {/* CTA */}
              <TouchableOpacity
                style={[
                  styles.cta,
                  { backgroundColor: brand },
                  loading && { opacity: 0.75 },
                ]}
                onPress={handleSignUp}
                disabled={loading}
                activeOpacity={0.88}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Text style={styles.ctaText}>Create Account</Text>
                    <Ionicons name="arrow-forward" size={18} color="#fff" />
                  </>
                )}
              </TouchableOpacity>

            </View>

            {/* Footer */}
            <TouchableOpacity
              style={styles.footer}
              onPress={() => router.push("/(auth)/sign-in")}
            >
              <Text style={[styles.footerText, { color: subtle }]}>
                Already have an account?{" "}
                <Text style={{ color: brand, fontWeight: "700" }}>Sign In</Text>
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

function SectionLabel({ icon, label, subtle }: any) {
  return (
    <View style={secStyles.row}>
      <Ionicons name={icon} size={13} color={subtle} />
      <Text style={[secStyles.text, { color: subtle }]}>{label}</Text>
    </View>
  );
}

const secStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 14,
    marginTop: 6,
  },
  text: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
});

const styles = StyleSheet.create({
  root: { flex: 1 },
  safeArea: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 36,
  },
  logoMark: {
    width: 44,
    height: 44,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  brandName: { fontSize: 18, fontWeight: "700", letterSpacing: -0.3 },
  brandSub: { fontSize: 11, marginTop: 1, letterSpacing: 0.2 },
  headingBlock: { marginBottom: 28 },
  heading: {
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: -0.8,
    lineHeight: 36,
  },
  headingSub: { fontSize: 14, marginTop: 6, lineHeight: 20 },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
  },
  tabStrip: { flexDirection: "row", borderBottomWidth: 1 },
  tabActive: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
    position: "relative",
  },
  tabActiveText: { fontSize: 14, fontWeight: "700" },
  tabUnderline: {
    position: "absolute",
    bottom: -1,
    left: "20%",
    right: "20%",
    height: 2,
    borderRadius: 1,
  },
  tabInactive: { flex: 1, alignItems: "center", paddingVertical: 14 },
  tabInactiveText: { fontSize: 14, fontWeight: "500" },
  formBody: { padding: 20, gap: 14 },
  nameRow: { flexDirection: "row" },
  fieldWrap: { gap: 6 },
  label: { fontSize: 13, fontWeight: "600", letterSpacing: 0.1 },
  hint: { fontSize: 11, lineHeight: 15 },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 13,
    height: 50,
  },
  inputIcon: { marginRight: 9 },
  input: { flex: 1, fontSize: 15 },
  eyeBtn: { padding: 4 },
  detectBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
  },
  detectBtnText: { fontSize: 12, fontWeight: "700" },
  strengthRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 7,
  },
  strengthBars: { flex: 1, flexDirection: "row", gap: 3 },
  strengthBar: { flex: 1, height: 3, borderRadius: 2 },
  strengthLabel: {
    fontSize: 11,
    fontWeight: "700",
    minWidth: 50,
    textAlign: "right",
  },
  validRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 5,
  },
  validText: { fontSize: 12, fontWeight: "500" },
  reqBox: { borderWidth: 1, borderRadius: 12, padding: 14, gap: 8 },
  reqRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  reqText: { fontSize: 12 },
  termsRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
    flexShrink: 0,
  },
  termsText: { flex: 1, fontSize: 13, lineHeight: 20 },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginHorizontal: 20,
    marginBottom: 20,
    height: 52,
    borderRadius: 13,
  },
  ctaText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.2,
  },
  footer: { alignItems: "center", marginTop: 24 },
  footerText: { fontSize: 14 },
});
