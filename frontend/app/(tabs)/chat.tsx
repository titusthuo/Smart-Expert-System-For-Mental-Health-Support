import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useRef } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";

import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatInput } from "@/components/chat/ChatInput";
import { MoodBanner } from "@/components/chat/MoodBanner";
import { TypingRow } from "@/components/chat/TypingRow";
import { MessageBubble } from "@/components/ui";
import { useAuthTheme } from "@/hooks/use-auth-theme";
import { useAIAssistant } from "@/src/hooks/useAIAssistant";

export default function ChatScreen() {
  const router = useRouter();
  const { isDark, brandAccent } = useAuthTheme();
  const insets = useSafeAreaInsets();

  const { mood, aiGreeting } = useLocalSearchParams<{
    mood?: string;
    aiGreeting?: string;
  }>();

  // ── AI hook ──────────────────────────────────────────────────────────────
  const {
    messages,
    inputValue,
    setInputValue,
    isTyping,
    isEscalated,
    sendMessage,
    setIsEscalated,
  } = useAIAssistant(aiGreeting);

  // ── Scroll helpers ────────────────────────────────────────────────────────
  const scrollViewRef = useRef<ScrollView>(null);

  const scrollToBottom = useCallback((animated = true) => {
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated }), 120);
  }, []);

  const handleContentSizeChange = useCallback(
    () => scrollToBottom(),
    [scrollToBottom],
  );

  // Scroll to bottom whenever a new message arrives or typing indicator changes
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  // ── Mood change: reset escalation so the new session starts fresh ─────────
  useEffect(() => {
    if (mood) {
      setIsEscalated(false);
    }
  }, [mood, setIsEscalated]);

  // ── Send handler ──────────────────────────────────────────────────────────
  const handleSendMessage = useCallback(async () => {
    if (isEscalated || !inputValue.trim()) return;
    Haptics.selectionAsync().catch(() => undefined);
    await sendMessage(inputValue);
  }, [inputValue, isEscalated, sendMessage]);

  const canSend = !isEscalated && inputValue.trim().length > 0;

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />

      <SafeAreaView className="flex-1 bg-background">
        <ChatHeader
          mood={typeof mood === "string" ? mood : undefined}
          onPressProfile={() => router.push("/(tabs)/profile")}
        />

        {typeof mood === "string" && mood.length > 0 && (
          <MoodBanner
            mood={mood}
            iconColor={brandAccent}
            isDark={isDark}
            onDismiss={() => router.setParams({ mood: undefined })}
          />
        )}

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
          keyboardVerticalOffset={
            Platform.OS === "ios" ? insets.bottom + 90 : insets.bottom + 24
          }
        >
          <ScrollView
            ref={scrollViewRef}
            className="flex-1 bg-background"
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingTop: 24,
              paddingBottom: 88 + insets.bottom,
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            onContentSizeChange={handleContentSizeChange}
          >
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                id={msg.id}
                text={msg.text}
                sender={msg.sender}
                timestamp={msg.timestamp}
                showTherapistRecommendation={msg.showTherapistRecommendation}
                onPressTherapist={() =>
                  router.push({
                    pathname: "/(tabs)/therapists",
                    params: { reason: "crisis" },
                  })
                }
              />
            ))}

            {isTyping && <TypingRow isDark={isDark} />}
          </ScrollView>

          <ChatInput
            value={inputValue}
            onChangeText={setInputValue}
            onSend={handleSendMessage}
            canSend={canSend}
            isEscalated={isEscalated}
            insets={insets}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}
