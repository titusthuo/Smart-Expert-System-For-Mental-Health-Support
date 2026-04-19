import { Stack } from "expo-router";

/** Shared options for screens that slide up as a modal overlay sheet */
const modalScreen = {
  headerShown: false as const,
  presentation: "transparentModal" as const,
  animation: "slide_from_bottom" as const,
  gestureEnabled: true,
  gestureDirection: "vertical" as const,
};

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
      initialRouteName="sign-in"
    >
      {/* ── Primary pages (smooth horizontal slide) ─── */}
      <Stack.Screen name="sign-in" options={{ title: "Sign In" }} />
      <Stack.Screen name="sign-up" options={{ title: "Sign Up" }} />

      {/* ── Recovery/verification (overlay modal sheets) ─── */}
      <Stack.Screen
        name="forgot-password"
        options={{ title: "Forgot Password", ...modalScreen }}
      />
      <Stack.Screen
        name="forgot-password-username"
        options={{ title: "Forgot Password", ...modalScreen }}
      />
      <Stack.Screen
        name="security-question"
        options={{ title: "Security Question", ...modalScreen }}
      />
      <Stack.Screen
        name="otp-verification"
        options={{ title: "Verify OTP", ...modalScreen }}
      />
      <Stack.Screen
        name="new-password"
        options={{ title: "New Password", ...modalScreen }}
      />
      <Stack.Screen
        name="setup-security-question"
        options={{ title: "Security Question", ...modalScreen }}
      />
      <Stack.Screen name="[token]" options={{ title: "Token Verification", ...modalScreen }} />
    </Stack>
  );
}
