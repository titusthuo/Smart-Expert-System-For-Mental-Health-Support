import * as Haptics from "expo-haptics";
import React, { useCallback, useState } from "react";
import { View } from "react-native";

import { AppText, Button, Input } from "@/components/ui";
import { useSignIn } from "@/hooks/useSignIn";

type ShowFeedback = (opts: {
  title: string;
  message: string;
  variant?: "default" | "success" | "error";
  haptic?: "success" | "error" | "none";
  onClose?: () => void;
}) => Promise<void>;

export function AuthSignInTab({
  onShowFeedback,
  onForgotPassword,
  onSignedIn,
}: {
  onShowFeedback: ShowFeedback;
  onForgotPassword: () => void;
  onSignedIn: () => void;
}) {
  const { signIn } = useSignIn();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [signInLoading, setSignInLoading] = useState(false);

  const signInCanSubmit = !signInLoading && !!username.trim() && !!password;

  const handleSignIn = useCallback(async () => {
    if (!signInCanSubmit) {
      await onShowFeedback({
        title: "Missing details",
        message: "Please enter your username and password.",
        variant: "error",
        haptic: "error",
      });
      return;
    }

    setSignInLoading(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      await signIn({
        username: username.trim(),
        password,
      });
      onSignedIn();
    } catch (e) {
      await onShowFeedback({
        title: "Sign in failed",
        message:
          e instanceof Error
            ? e.message
            : "Unable to sign you in. Please try again.",
        variant: "error",
        haptic: "error",
      });
    } finally {
      setSignInLoading(false);
    }
  }, [onShowFeedback, onSignedIn, password, signIn, signInCanSubmit, username]);

  return (
    <View className="p-5 gap-4">
      <Input
        label="Username"
        iconName="person-outline"
        placeholder="johndoe"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="next"
      />

      <Input
        label="Password"
        iconName="lock-closed-outline"
        placeholder="••••••••"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        returnKeyType="done"
        onSubmitEditing={handleSignIn}
      />

      <AppText
        variant="link"
        style={{ textAlign: "right", marginTop: -4 }}
        onPress={onForgotPassword}
      >
        Forgot password?
      </AppText>

      <Button
        text="Sign In"
        rightIcon="arrow-forward"
        loading={signInLoading}
        onPress={handleSignIn}
        className="mt-2 h-14"
        disabled={!signInCanSubmit}
      />
    </View>
  );
}
