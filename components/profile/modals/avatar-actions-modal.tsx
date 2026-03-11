import { AppText } from "@/components/ui";
import React from "react";
import { Modal, TouchableOpacity, View } from "react-native";

export function AvatarActionsModal({
  visible,
  hasPhoto,
  onRequestClose,
  onPressUploadOrChange,
  onPressView,
  onPressRemove,
}: {
  visible: boolean;
  hasPhoto: boolean;
  onRequestClose: () => void;
  onPressUploadOrChange: () => void;
  onPressView: () => void;
  onPressRemove: () => void;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onRequestClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center px-6">
        <View className="bg-card rounded-2xl p-6 w-full max-w-sm border border-border">
          <AppText unstyled className="text-xl font-semibold text-foreground mb-1">
            Profile photo
          </AppText>
          <AppText unstyled className="text-muted-foreground mb-6">
            Upload, view, or edit your profile picture.
          </AppText>

          <View className="space-y-3">
            <TouchableOpacity
              onPress={onPressUploadOrChange}
              className="px-5 py-3 bg-brand rounded-lg"
              activeOpacity={0.9}
              accessibilityRole="button"
              accessibilityLabel={hasPhoto ? "Change photo" : "Upload photo"}
            >
              <AppText unstyled className="text-white font-medium text-center">
                {hasPhoto ? "Change Photo" : "Upload Photo"}
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity
              disabled={!hasPhoto}
              onPress={onPressView}
              className={[
                "px-5 py-3 border border-border rounded-lg",
                hasPhoto ? "opacity-100" : "opacity-50",
              ].join(" ")}
              activeOpacity={0.9}
              accessibilityRole="button"
              accessibilityLabel="View photo"
            >
              <AppText unstyled className="text-foreground font-medium text-center">
                View Photo
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity
              disabled={!hasPhoto}
              onPress={onPressRemove}
              className={[
                "px-5 py-3 border border-red-200 rounded-lg",
                hasPhoto ? "opacity-100" : "opacity-50",
              ].join(" ")}
              activeOpacity={0.9}
              accessibilityRole="button"
              accessibilityLabel="Remove photo"
            >
              <AppText unstyled className="text-red-600 font-medium text-center">
                Remove Photo
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onRequestClose}
              className="px-5 py-3 border border-border rounded-lg"
              activeOpacity={0.9}
              accessibilityRole="button"
              accessibilityLabel="Close menu"
            >
              <AppText unstyled className="text-foreground font-medium text-center">
                Cancel
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
