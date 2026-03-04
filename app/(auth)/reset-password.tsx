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
    success,
    successSoft,
    successNoteBg,
    successNoteBorder,
  } = useAuthTheme();

  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [loading, setLoading] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

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
    <View className="flex-1" style={{ backgroundColor: bg }}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          {!resetSuccess && (
            <View
              className={`flex-row items-center justify-between px-5 py-3 border-b border-[${border}] bg-[${bg}]`}
            >
              <TouchableOpacity
                onPress={() => router.back()}
                activeOpacity={0.7}
                className={`w-10 h-10 rounded-xl border border-[${border}] bg-[${surface}] items-center justify-center`}
              >
                <Ionicons name="arrow-back" size={20} color={text} />
              </TouchableOpacity>

              <AppText variant="label" color={text} className="text-base">
                New Password
              </AppText>

              <View className="w-10" />
            </View>
          )}

          <ScrollView
            className="flex-1"
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
                  className={`w-[72px] h-[72px] rounded-2xl bg-[${brandSoft}] items-center justify-center mb-6`}
                >
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={32}
                    color={brand}
                  />
                </View>

                <AppText variant="heading" color={text} className="text-[26px]">
                  Create new password
                </AppText>

                <AppText variant="body" color={subtle} className="mt-2.5 mb-7">
                  Your new password must be different from any previously used
                  passwords.
                </AppText>

                <View
                  className={`rounded-2xl border border-[${border}] bg-[${surface}] p-5 gap-4 shadow-sm`}
                  // shadow-sm ≈ shadowColor + offset + opacity + radius + elevation
                >
                  {/* New Password */}
                  <View className="gap-1.5">
                    <Input
                      label="New Password"
                      iconName="lock-closed-outline"
                      placeholder="Min. 8 characters"
                      value={newPwd}
                      onChangeText={setNewPwd}
                      secureTextEntry
                    />
                    <PasswordStrength password={newPwd} />
                  </View>

                  {/* Confirm Password */}
                  <View className="gap-1.5">
                    <Input
                      label="Confirm Password"
                      iconName="lock-closed-outline"
                      placeholder="Re-enter password"
                      value={confirmPwd}
                      onChangeText={setConfirmPwd}
                      secureTextEntry
                      error={pwdMismatch ? "Passwords do not match" : undefined}
                    />

                    {pwdMatch && (
                      <View className="flex-row items-center gap-1.5">
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
                    onAllMet={setCanSubmit}
                  />

                  <Button
                    text="Reset Password"
                    rightIcon="checkmark-circle-outline"
                    loading={loading}
                    disabled={!canSubmit || !pwdMatch}
                    onPress={handleReset}
                  />
                </View>
              </>
            ) : (
              <>
                <View
                  className={`w-[72px] h-[72px] rounded-2xl bg-[${successSoft}] items-center justify-center mb-6`}
                >
                  <Ionicons name="checkmark-circle" size={36} color={success} />
                </View>

                <AppText variant="heading" color={text} className="text-[26px]">
                  Password updated!
                </AppText>

                <AppText variant="body" color={subtle} className="mt-2.5 mb-7">
                  Your password has been changed successfully. You can now sign
                  in with your new password.
                </AppText>

                <View
                  className={`rounded-2xl border border-[${border}] bg-[${surface}] p-5 gap-4 shadow-sm`}
                >
                  {/* Security note */}
                  <View
                    className={`flex-row items-start gap-2.5 border border-[${successNoteBorder}] rounded-xl p-3.5 bg-[${successNoteBg}]`}
                  >
                    <Ionicons
                      name="shield-checkmark"
                      size={16}
                      color={success}
                    />
                    <AppText
                      variant="body"
                      color={success}
                      className="flex-1 text-[13px] leading-[19px] font-medium"
                    >
                      All other sessions have been signed out for your security.
                    </AppText>
                  </View>

                  <Button
                    text="Sign In Now"
                    rightIcon="arrow-forward"
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
