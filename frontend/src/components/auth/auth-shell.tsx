import { AppText } from "@/components/ui";
import { useAuthTheme } from "@/hooks/use-auth-theme";
import { Ionicons } from "@expo/vector-icons";
import React, { ReactNode } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

type AuthScreenShellProps = {
  title: string;
  onBack?: () => void;
  children: ReactNode;
  /** When true, renders as an overlay modal sheet instead of a full page */
  asModal?: boolean;
};

export function AuthScreenShell({ title, onBack, children, asModal }: AuthScreenShellProps) {
  const { isDark, text } = useAuthTheme();
  const insets = useSafeAreaInsets();

  // ── Header bar (shared between both modes) ─────────────────────────────
  const header = (
    <View
      style={[
        modalStyles.header,
        {
          borderBottomColor: isDark ? "hsl(0, 0%, 17%)" : "hsl(0, 0%, 90%)",
        },
      ]}
    >
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
  );

  // ── Scrollable body (shared) ───────────────────────────────────────────
  const body = (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: asModal ? insets.bottom + 32 : 48,
      }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );

  // ── Modal overlay presentation ─────────────────────────────────────────
  if (asModal) {
    return (
      <View style={modalStyles.container}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

        {/* Backdrop — tap to dismiss */}
        <Pressable style={modalStyles.backdrop} onPress={onBack} />

        {/* Sheet */}
        <View
          style={[
            modalStyles.sheet,
            {
              backgroundColor: isDark ? "hsl(0, 0%, 9%)" : "hsl(0, 0%, 100%)",
            },
          ]}
        >
          {/* Drag handle */}
          <View style={modalStyles.handleRow}>
            <View
              style={[
                modalStyles.handle,
                { backgroundColor: isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.2)" },
              ]}
            />
          </View>

          {header}
          {body}
        </View>
      </View>
    );
  }

  // ── Full-page presentation (sign-in, sign-up, etc.) ───────────────────
  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        {header}
        {body}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const modalStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sheet: {
    flex: 1,
    marginTop: 48,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
  handleRow: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 4,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    height: 56,
    borderBottomWidth: 1,
  },
});
