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
} from "@/components/ui";
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
  const [loading, setLoading] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const inputColors = { border, surface, text, subtle, error, errorSoft };

  const pwdMatch = confirmPwd.length > 0 && newPwd === confirmPwd;
  const pwdMismatch = confirmPwd.length > 0 && newPwd !== confirmPwd;

  const handleReset = () => {
    if (!newPwd || !confirmPwd) {
      Alert.alert("Missing fields", "Please fill in both password fields.");
      return;
    }
    if (!canSubmit) {
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

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          {/* ── Header (hidden on success) ── */}
          {!resetSuccess && (
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
                New Password
              </AppText>
              <View style={{ width: 40 }} />
            </View>
          )}

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
            {!resetSuccess ? (
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
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={32}
                    color={brand}
                  />
                </View>

                <AppText
                  variant="heading"
                  color={text}
                  style={{ fontSize: 26 }}
                >
                  Create new password
                </AppText>
                <AppText
                  variant="body"
                  color={subtle}
                  style={{ marginTop: 10, marginBottom: 28 }}
                >
                  Your new password must be different from any previously used
                  passwords.
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
                  {/* New Password */}
                  <View style={{ gap: 6 }}>
                    <Input
                      label="New Password"
                      iconName="lock-closed-outline"
                      placeholder="Min. 8 characters"
                      value={newPwd}
                      onChangeText={setNewPwd}
                      secureTextEntry
                      brand={brand}
                      colors={inputColors}
                    />
                    <PasswordStrength
                      password={newPwd}
                      colors={{ border, error, success, warning, info }}
                    />
                  </View>

                  {/* Confirm Password */}
                  <View style={{ gap: 6 }}>
                    <Input
                      label="Confirm Password"
                      iconName="lock-closed-outline"
                      placeholder="Re-enter password"
                      value={confirmPwd}
                      onChangeText={setConfirmPwd}
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
                    password={newPwd}
                    colors={{ border, surface, subtle, success }}
                    onAllMet={setCanSubmit}
                  />

                  <Button
                    text="Reset Password"
                    rightIcon="checkmark-circle-outline"
                    brand={brand}
                    loading={loading}
                    disabled={!canSubmit || !pwdMatch}
                    onPress={handleReset}
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
                  <Ionicons name="checkmark-circle" size={36} color={success} />
                </View>

                <AppText
                  variant="heading"
                  color={text}
                  style={{ fontSize: 26 }}
                >
                  Password updated!
                </AppText>
                <AppText
                  variant="body"
                  color={subtle}
                  style={{ marginTop: 10, marginBottom: 28 }}
                >
                  Your password has been changed successfully. You can now sign
                  in with your new password.
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
                  {/* Security note */}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "flex-start",
                      gap: 10,
                      borderWidth: 1,
                      borderRadius: 12,
                      padding: 14,
                      backgroundColor: successNoteBg,
                      borderColor: successNoteBorder,
                    }}
                  >
                    <Ionicons
                      name="shield-checkmark"
                      size={16}
                      color={success}
                    />
                    <AppText
                      variant="body"
                      color={success}
                      style={{
                        flex: 1,
                        fontSize: 13,
                        lineHeight: 19,
                        fontWeight: "500",
                      }}
                    >
                      All other sessions have been signed out for your security.
                    </AppText>
                  </View>

                  <Button
                    text="Sign In Now"
                    rightIcon="arrow-forward"
                    brand={brand}
                    onPress={() => router.replace("/(auth)/sign-in")}
                  />
                </View>
              </>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
