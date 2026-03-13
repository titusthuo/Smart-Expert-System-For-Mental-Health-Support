import { AppText } from "@/components/ui";
import { useAuthTheme } from "@/hooks/use-auth-theme";
import { Ionicons } from "@expo/vector-icons";
import React, { ReactNode } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type AuthScreenShellProps = {
  title: string;
  onBack?: () => void;
  children: ReactNode;
};

export function AuthScreenShell({ title, onBack, children }: AuthScreenShellProps) {
  const { isDark, text } = useAuthTheme();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <View className="flex-row items-center justify-between px-5 border-b border-border bg-card h-14">
          <TouchableOpacity
            onPress={onBack}
            disabled={!onBack}
            activeOpacity={0.75}
            className="w-10 h-10 rounded-xl border border-border bg-card items-center justify-center"
            style={{ opacity: onBack ? 1 : 0 }}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={22} color={text} />
          </TouchableOpacity>

          <AppText variant="label" className="text-lg font-semibold">
            {title}
          </AppText>

          <View className="w-10" />
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 24,
            paddingTop: 32,
            paddingBottom: 48,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
