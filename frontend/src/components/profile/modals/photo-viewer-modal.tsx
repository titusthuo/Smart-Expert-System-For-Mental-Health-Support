import { AppText } from "@/components/ui";
import React from "react";
import { Image, Modal, TouchableOpacity, View } from "react-native";

export function PhotoViewerModal({
  visible,
  photoUri,
  fallbackInitials,
  onClose,
}: {
  visible: boolean;
  photoUri: string | null;
  fallbackInitials: string;
  onClose: () => void;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/90 justify-center items-center px-6">
        <View className="w-full max-w-sm items-center">
          <View className="w-72 h-72 rounded-2xl overflow-hidden border border-border bg-card">
            {photoUri ? (
              <Image
                source={{ uri: photoUri }}
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

          <TouchableOpacity
            onPress={onClose}
            className="mt-5 px-6 py-3 bg-card border border-border rounded-lg"
            activeOpacity={0.9}
            accessibilityRole="button"
            accessibilityLabel="Close photo viewer"
          >
            <AppText unstyled className="text-foreground font-medium text-center">
              Close
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
