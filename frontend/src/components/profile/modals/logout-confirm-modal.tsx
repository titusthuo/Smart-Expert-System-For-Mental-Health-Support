import { AppText } from "@/components/ui";
import React from "react";
import { Modal, TouchableOpacity, View } from "react-native";

export function LogoutConfirmModal({
  visible,
  onCancel,
  onConfirm,
}: {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View className="flex-1 bg-black/50 justify-center items-center px-6">
        <View className="bg-card rounded-2xl p-6 w-full max-w-sm border border-border">
          <AppText unstyled className="text-xl font-semibold text-foreground mb-2">
            Confirm Logout
          </AppText>
          <AppText unstyled className="text-muted-foreground mb-6">
            Are you sure you want to log out of your account?
          </AppText>

          <View className="flex-row justify-end space-x-3">
            <TouchableOpacity
              onPress={onCancel}
              className="px-5 py-3 border border-border rounded-lg"
              accessibilityRole="button"
              accessibilityLabel="Cancel logout"
            >
              <AppText unstyled className="text-foreground font-medium">
                Cancel
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onConfirm}
              className="px-5 py-3 bg-red-600 rounded-lg"
              accessibilityRole="button"
              accessibilityLabel="Confirm logout"
            >
              <AppText unstyled className="text-white font-medium">
                Log Out
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
