import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUpScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ThemedView className="flex-1 px-6 py-8 gap-6">
        <View className="gap-2">
          <ThemedText type="title">Create account</ThemedText>
          <ThemedText className="text-muted-foreground">
            Start your journey with us.
          </ThemedText>
        </View>

        <View className="gap-4">
          <View className="gap-2">
            <ThemedText className="text-muted-foreground">Name</ThemedText>
            <TextInput
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoComplete="name"
              placeholder="Your name"
              placeholderTextColor="hsl(0, 0%, 44%)"
              className="bg-card text-foreground border border-border rounded-xl px-4 py-3"
            />
          </View>

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
              autoComplete="password-new"
              placeholder="Create a password"
              placeholderTextColor="hsl(0, 0%, 44%)"
              className="bg-card text-foreground border border-border rounded-xl px-4 py-3"
            />
          </View>

          <Pressable
            className="bg-primary rounded-xl px-4 py-4 items-center"
            onPress={() => {
              // Placeholder: replace with real signup later
              router.replace("/(tabs)");
            }}
          >
            <ThemedText className="text-primary-foreground font-semibold">
              Sign up
            </ThemedText>
          </Pressable>
        </View>

        <View className="flex-row justify-center gap-2">
          <ThemedText className="text-muted-foreground">
            Already have an account?
          </ThemedText>
          <Link href="/(auth)/sign-in" asChild>
            <Pressable hitSlop={10}>
              <ThemedText type="link">Sign in</ThemedText>
            </Pressable>
          </Link>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}

