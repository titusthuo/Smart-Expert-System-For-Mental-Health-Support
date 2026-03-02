import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppText, Button, Input, TabStrip } from "@/components/ui";
import { useAuthTheme } from "@/hooks/use-auth-theme";

export default function SignInScreen() {
  const router = useRouter();
  const { isDark, bg, surface, border, text, subtle, brand, error, errorSoft } =
    useAuthTheme();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const inputColors = { border, surface, text, subtle, error, errorSoft };

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
                Welcome back
              </AppText>
              <AppText variant="subheading" color={subtle}>
                Sign in to continue your wellness journey
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
                activeKey="signIn"
                tabs={[
                  { key: "signIn", label: "Sign In", onPress: () => {} },
                  {
                    key: "signUp",
                    label: "Sign Up",
                    onPress: () => router.push("/(auth)/sign-up"),
                  },
                ]}
                colors={{ border, subtle, brand }}
              />

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
              </View>

              <Button
                text="Sign In"
                rightIcon="arrow-forward"
                brand={brand}
                loading={loading}
                onPress={handleSignIn}
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
                New to Mentally?
              </AppText>
              <AppText
                variant="link"
                color={brand}
                onPress={() => router.push("/(auth)/sign-up")}
              >
                Create account
              </AppText>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
