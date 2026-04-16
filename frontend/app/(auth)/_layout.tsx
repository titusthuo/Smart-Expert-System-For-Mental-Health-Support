import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "none",
      }}
      initialRouteName="sign-in"
    >
      <Stack.Screen name="sign-in" options={{ title: "Sign In" }} />
      <Stack.Screen name="sign-up" options={{ title: "Sign Up" }} />
      <Stack.Screen
        name="forgot-password"
        options={{ title: "Forgot Password" }}
      />
      <Stack.Screen
        name="reset-password"
        options={{ title: "Reset Password" }}
      />
      <Stack.Screen
        name="setup-security-question"
        options={{ title: "Security Question" }}
      />
      <Stack.Screen
        name="forgot-password-username"
        options={{ title: "Forgot Password" }}
      />
      <Stack.Screen
        name="security-question"
        options={{ title: "Security Question" }}
      />
      <Stack.Screen name="otp-verification" options={{ title: "Verify OTP" }} />
      <Stack.Screen name="new-password" options={{ title: "New Password" }} />
      <Stack.Screen name="[token]" options={{ title: "Token Verification" }} />
    </Stack>
  );
}
