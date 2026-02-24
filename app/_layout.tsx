import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import "../global.css";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "hsl(var(--card))",
        },
        headerTintColor: "hsl(var(--foreground))",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        contentStyle: {
          backgroundColor: "hsl(var(--background))",
        },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="modal"
        options={{
          presentation: "modal",
          title: "Modal",
          headerStyle: { backgroundColor: "hsl(var(--card))" },
          headerTintColor: "hsl(var(--foreground))",
        }}
      />
      <StatusBar style="auto" />
    </Stack>
  );
}
