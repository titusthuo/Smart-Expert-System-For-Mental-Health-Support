import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Link } from "expo-router";
import { useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ThemedView className="flex-1 px-6 py-8 gap-6">
        <View className="gap-2">
          <ThemedText type="title">Reset password</ThemedText>
          <ThemedText className="text-muted-foreground">
            We’ll send a reset link to your email.
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

          <Pressable
            className="bg-primary rounded-xl px-4 py-4 items-center"
            onPress={() => {
              // Placeholder: replace with API call later
              setSent(true);
            }}
          >
            <ThemedText className="text-primary-foreground font-semibold">
              Send reset link
            </ThemedText>
          </Pressable>

          {sent && (
            <ThemedText className="text-muted-foreground">
              If an account exists for that email, a reset link has been sent.
            </ThemedText>
          )}
        </View>

        <View className="flex-row justify-center gap-2">
          <Link href="/(auth)/sign-in" asChild>
            <Pressable hitSlop={10}>
              <ThemedText type="link">Back to sign in</ThemedText>
            </Pressable>
          </Link>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}

