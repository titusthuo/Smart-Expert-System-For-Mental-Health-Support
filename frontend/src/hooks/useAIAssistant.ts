// src/hooks/useAIAssistant.ts
import { Coords, haversineDistanceKm } from "@/lib/geo";
import { Therapist } from "@/lib/therapists/types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { buildSystemPrompt, resolveKenyanCity } from "../constants/aiPrompt";
import { useAIChatMessages, useSendAIChatMessage } from "./useAIChatMessages";
import { useTherapists } from "./useTherapists";

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

export const useAIAssistant = (
  aiGreeting?: string,
  userCoords?: Coords | null, // ← new param
) => {
  const openingMessage = aiGreeting ?? DEFAULT_GREETING;

  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isEscalated, setIsEscalated] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // ── Backend chat history ─────────────────────────────────────────────────
  const {
    messages: backendMessages,
    loading: loadingHistory,
    refetch,
  } = useAIChatMessages();
  const { sendMessage: saveMessageToBackend } = useSendAIChatMessage();

  // ── Therapist data ───────────────────────────────────────────────────────
  const { therapists } = useTherapists();

  // ── Resolve city name from GPS coords ────────────────────────────────────
  const [locationName, setLocationName] = useState("Kenya");

  useEffect(() => {
    const resolveLocation = async () => {
      if (!userCoords) {
        setLocationName("Kenya");
        return;
      }

      try {
        const city = await resolveKenyanCity(userCoords);
        setLocationName(city);
      } catch (error) {
        console.error("Failed to resolve location:", error);
        setLocationName("Kenya");
      }
    };

    resolveLocation();
  }, [userCoords]);

  // ── Sort therapists by distance from user ────────────────────────────────
  const nearbyTherapists = useMemo(() => {
    if (!therapists.length) return [];

    return therapists
      .map((t: Therapist) => ({
        ...t,
        distanceKm:
          t.coords && userCoords
            ? haversineDistanceKm(userCoords, t.coords)
            : Number.POSITIVE_INFINITY,
      }))
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [therapists, userCoords]);

  // ── Sync with backend history; fall back to welcome message ─────────────
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

  // ── Send message ─────────────────────────────────────────────────────────
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

        // Build location-aware system prompt with nearby therapists injected
        const systemPrompt = buildSystemPrompt(
          nearbyTherapists,
          locationName,
          userCoords ?? null,
        );

        const contents = [
          { role: "model", parts: [{ text: systemPrompt }] },
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

        // ── Tool interception ────────────────────────────────────────────
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
    [
      messages,
      isEscalated,
      saveMessageToBackend,
      nearbyTherapists,
      locationName,
      userCoords,
    ],
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
