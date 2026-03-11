import { AppText } from "@/components/ui";
import React from "react";
import { Image, Modal, TouchableOpacity, View } from "react-native";

export function PhotoConfirmModal({
  visible,
  pendingUri,
  fallbackInitials,
  onCancel,
  onConfirm,
}: {
  visible: boolean;
  pendingUri: string | null;
  fallbackInitials: string;
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
      <View className="flex-1 bg-black/70 justify-center items-center px-6">
        <View className="bg-card rounded-2xl p-6 w-full max-w-sm border border-border">
          <AppText unstyled className="text-xl font-semibold text-foreground mb-2">
            Confirm photo
          </AppText>
          <AppText unstyled className="text-muted-foreground mb-5">
            Use this as your new profile photo?
          </AppText>

          <View className="w-full aspect-square rounded-2xl overflow-hidden border border-border bg-card">
            {pendingUri ? (
              <Image
                source={{ uri: pendingUri }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <View className="w-full h-full items-center justify-center bg-card">
                <AppText unstyled className="text-foreground font-semibold text-base">
                  {fallbackInitials}
                </AppText>
              </View>
            )}
          </View>

          <View className="flex-row justify-end mt-5 space-x-3">
            <TouchableOpacity
              onPress={onCancel}
              className="px-5 py-3 border border-border rounded-lg"
              activeOpacity={0.9}
              accessibilityRole="button"
              accessibilityLabel="Cancel photo selection"
            >
              <AppText unstyled className="text-foreground font-medium">
                Cancel
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onConfirm}
              className="px-5 py-3 bg-brand rounded-lg"
              activeOpacity={0.9}
              accessibilityRole="button"
              accessibilityLabel="Confirm photo selection"
            >
              <AppText unstyled className="text-white font-medium">
                Confirm
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
