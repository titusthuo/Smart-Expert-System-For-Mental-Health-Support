import { AppText, Button } from "@/components/ui";
import * as Haptics from "expo-haptics";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { Modal, View } from "react-native";

type FeedbackVariant = "default" | "success" | "error";

type FeedbackState = {
  visible: boolean;
  title: string;
  message: string;
  variant: FeedbackVariant;
};

export function useAuthFeedback() {
  const [state, setState] = useState<FeedbackState>({
    visible: false,
    title: "",
    message: "",
    variant: "default",
  });

  const onCloseRef = useRef<(() => void) | null>(null);

  const hide = useCallback(() => {
    setState((p) => ({ ...p, visible: false }));
    const cb = onCloseRef.current;
    onCloseRef.current = null;
    cb?.();
  }, []);

  const show = useCallback(
    async (opts: {
      title: string;
      message: string;
      variant?: FeedbackVariant;
      haptic?: "success" | "error" | "none";
      onClose?: () => void;
    }) => {
      setState({
        visible: true,
        title: opts.title,
        message: opts.message,
        variant: opts.variant ?? "default",
      });

      onCloseRef.current = opts.onClose ?? null;

      if (opts.haptic === "success") {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      if (opts.haptic === "error") {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    },
    []
  );

  const modalProps = useMemo(
    () => ({
      visible: state.visible,
      title: state.title,
      message: state.message,
      variant: state.variant,
      onClose: hide,
    }),
    [hide, state.message, state.title, state.variant, state.visible]
  );

  return { show, hide, modalProps };
}

export function AuthFeedbackModal({
  visible,
  title,
  message,
  variant,
  onClose,
}: {
  visible: boolean;
  title: string;
  message: string;
  variant: FeedbackVariant;
  onClose: () => void;
}) {
  const accent =
    variant === "success"
      ? "border-success/30"
      : variant === "error"
        ? "border-error/30"
        : "border-border";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/70 justify-center items-center px-6">
        <View
          className={[
            "bg-card rounded-2xl p-6 w-full max-w-sm border",
            accent,
          ].join(" ")}
        >
          <AppText variant="label" className="text-lg font-semibold mb-1">
            {title}
          </AppText>
          <AppText variant="body" className="text-muted-foreground mb-5">
            {message}
          </AppText>

          <Button text="OK" onPress={onClose} className="h-12" />
        </View>
      </View>
    </Modal>
  );
}
