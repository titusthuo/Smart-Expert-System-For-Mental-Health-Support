import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
import { EdgeInsets } from "react-native-safe-area-context";

import { AppText } from "@/components/ui";
import { useAuthTheme } from "@/hooks/use-auth-theme";

type ChatInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  canSend: boolean;
  isEscalated: boolean;
  insets: EdgeInsets;
};

export function ChatInput({
  value,
  onChangeText,
  onSend,
  canSend,
  isEscalated,
  insets,
}: ChatInputProps) {
  const { isDark } = useAuthTheme();

  return (
    <View
      className="border-t border-border bg-card px-4 pt-3"
      style={{ paddingBottom: Math.max(insets.bottom, 8) }}
    >
      <View className="flex-row items-end">
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={isEscalated ? "Chat paused — use the therapist directory" : "Type your message..."}
          placeholderTextColor={isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)"}
          editable={!isEscalated}
          className="flex-1 bg-muted border border-border rounded-3xl px-5 py-3 text-[15px] text-foreground max-h-36"
          multiline
          textAlignVertical="top"
          onSubmitEditing={onSend}
          blurOnSubmit={false}
          accessibilityLabel="Message input"
          accessibilityHint={isEscalated ? "Chat is paused" : "Type a message to send"}
        />

        <TouchableOpacity
          onPress={onSend}
          disabled={!canSend}
          className={
            canSend
              ? "ml-3 mb-1 w-12 h-12 rounded-full bg-brand items-center justify-center"
              : "ml-3 mb-1 w-12 h-12 rounded-full bg-brand items-center justify-center opacity-40"
          }
          activeOpacity={0.82}
          accessibilityRole="button"
          accessibilityLabel="Send message"
          accessibilityHint={canSend ? "Sends your message" : "Enter a message to enable send"}
        >
          <Ionicons name="send" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <AppText unstyled className="text-center text-xs text-muted-foreground mt-3 opacity-70">
        {isEscalated
          ? "For your safety, Mentally has paused the chat. If you are in immediate danger, call 1190 or 999 right now."
          : "This AI provides general wellness support. For urgent help, contact emergency services."}
      </AppText>
    </View>
  );
}
