import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatInput } from "@/components/chat/ChatInput";
import { MoodBanner } from "@/components/chat/MoodBanner";
import { TypingRow } from "@/components/chat/TypingRow";
import { MessageBubble } from "@/components/ui";
import { useAuthTheme } from "@/hooks/use-auth-theme";
import {
  DEFAULT_GREETING,
  getAIResponse,
  isCriticalInput,
} from "@/lib/chat-ai";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
  showTherapistRecommendation?: boolean;
}

export default function ChatScreen() {
  const router = useRouter();
  const { isDark, brandAccent } = useAuthTheme();
  const insets = useSafeAreaInsets();

  // ── Read mood params passed from the home screen ─────────────────────────
  // `mood`       → e.g. "Anxious"
  // `aiGreeting` → the tailored opening message for that mood
  const { mood, aiGreeting } = useLocalSearchParams<{
    mood?: string;
    aiGreeting?: string;
  }>();

  const openingMessage = aiGreeting ?? DEFAULT_GREETING;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: openingMessage,
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isEscalated, setIsEscalated] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const canSend = !isEscalated && inputValue.trim().length > 0;

  const scrollToBottom = useCallback((animated = true) => {
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated }), 120);
  }, []);

  const handleContentSizeChange = useCallback(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  // If the user arrived via a mood pill, show the "AI is typing" indicator
  // briefly before the greeting appears — makes it feel more alive.
  useEffect(() => {
    if (mood) {
      // Reset to empty first, show typing, then show the greeting
      setMessages([]);
      setIsTyping(true);
      setIsEscalated(false);
      setInputValue("");
      const timer = setTimeout(() => {
        setIsTyping(false);
        setMessages([
          {
            id: "1",
            text: openingMessage,
            sender: "ai",
            timestamp: new Date(),
          },
        ]);
        scrollToBottom();
      }, 1200); // 1.2 s typing indicator
      return () => clearTimeout(timer);
    }
  }, [mood, openingMessage, scrollToBottom]);

  const handleSendMessage = useCallback(() => {
    if (isEscalated) return;
    const trimmedInput = inputValue.trim();
    if (!trimmedInput) return;

    Haptics.selectionAsync().catch(() => undefined);

    const isCritical = isCriticalInput(trimmedInput);
    if (isCritical) setIsEscalated(true);

    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), text: trimmedInput, sender: "user", timestamp: new Date() },
    ]);
    setInputValue("");
    setIsTyping(true);
    scrollToBottom();

    setTimeout(() => {
      const emergencyLine =
        "If you are in immediate danger, call 1190 (Kenya Red Cross Mental Health Hotline) or 999 right now.";

      const aiText = isCritical
        ? `I'm really concerned about your safety based on what you shared. You deserve immediate support from a trained professional. ${emergencyLine}`
        : getAIResponse(trimmedInput);

      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: aiText,
          sender: "ai",
          timestamp: new Date(),
          showTherapistRecommendation: isCritical,
        },
      ]);
      scrollToBottom();
    }, 1000);
  }, [inputValue, isEscalated, scrollToBottom]);

  const iconColor = brandAccent;
  const keyboardVerticalOffset =
    Platform.OS === "ios" ? insets.bottom + 90 : insets.bottom + 24;

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
            iconColor={iconColor}
            isDark={isDark}
            onDismiss={() => router.setParams({ mood: undefined })}
          />
        )}

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
          keyboardVerticalOffset={keyboardVerticalOffset}
        >
          {/* ── Messages list ── */}
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
                  router.push({ pathname: "/(tabs)/therapists", params: { reason: "crisis" } })
                }
              />
            ))}

            {/* ── Typing indicator ── */}
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
