import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
    AuthFeedbackModal,
    useAuthFeedback,
} from "@/components/auth/auth-feedback";

import { AuthSignInTab } from "@/components/auth/auth-sign-in-tab";
import { AuthSignUpTab } from "@/components/auth/auth-sign-up-tab";
import { AppText, Card, TabStrip } from "@/components/ui";
import { useAuthTheme } from "@/hooks/use-auth-theme";
import { useSignUp } from "@/hooks/useSignUp";

type AuthTabsProps = {
  initialTab: "signIn" | "signUp";
};

export function AuthTabsScreen({ initialTab }: AuthTabsProps) {
  const router = useRouter();
  const { isDark } = useAuthTheme();
  const feedback = useAuthFeedback();
  const { signUp } = useSignUp();

  const logoImage = require("../../../assets/logos/brain.jpg");

  const [activeTab, setActiveTab] = useState<"signIn" | "signUp">(initialTab);

  return (
    <>
      <View className="flex-1 bg-background">
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
        <SafeAreaView className="flex-1">
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1"
            keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
          >
            <ScrollView
              contentContainerClassName="flex-grow px-6 pt-5 pb-10"
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* ── Brand ── */}
              <View className="flex-row items-center gap-3 mb-9">
                <View className="w-11 h-11 rounded-full overflow-hidden bg-card border border-border items-center justify-center">
                  <Image
                    source={logoImage}
                    className="w-full h-full"
                    resizeMode="cover"
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
                  <AuthSignInTab
                    onShowFeedback={feedback.show}
                    onForgotPassword={() =>
                      router.push("/(auth)/forgot-password")
                    }
                    onSignedIn={() => router.replace("/(tabs)")}
                  />
                ) : (
                  <AuthSignUpTab
                    onShowFeedback={feedback.show}
                    onSignedUp={() =>
                      feedback
                        .show({
                          title: "Account created",
                          message: "Welcome to Mentally!",
                          variant: "success",
                          haptic: "success",
                          onClose: () => router.replace("/(tabs)"),
                        })
                        .catch(() => undefined)
                    }
                    onNavigate={(route) => router.push(route)}
                    signUp={signUp}
                  />
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

      <AuthFeedbackModal {...feedback.modalProps} />
    </>
  );
}
