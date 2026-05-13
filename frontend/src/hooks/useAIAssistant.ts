import { Coords, haversineDistanceKm } from "@/lib/geo";
import { Therapist } from "@/lib/therapists/types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  recommendedTherapists?: Therapist[];
};

export const useAIAssistant = (
  moodLabel?: string,
  userCoords?: Coords | null,
) => {
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isEscalated, setIsEscalated] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // ── Refs to avoid stale closures without causing re-renders ─────────────
  const messagesRef = useRef<ChatMessage[]>([]);
  const systemPromptRef = useRef<string>("");
  const nearbyTherapistsRef = useRef<Therapist[]>([]);

  // Keep refs in sync
  messagesRef.current = messages;

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
    if (!therapists.length || !userCoords) return [];

    return therapists
      .filter((t: Therapist) => t.coords)
      .map((t: Therapist) => ({
        ...t,
        distanceKm: haversineDistanceKm(userCoords, t.coords!),
      }))
      .filter((t: Therapist & { distanceKm: number }) => t.distanceKm < 50)
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, 10);
  }, [therapists, userCoords]);

  // ── Keep nearbyTherapists ref in sync ────────────────────────────────────
  useEffect(() => {
    nearbyTherapistsRef.current = nearbyTherapists;
  }, [nearbyTherapists]);

  // ── Rebuild system prompt when location or therapists change ─────────────
  const systemPrompt = useMemo(() => {
    const prompt = userCoords
      ? buildSystemPrompt(nearbyTherapists, locationName, userCoords)
      : buildSystemPrompt([], locationName, null);
    systemPromptRef.current = prompt;
    return prompt;
  }, [nearbyTherapists, locationName, userCoords]);

  // Keep systemPrompt ref in sync
  useEffect(() => {
    systemPromptRef.current = systemPrompt;
  }, [systemPrompt]);

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
          text: DEFAULT_GREETING,
          sender: "ai",
          timestamp: new Date(),
        },
      ]);
    }
  }, [backendMessages, loadingHistory]);

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

        // Read from refs — no stale closure, no re-render trigger
        const currentMessages = messagesRef.current;
        const currentSystemPrompt = systemPromptRef.current;
        const currentNearbyTherapists = nearbyTherapistsRef.current;

        // Only send last 8 messages to keep token usage reasonable
        const recentMessages = currentMessages.slice(-8);

        const contents = [
          { role: "model", parts: [{ text: currentSystemPrompt }] },
          ...recentMessages.map((msg) => ({
            role: msg.sender === "ai" ? "model" : "user",
            parts: [{ text: msg.text }],
          })),
          { role: "user", parts: [{ text: trimmedText }] },
        ];

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents,
              generationConfig: { temperature: 0.7, maxOutputTokens: 800 },
            }),
          },
        );

        if (!res.ok) {
          const errorBody = await res.json().catch(() => ({}));
          console.error("Gemini error:", res.status, JSON.stringify(errorBody));

          if (res.status === 503) {
            throw new Error(
              "The AI service is temporarily unavailable. Please try again in a moment.",
            );
          } else if (res.status === 429) {
            throw new Error(
              "Too many requests. Please wait a moment and try again.",
            );
          }
          throw new Error(
            "Unable to reach the AI service. Please try again later.",
          );
        }

        const data = await res.json();
        let botText =
          data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
          "I'm having trouble responding right now. Please try again later.";

        // ── Tool interception ────────────────────────────────────────────
        let processedText = botText;
        let showRecommendation = false;
        let recommendedTherapists: Therapist[] = [];

        const toolRegex = /\[TOOL:SHOW_THERAPISTS\][\s\S]*?(?:\[\/TOOL\]|$)/;
        const toolMatch = botText.match(toolRegex);

        if (toolMatch) {
          processedText = botText
            .replace(toolRegex, "")
            .replace(/\*\*[^*]+\*\*/g, "")
            .replace(/\n{3,}/g, "\n\n")
            .trim();
          showRecommendation = true;
          recommendedTherapists = currentNearbyTherapists;
        }

        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: processedText,
          sender: "ai",
          timestamp: new Date(),
          showTherapistRecommendation: showRecommendation,
          recommendedTherapists: recommendedTherapists,
        };

        setMessages((prev) => [...prev, aiMessage]);
        await saveMessageToBackend(processedText, false);
      } catch (error: any) {
        console.error("AI Assistant Error:", error);
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            text:
              error.message ||
              "Sorry, I'm having trouble connecting. Please try again.",
            sender: "ai",
            timestamp: new Date(),
          },
        ]);
      } finally {
        setIsTyping(false);
      }
    },
    // messages intentionally removed from deps — using ref to prevent mood re-fire
    [isEscalated, saveMessageToBackend],
  );

  // ── Auto-send mood — stable because sendMessage no longer recreates ──────
  const moodSentRef = useRef<string | null>(null);

  useEffect(() => {
    if (moodLabel && !loadingHistory && moodSentRef.current !== moodLabel) {
      moodSentRef.current = moodLabel;
      sendMessage(`I'm feeling ${moodLabel.toLowerCase()}`);
    }
  }, [moodLabel, loadingHistory, sendMessage]);

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
