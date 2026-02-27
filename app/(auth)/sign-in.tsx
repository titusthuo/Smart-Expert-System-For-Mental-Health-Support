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

export default function SignInScreen() {
  const router = useRouter();
  const {
    isDark,
    bg,
    surface,
    border,
    text,
    subtle,
    brand,
  } = useAuthTheme();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const handleSignIn = () => {
    if (!username || !password) {
      Alert.alert("Missing fields", "Please enter your username and password.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.replace("/(tabs)");
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
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* ── Brand mark ── */}
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

            {/* ── Heading ── */}
            <View style={styles.headingBlock}>
              <Text style={[styles.heading, { color: text }]}>
                Welcome back
              </Text>
              <Text style={[styles.headingSub, { color: subtle }]}>
                Sign in to continue your wellness journey
              </Text>
            </View>

            {/* ── Card ── */}
            <View
              style={[
                styles.card,
                { backgroundColor: surface, borderColor: border },
              ]}
            >
              {/* Tab strip */}
              <View style={[styles.tabStrip, { borderBottomColor: border }]}>
                <View style={styles.tabActive}>
                  <Text style={[styles.tabActiveText, { color: brand }]}>
                    Sign In
                  </Text>
                  <View
                    style={[styles.tabUnderline, { backgroundColor: brand }]}
                  />
                </View>
                <TouchableOpacity
                  style={styles.tabInactive}
                  onPress={() => router.push("/(auth)/sign-up")}
                >
                  <Text style={[styles.tabInactiveText, { color: subtle }]}>
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.fields}>
                {/* Username */}
                <Field
                  label="Username"
                  icon="person-outline"
                  placeholder="johndoe"
                  value={username}
                  onChangeText={setUsername}
                  fieldKey="username"
                  focused={focused}
                  setFocused={setFocused}
                  autoCapitalize="none"
                  surface={surface}
                  border={border}
                  text={text}
                  subtle={subtle}
                  brand={brand}
                />

                {/* Password */}
                <View style={styles.fieldWrap}>
                  <View style={styles.labelRow}>
                    <Text style={[styles.label, { color: text }]}>
                      Password
                    </Text>
                    <TouchableOpacity
                      onPress={() => router.push("/(auth)/forgot-password")}
                    >
                      <Text style={[styles.forgotLink, { color: brand }]}>
                        Forgot?
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View
                    style={[
                      styles.inputBox,
                      {
                        borderColor: focused === "password" ? brand : border,
                        backgroundColor:
                          focused === "password" ? surface : surface,
                      },
                    ]}
                  >
                    <Ionicons
                      name="lock-closed-outline"
                      size={17}
                      color={focused === "password" ? brand : subtle}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={[styles.input, { color: text }]}
                      placeholder="••••••••"
                      placeholderTextColor={subtle}
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      onFocus={() => setFocused("password")}
                      onBlur={() => setFocused(null)}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeBtn}
                    >
                      <Ionicons
                        name={showPassword ? "eye-outline" : "eye-off-outline"}
                        size={17}
                        color={subtle}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* CTA */}
              <TouchableOpacity
                style={[
                  styles.cta,
                  { backgroundColor: brand },
                  loading && { opacity: 0.75 },
                ]}
                onPress={handleSignIn}
                disabled={loading}
                activeOpacity={0.88}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Text style={styles.ctaText}>Sign In</Text>
                    <Ionicons name="arrow-forward" size={18} color="#fff" />
                  </>
                )}
              </TouchableOpacity>

            </View>

            {/* Footer */}
            <TouchableOpacity
              style={styles.footer}
              onPress={() => router.push("/(auth)/sign-up")}
            >
              <Text style={[styles.footerText, { color: subtle }]}>
                New to Mentally?{" "}
                <Text style={[styles.footerLink, { color: brand }]}>
                  Create account
                </Text>
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

// ── Reusable Field ────────────────────────────────────────────────
function Field({
  label,
  icon,
  placeholder,
  value,
  onChangeText,
  fieldKey,
  focused,
  setFocused,
  autoCapitalize = "sentences",
  keyboardType = "default",
  surface,
  border,
  text,
  subtle,
  brand,
}: any) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={[styles.label, { color: text }]}>{label}</Text>
      <View
        style={[
          styles.inputBox,
          {
            borderColor: focused === fieldKey ? brand : border,
            backgroundColor: surface,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={17}
          color={focused === fieldKey ? brand : subtle}
          style={styles.inputIcon}
        />
        <TextInput
          style={[styles.input, { color: text }]}
          placeholder={placeholder}
          placeholderTextColor={subtle}
          value={value}
          onChangeText={onChangeText}
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          autoCorrect={false}
          onFocus={() => setFocused(fieldKey)}
          onBlur={() => setFocused(null)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safeArea: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },

  // Brand
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
  brandName: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  brandSub: {
    fontSize: 11,
    marginTop: 1,
    letterSpacing: 0.2,
  },

  // Heading
  headingBlock: { marginBottom: 28 },
  heading: {
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: -0.8,
    lineHeight: 36,
  },
  headingSub: {
    fontSize: 14,
    marginTop: 6,
    lineHeight: 20,
  },

  // Card
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

  // Tabs
  tabStrip: {
    flexDirection: "row",
    borderBottomWidth: 1,
  },
  tabActive: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
    position: "relative",
  },
  tabActiveText: {
    fontSize: 14,
    fontWeight: "700",
  },
  tabUnderline: {
    position: "absolute",
    bottom: -1,
    left: "20%",
    right: "20%",
    height: 2,
    borderRadius: 1,
  },
  tabInactive: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
  },
  tabInactiveText: {
    fontSize: 14,
    fontWeight: "500",
  },

  // Fields
  fields: { padding: 20, gap: 16 },
  fieldWrap: { gap: 7 },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.1,
  },
  forgotLink: {
    fontSize: 13,
    fontWeight: "600",
  },
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

  // CTA
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

  // Footer
  footer: { alignItems: "center", marginTop: 24 },
  footerText: { fontSize: 14 },
  footerLink: { fontWeight: "700" },
});
