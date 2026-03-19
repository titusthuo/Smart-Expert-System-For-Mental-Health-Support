// frontend/src/hooks/useAIAssistant.ts
import { useCallback, useEffect, useState } from "react";
import { SYSTEM_PROMPT } from "../constants/aiPrompt";
import { useAIChatMessages, useSendAIChatMessage } from "./useAIChatMessages";

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || "";

const DEFAULT_GREETING =
  "Hi! I'm your Mental Health Companion in the Smart Expert System for Mental Health Support.\n\nHow are you feeling today? You can share anything — stress, anxiety, low mood, relationship worries, or just how your day is going.\n\nI'm here to listen and offer supportive tips, but remember: I'm not a licensed therapist and cannot diagnose or replace professional care. If you'd like, I can also help you find nearby therapists.";

export type ChatMessage = {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
  showTherapistRecommendation?: boolean;
};

export const useAIAssistant = (aiGreeting?: string) => {
  const openingMessage = aiGreeting ?? DEFAULT_GREETING;

  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isEscalated, setIsEscalated] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const {
    messages: backendMessages,
    loading: loadingHistory,
    refetch,
  } = useAIChatMessages();
  const { sendMessage: saveMessageToBackend } = useSendAIChatMessage();

  // Sync with backend history; fall back to welcome message
  useEffect(() => {
    if (backendMessages.length > 0) {
      const formatted: ChatMessage[] = backendMessages.map((msg: any) => ({
        id: msg.id.toString(),
        text: msg.text,
        sender: msg.isFromUser ? "user" : "ai",
        timestamp: new Date(msg.createdAt),
        showTherapistRecommendation: false,
      }));
      setMessages(formatted);
    } else if (!loadingHistory) {
      setMessages([
        {
          id: "greeting-1",
          text: openingMessage,
          sender: "ai",
          timestamp: new Date(),
        },
      ]);
    }
  }, [backendMessages, loadingHistory, openingMessage]);

  const sendMessage = useCallback(
    async (userText: string) => {
      if (!userText.trim() || isEscalated) return;

      const trimmedText = userText.trim();

      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        text: trimmedText,
        sender: "user",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInputValue("");
      setIsTyping(true);

      try {
        await saveMessageToBackend(trimmedText, true);

        const contents = [
          { role: "model", parts: [{ text: SYSTEM_PROMPT }] },
          ...messages.map((msg) => ({
            role: msg.sender === "ai" ? "model" : "user",
            parts: [{ text: msg.text }],
          })),
          { role: "user", parts: [{ text: trimmedText }] },
        ];

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents,
              generationConfig: { temperature: 0.7, maxOutputTokens: 800 },
            }),
          },
        );

        if (!res.ok) throw new Error(`Gemini API error: ${res.status}`);

        const data = await res.json();
        let botText =
          data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
          "I'm having trouble responding right now. Please try again.";

        // ── Tool interception ────────────────────────────────────────────────
        let processedText = botText;
        let showRecommendation = false;

        if (processedText.includes("[TOOL:SHOW_THERAPISTS]")) {
          processedText = processedText.replace(
            /\[TOOL:SHOW_THERAPISTS\](.*?)\[\/TOOL\]/s,
            "$1",
          );
          showRecommendation = true;
        }

        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: processedText,
          sender: "ai",
          timestamp: new Date(),
          showTherapistRecommendation: showRecommendation,
        };

        setMessages((prev) => [...prev, aiMessage]);
        await saveMessageToBackend(processedText, false);
      } catch (error: any) {
        console.error("AI Assistant Error:", error);
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            text: "Sorry, I'm having trouble connecting. Please try again.",
            sender: "ai",
            timestamp: new Date(),
          },
        ]);
      } finally {
        setIsTyping(false);
      }
    },
    [messages, isEscalated, saveMessageToBackend],
  );

  const refreshChat = useCallback(() => refetch(), [refetch]);

  return {
    messages,
    inputValue,
    setInputValue,
    isTyping,
    isEscalated,
    setIsEscalated,
    sendMessage,
    refreshChat,
  };
};
