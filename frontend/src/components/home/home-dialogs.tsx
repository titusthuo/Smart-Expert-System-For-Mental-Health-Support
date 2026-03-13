import React from "react";
import { Modal, View } from "react-native";

import { AppText, Button } from "@/components/ui";

type HomeDialogsProps = {
  callConfirmVisible: boolean;
  onCloseCallConfirm: () => void;
  helplineName: string;
  helplineNumber: string;
  onConfirmCall: () => void;

  infoVisible: boolean;
  infoTitle: string;
  infoMessage: string;
  onCloseInfo: () => void;
};

export function HomeDialogs({
  callConfirmVisible,
  onCloseCallConfirm,
  helplineName,
  helplineNumber,
  onConfirmCall,
  infoVisible,
  infoTitle,
  infoMessage,
  onCloseInfo,
}: HomeDialogsProps) {
  return (
    <>
      <Modal
        visible={callConfirmVisible}
        transparent
        animationType="fade"
        onRequestClose={onCloseCallConfirm}
      >
        <View className="flex-1 bg-black/70 justify-center items-center px-6">
          <View className="bg-card rounded-2xl p-6 w-full max-w-sm border border-border">
            <AppText unstyled className="text-foreground font-bold text-lg mb-1">
              Call helpline
            </AppText>
            <AppText
              unstyled
              className="text-muted-foreground text-sm leading-5 mb-5"
            >
              {`Call ${helplineName} (${helplineNumber}) for immediate support?`}
            </AppText>

            <View className="gap-3">
              <Button
                text={`Call ${helplineNumber}`}
                rightIcon="call-outline"
                onPress={onConfirmCall}
                className="h-12"
              />
              <Button
                text="Not now"
                variant="ghost"
                onPress={onCloseCallConfirm}
                className="h-12"
              />
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={infoVisible}
        transparent
        animationType="fade"
        onRequestClose={onCloseInfo}
      >
        <View className="flex-1 bg-black/70 justify-center items-center px-6">
          <View className="bg-card rounded-2xl p-6 w-full max-w-sm border border-border">
            <AppText unstyled className="text-foreground font-bold text-lg mb-1">
              {infoTitle}
            </AppText>
            <AppText
              unstyled
              className="text-muted-foreground text-sm leading-5 mb-5"
            >
              {infoMessage}
            </AppText>

            <Button text="OK" onPress={onCloseInfo} className="h-12" />
          </View>
        </View>
      </Modal>
    </>
  );
}
