import { AppText } from "@/components/ui";
import React from "react";
import { Modal, TouchableOpacity, View } from "react-native";

export function InfoDialogModal({
  visible,
  title,
  message,
  onClose,
}: {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center px-6">
        <View className="bg-card rounded-2xl p-6 w-full max-w-sm border border-border">
          <AppText unstyled className="text-xl font-semibold text-foreground mb-2">
            {title}
          </AppText>
          <AppText unstyled className="text-muted-foreground mb-6">
            {message}
          </AppText>

          <View className="flex-row justify-end">
            <TouchableOpacity
              onPress={onClose}
              className="px-5 py-3 border border-border rounded-lg"
              accessibilityRole="button"
              accessibilityLabel="Close dialog"
            >
              <AppText unstyled className="text-foreground font-medium">
                OK
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
