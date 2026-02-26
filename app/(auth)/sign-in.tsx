import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ThemedView className="flex-1 px-6 py-8 gap-6">
        <View className="gap-2">
          <ThemedText type="title">Welcome back</ThemedText>
          <ThemedText className="text-muted-foreground">
            Sign in to continue.
          </ThemedText>
        </View>

        <View className="gap-4">
          <View className="gap-2">
            <ThemedText className="text-muted-foreground">Email</ThemedText>
            <TextInput
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              placeholder="you@example.com"
              placeholderTextColor="hsl(0, 0%, 44%)"
              className="bg-card text-foreground border border-border rounded-xl px-4 py-3"
            />
          </View>

          <View className="gap-2">
            <ThemedText className="text-muted-foreground">Password</ThemedText>
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password"
              placeholder="Your password"
              placeholderTextColor="hsl(0, 0%, 44%)"
              className="bg-card text-foreground border border-border rounded-xl px-4 py-3"
            />
          </View>

          <View className="flex-row justify-end">
            <Link href="/(auth)/forgot-password" asChild>
              <Pressable hitSlop={10}>
                <ThemedText type="link">Forgot password?</ThemedText>
              </Pressable>
            </Link>
          </View>

          <Pressable
            className="bg-primary rounded-xl px-4 py-4 items-center"
            onPress={() => {
              // Placeholder: replace with real auth later
              router.replace("/(tabs)");
            }}
          >
            <ThemedText className="text-primary-foreground font-semibold">
              Sign in
            </ThemedText>
          </Pressable>
        </View>

        <View className="flex-row justify-center gap-2">
          <ThemedText className="text-muted-foreground">
            Don&apos;t have an account?
          </ThemedText>
          <Link href="/(auth)/sign-up" asChild>
            <Pressable hitSlop={10}>
              <ThemedText type="link">Sign up</ThemedText>
            </Pressable>
          </Link>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}

