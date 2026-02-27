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

export default function ResetPasswordScreen() {
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
    successNoteBg,
    successNoteBorder,
    warning,
    info,
  } = useAuthTheme();

  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);

  const reqs = [
    { label: "At least 8 characters", met: newPwd.length >= 8 },
    { label: "Uppercase letter (A–Z)", met: /[A-Z]/.test(newPwd) },
    { label: "Lowercase letter (a–z)", met: /[a-z]/.test(newPwd) },
    { label: "Number (0–9)", met: /\d/.test(newPwd) },
  ];
  const allMet = reqs.every((r) => r.met);

  const strength = (() => {
    if (!newPwd) return null;
    const s = [/[a-z]/, /[A-Z]/, /\d/, /[^a-zA-Z0-9]/].filter((r) =>
      r.test(newPwd),
    ).length;
    if (newPwd.length < 6)
      return { level: 1, label: "Too short", color: error };
    if (s <= 2) return { level: 2, label: "Weak", color: warning };
    if (s === 3) return { level: 3, label: "Good", color: info };
    return { level: 4, label: "Strong", color: success };
  })();

  const pwdMatch = confirmPwd.length > 0 && newPwd === confirmPwd;
  const pwdMismatch = confirmPwd.length > 0 && newPwd !== confirmPwd;

  const handleReset = () => {
    if (!newPwd || !confirmPwd) {
      Alert.alert("Missing fields", "Please fill in both password fields.");
      return;
    }
    if (!allMet) {
      Alert.alert(
        "Password too weak",
        "Please meet all the password requirements.",
      );
      return;
    }
    if (newPwd !== confirmPwd) {
      Alert.alert("Mismatch", "Passwords do not match.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setResetSuccess(true);
    }, 1500);
  };

  const box = (key: string, hasError = false) => ({
    borderColor: hasError ? error : focused === key ? brand : border,
    backgroundColor: hasError ? errorSoft : surface,
  });

  return (
    <View style={[styles.root, { backgroundColor: bg }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          {/* Header */}
          {!resetSuccess && (
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
                New Password
              </Text>
              <View style={{ width: 40 }} />
            </View>
          )}

          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {!resetSuccess ? (
              <>
                {/* Icon */}
                <View
                  style={[styles.iconWrap, { backgroundColor: brandSoft }]}
                >
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={32}
                    color={brand}
                  />
                </View>

                <Text style={[styles.title, { color: text }]}>
                  Create new password
                </Text>
                <Text style={[styles.body, { color: subtle }]}>
                  Your new password must be different from any previously used
                  passwords.
                </Text>

                <View
                  style={[
                    styles.card,
                    { backgroundColor: surface, borderColor: border },
                  ]}
                >
                  {/* New Password */}
                  <View style={styles.fieldWrap}>
                    <Text style={[styles.label, { color: text }]}>
                      New Password
                    </Text>
                    <View style={[styles.inputBox, box("new")]}>
                      <Ionicons
                        name="lock-closed-outline"
                        size={17}
                        color={focused === "new" ? brand : subtle}
                        style={styles.inputIcon}
                      />
                      <TextInput
                        style={[styles.input, { color: text }]}
                        placeholder="Min. 8 characters"
                        placeholderTextColor={subtle}
                        value={newPwd}
                        onChangeText={setNewPwd}
                        secureTextEntry={!showNew}
                        onFocus={() => setFocused("new")}
                        onBlur={() => setFocused(null)}
                      />
                      <TouchableOpacity
                        onPress={() => setShowNew(!showNew)}
                        style={styles.eyeBtn}
                      >
                        <Ionicons
                          name={showNew ? "eye-outline" : "eye-off-outline"}
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
                                    i <= strength.level
                                      ? strength.color
                                      : border,
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
                      style={[styles.inputBox, box("confirm", pwdMismatch)]}
                    >
                      <Ionicons
                        name="lock-closed-outline"
                        size={17}
                        color={
                          pwdMismatch ? error : focused === "confirm" ? brand : subtle
                        }
                        style={styles.inputIcon}
                      />
                      <TextInput
                        style={[styles.input, { color: text }]}
                        placeholder="Re-enter password"
                        placeholderTextColor={subtle}
                        value={confirmPwd}
                        onChangeText={setConfirmPwd}
                        secureTextEntry={!showConfirm}
                        onFocus={() => setFocused("confirm")}
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
                    <Text style={[styles.reqTitle, { color: subtle }]}>
                      PASSWORD REQUIREMENTS
                    </Text>
                    {reqs.map((r, i) => (
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

                  {/* CTA */}
                  <TouchableOpacity
                    style={[
                      styles.cta,
                      {
                        backgroundColor:
                          allMet && pwdMatch
                            ? brand
                            : isDark
                              ? border
                              : border,
                      },
                      loading && { opacity: 0.75 },
                    ]}
                    onPress={handleReset}
                    disabled={loading}
                    activeOpacity={0.88}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <>
                        <Text
                          style={[
                            styles.ctaText,
                            { color: allMet && pwdMatch ? "#fff" : subtle },
                          ]}
                        >
                          Reset Password
                        </Text>
                        <Ionicons
                          name="checkmark-circle-outline"
                          size={18}
                          color={allMet && pwdMatch ? "#fff" : subtle}
                        />
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              /* ── Success ── */
              <>
                <View style={[styles.iconWrap, { backgroundColor: successSoft }]}>
                  <Ionicons name="checkmark-circle" size={36} color={success} />
                </View>

                <Text style={[styles.title, { color: text }]}>
                  Password updated!
                </Text>
                <Text style={[styles.body, { color: subtle }]}>
                  Your password has been changed successfully. You can now sign
                  in with your new password.
                </Text>

                <View
                  style={[
                    styles.card,
                    { backgroundColor: surface, borderColor: border },
                  ]}
                >
                  {/* Security note */}
                  <View
                    style={[
                      styles.secNote,
                      { backgroundColor: successNoteBg, borderColor: successNoteBorder },
                    ]}
                  >
                    <Ionicons
                      name="shield-checkmark"
                      size={16}
                      color={success}
                    />
                    <Text style={styles.secNoteText}>
                      All other sessions have been signed out for your security.
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={[styles.cta, { backgroundColor: brand }]}
                    onPress={() => router.replace("/(auth)/sign-in")}
                    activeOpacity={0.88}
                  >
                    <Text style={styles.ctaText}>Sign In Now</Text>
                    <Ionicons name="arrow-forward" size={18} color="#fff" />
                  </TouchableOpacity>
                </View>
              </>
            )}
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
  eyeBtn: { padding: 4 },
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
  reqTitle: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  reqRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  reqText: { fontSize: 12 },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 52,
    borderRadius: 13,
  },
  ctaText: { fontSize: 16, fontWeight: "700", letterSpacing: 0.2 },
  secNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
  },
  secNoteText: {
    flex: 1,
    fontSize: 13,
    color: "#166534",
    lineHeight: 19,
    fontWeight: "500",
  },
});
