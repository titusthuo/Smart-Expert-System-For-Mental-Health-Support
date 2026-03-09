import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { AppText } from "@/components/ui";
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

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 120);
  };

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
  }, [mood, openingMessage]);

  const handleSendMessage = () => {
    if (isEscalated) return;

    const trimmedInput = inputValue.trim();
    if (!trimmedInput) return;

    const isCritical = isCriticalInput(trimmedInput);
    if (isCritical) {
      setIsEscalated(true);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: trimmedInput,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
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
  };

  const iconColor = brandAccent;

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />

      <SafeAreaView className="flex-1 bg-background">
        {/* ── Header ── */}
        <View className="flex-row items-center justify-between px-5 py-3 bg-card border-b border-border">
          <View className="flex-row items-center">
            {/* AI Avatar with online dot */}
            <View className="relative">
              <View className="w-11 h-11 rounded-full bg-brand items-center justify-center">
                <AppText unstyled className="text-white font-bold text-sm">
                  AI
                </AppText>
              </View>
              <View className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-card" />
            </View>

            <View className="ml-3">
              <AppText
                unstyled
                className="text-foreground font-bold text-base tracking-tight"
              >
                Mental Health Assistant
              </AppText>
              {/* If the user arrived with a mood, show it in the subtitle */}
              {mood ? (
                <AppText
                  unstyled
                  className="text-brand text-xs font-semibold mt-0.5"
                >
                  Chatting about feeling {mood.toLowerCase()}
                </AppText>
              ) : (
                <AppText
                  unstyled
                  className="text-green-500 text-xs font-medium mt-0.5"
                >
                  Online • Confidential
                </AppText>
              )}
            </View>
          </View>

          <TouchableOpacity className="w-9 h-9 rounded-full bg-muted items-center justify-center">
            <Ionicons
              name="information-circle-outline"
              size={20}
              color={isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.45)"}
            />
          </TouchableOpacity>
        </View>

        {/* ── Mood context banner (shown when arriving from a mood pill) ── */}
        {mood && (
          <View className="mx-4 mt-3 px-4 py-2.5 rounded-xl bg-brand/10 border border-brand/20 flex-row items-center gap-2">
            <Ionicons name="happy-outline" size={16} color={iconColor} />
            <AppText
              unstyled
              className="text-brand text-xs font-semibold flex-1"
            >
              You selected &quot;{mood}&quot; — our AI will support you through
              this
            </AppText>
            {/* Let the user dismiss the banner */}
            <TouchableOpacity
              onPress={() => router.setParams({ mood: undefined })}
            >
              <Ionicons
                name="close-circle"
                size={16}
                color={
                  isDark ? "rgba(167,139,250,0.6)" : "rgba(124,58,237,0.5)"
                }
              />
            </TouchableOpacity>
          </View>
        )}

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
          keyboardVerticalOffset={Platform.OS === "ios" ? insets.top : 0}
        >
          {/* ── Messages list ── */}
          <ScrollView
            ref={scrollViewRef}
            className="flex-1 bg-background"
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingTop: 24,
              paddingBottom: 140 + insets.bottom,
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            onContentSizeChange={scrollToBottom}
          >
            {messages.map((msg) => (
              <View key={msg.id} className="mb-5">
                <View
                  className={`flex-row items-end ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {/* AI avatar */}
                  {msg.sender === "ai" && (
                    <View className="w-8 h-8 rounded-full bg-brand items-center justify-center mr-2 mb-1 shrink-0">
                      <AppText
                        unstyled
                        className="text-white font-bold text-[10px]"
                      >
                        AI
                      </AppText>
                    </View>
                  )}

                  <View className="max-w-[76%]">
                    <View
                      className={
                        msg.sender === "user"
                          ? "bg-brand rounded-3xl rounded-br-sm px-4 py-3"
                          : "bg-card border border-border rounded-3xl rounded-bl-sm px-4 py-3"
                      }
                    >
                      <AppText
                        unstyled
                        className={
                          msg.sender === "user"
                            ? "text-white text-[15px] leading-6"
                            : "text-foreground text-[15px] leading-6"
                        }
                      >
                        {msg.text}
                      </AppText>
                    </View>

                    <AppText
                      unstyled
                      className={`text-xs text-muted-foreground mt-1.5 px-1 ${
                        msg.sender === "user" ? "text-right" : "text-left"
                      }`}
                    >
                      {msg.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </AppText>
                  </View>

                  {/* User avatar */}
                  {msg.sender === "user" && (
                    <View className="w-8 h-8 rounded-full bg-brand/60 items-center justify-center ml-2 mb-1 shrink-0">
                      <AppText
                        unstyled
                        className="text-white font-bold text-[10px]"
                      >
                        You
                      </AppText>
                    </View>
                  )}
                </View>

                {/* Critical warning banner */}
                {msg.showTherapistRecommendation && (
                  <View className="mt-4 mx-1 p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/30">
                    <View className="flex-row items-start gap-3">
                      <Ionicons name="alert-circle" size={24} color="#EAB308" />
                      <View className="flex-1">
                        <AppText
                          unstyled
                          className="text-foreground font-bold text-[15px] mb-1.5"
                        >
                          This sounds serious
                        </AppText>
                        <AppText
                          unstyled
                          className="text-muted-foreground text-sm leading-5 mb-4"
                        >
                          I&apos;m concerned about your safety. Please connect
                          with a mental health professional as soon as possible.
                          If you are in immediate danger, call 1190 (Kenya Red
                          Cross Mental Health Hotline) or 999 right now.
                        </AppText>
                        <TouchableOpacity
                          onPress={() =>
                            router.push({
                              pathname: "/(tabs)/therapists",
                              params: { reason: "crisis" },
                            })
                          }
                          className="bg-yellow-500 py-3 px-5 rounded-xl items-center"
                          activeOpacity={0.8}
                        >
                          <AppText
                            unstyled
                            className="text-black font-bold text-sm"
                          >
                            Find a Therapist Now
                          </AppText>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                )}
              </View>
            ))}

            {/* ── Typing indicator ── */}
            {isTyping && (
              <View className="flex-row items-end mb-5">
                <View className="w-8 h-8 rounded-full bg-brand items-center justify-center mr-2 mb-1 shrink-0">
                  <AppText
                    unstyled
                    className="text-white font-bold text-[10px]"
                  >
                    AI
                  </AppText>
                </View>
                <View className="bg-card border border-border rounded-3xl rounded-bl-sm px-4 py-3.5">
                  <View className="flex-row items-center gap-1.5">
                    {/* Three animated dots — pure layout trick using opacity classes */}
                    <View className="w-2 h-2 rounded-full bg-muted-foreground opacity-40" />
                    <View className="w-2 h-2 rounded-full bg-muted-foreground opacity-70" />
                    <View className="w-2 h-2 rounded-full bg-muted-foreground opacity-100" />
                  </View>
                </View>
              </View>
            )}
          </ScrollView>

          {/* ── Input area ── */}
          <View
            className="border-t border-border bg-card px-4 pt-3"
            style={{ paddingBottom: Math.max(24, 12 + insets.bottom) }}
          >
            <View className="flex-row items-end">
              <TextInput
                value={inputValue}
                onChangeText={setInputValue}
                placeholder={
                  isEscalated
                    ? "Chat paused — use the therapist directory"
                    : "Type your message..."
                }
                placeholderTextColor={
                  isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)"
                }
                editable={!isEscalated}
                className="flex-1 bg-muted border border-border rounded-3xl px-5 py-3 text-[15px] text-foreground max-h-36"
                multiline
                textAlignVertical="top"
                onSubmitEditing={handleSendMessage}
                blurOnSubmit={false}
              />

              <TouchableOpacity
                onPress={handleSendMessage}
                disabled={!canSend}
                className={`ml-3 mb-1 w-12 h-12 rounded-full bg-brand items-center justify-center ${
                  !canSend ? "opacity-40" : "active:opacity-80"
                }`}
                activeOpacity={0.8}
              >
                <Ionicons name="send" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <AppText
              unstyled
              className="text-center text-xs text-muted-foreground mt-3 opacity-70"
            >
              {isEscalated
                ? "For your safety, MindEase KE has paused the chat. If you are in immediate danger, call 1190 or 999 right now."
                : "This AI provides general wellness support. For urgent help, contact emergency services."}
            </AppText>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}
