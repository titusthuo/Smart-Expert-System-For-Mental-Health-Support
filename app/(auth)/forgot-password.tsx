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
    success,
    successSoft,
  } = useAuthTheme();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [focused, setFocused] = useState(false);

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
    <View style={[styles.root, { backgroundColor: bg }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: border }]}>
            <TouchableOpacity
              style={[
                styles.backBtn,
                { backgroundColor: surface, borderColor: border },
              ]}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={20} color={text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: text }]}>
              {sent ? "Check Email" : "Reset Password"}
            </Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {!sent ? (
              <>
                {/* Icon */}
                <View
                  style={[styles.iconWrap, { backgroundColor: brandSoft }]}
                >
                  <Ionicons name="lock-open-outline" size={32} color={brand} />
                </View>

                <Text style={[styles.title, { color: text }]}>
                  Forgot your password?
                </Text>
                <Text style={[styles.body, { color: subtle }]}>
                  No worries. Enter the email address linked to your account and
                  we will send you a secure reset link.
                </Text>

                {/* Card */}
                <View
                  style={[
                    styles.card,
                    { backgroundColor: surface, borderColor: border },
                  ]}
                >
                  <View style={styles.fieldWrap}>
                    <Text style={[styles.label, { color: text }]}>
                      Email Address
                    </Text>
                    <View
                      style={[
                        styles.inputBox,
                        {
                          borderColor: focused ? brand : border,
                          backgroundColor: surface,
                        },
                      ]}
                    >
                      <Ionicons
                        name="mail-outline"
                        size={17}
                        color={focused ? brand : subtle}
                        style={styles.inputIcon}
                      />
                      <TextInput
                        style={[styles.input, { color: text }]}
                        placeholder="your@email.com"
                        placeholderTextColor={subtle}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                      />
                    </View>
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.cta,
                      { backgroundColor: brand },
                      loading && { opacity: 0.75 },
                    ]}
                    onPress={handleSubmit}
                    disabled={loading}
                    activeOpacity={0.88}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <>
                        <Text style={styles.ctaText}>Send Reset Link</Text>
                        <Ionicons name="send-outline" size={16} color="#fff" />
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                {/* Success icon */}
                <View style={[styles.iconWrap, { backgroundColor: successSoft }]}>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={32}
                    color={success}
                  />
                </View>

                <Text style={[styles.title, { color: text }]}>Email sent!</Text>
                <Text style={[styles.body, { color: subtle }]}>
                  We have sent a reset link to{" "}
                  <Text style={{ color: text, fontWeight: "700" }}>
                    {email}
                  </Text>
                  . Check your inbox and follow the instructions.
                </Text>

                {/* Steps card */}
                <View
                  style={[
                    styles.card,
                    { backgroundColor: surface, borderColor: border },
                  ]}
                >
                  {[
                    { n: "1", t: "Open the email from Mentally" },
                    { n: "2", t: "Tap the reset link in the email" },
                    { n: "3", t: "Choose a new secure password" },
                  ].map((s) => (
                    <View key={s.n} style={styles.stepRow}>
                      <View
                        style={[
                          styles.stepNum,
                          { backgroundColor: brandSoft },
                        ]}
                      >
                        <Text style={[styles.stepNumText, { color: brand }]}>
                          {s.n}
                        </Text>
                      </View>
                      <Text style={[styles.stepText, { color: text }]}>
                        {s.t}
                      </Text>
                    </View>
                  ))}

                  <TouchableOpacity
                    style={[styles.cta, { backgroundColor: brand }]}
                    onPress={() =>
                      router.push({ pathname: "/(auth)/reset-password" as any })
                    }
                    activeOpacity={0.88}
                  >
                    <Text style={styles.ctaText}>Enter New Password</Text>
                    <Ionicons name="arrow-forward" size={16} color="#fff" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.secondaryBtn}
                    onPress={() => {
                      setSent(false);
                      setEmail("");
                    }}
                  >
                    <Text style={[styles.secondaryBtnText, { color: subtle }]}>
                      Wrong email?{" "}
                      <Text style={{ color: brand, fontWeight: "700" }}>
                        Try again
                      </Text>
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            <TouchableOpacity
              style={styles.backToSignIn}
              onPress={() => router.push("/(auth)/sign-in")}
            >
              <Ionicons name="arrow-back-outline" size={15} color={subtle} />
              <Text style={[styles.backToSignInText, { color: subtle }]}>
                Back to Sign In
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safeArea: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 16, fontWeight: "700" },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    alignSelf: "flex-start",
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.6,
    marginBottom: 10,
  },
  body: { fontSize: 14, lineHeight: 22, marginBottom: 28 },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
    gap: 16,
  },
  fieldWrap: { gap: 7 },
  label: { fontSize: 13, fontWeight: "600" },
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
  cta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 52,
    borderRadius: 13,
  },
  ctaText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.2,
  },
  stepRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  stepNum: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  stepNumText: { fontSize: 13, fontWeight: "800" },
  stepText: { fontSize: 14, flex: 1, lineHeight: 20 },
  secondaryBtn: { alignItems: "center", paddingVertical: 4 },
  secondaryBtnText: { fontSize: 13 },
  backToSignIn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 28,
  },
  backToSignInText: { fontSize: 13, fontWeight: "500" },
});
