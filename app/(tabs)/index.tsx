import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Dimensions,
    Image,
    Platform,
    ScrollView,
    StatusBar,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { HomeDialogs } from "@/components/home/home-dialogs";
import { ImageWithFallback } from "@/components/home/image-with-fallback";
import { PressableCard } from "@/components/home/pressable-card";
import { AppText, Button } from "@/components/ui";
import { useAuthTheme } from "@/hooks/use-auth-theme";
import { openUrlSafely } from "@/lib/links";
import { MOODS, MoodLabel } from "@/lib/moods";
import { getStoredJson } from "@/lib/storage";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const SPACING = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
} as const;

const CRISIS_HELPLINE = {
  name: "Kenya Red Cross",
  number: "1199",
} as const;

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const router = useRouter();
  const { border, brand, brandAccent, isDark, subtle, surface, text } = useAuthTheme();

  const [callConfirmVisible, setCallConfirmVisible] = useState(false);

  const [infoVisible, setInfoVisible] = useState(false);
  const [infoTitle, setInfoTitle] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  const [profileName, setProfileName] = useState<string>("John Doe");

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const parsed = await getStoredJson<{ name?: unknown }>("profileData");
        if (!mounted || !parsed) return;
        if (typeof parsed?.name === "string" && parsed.name.trim()) {
          setProfileName(parsed.name.trim());
        }
      } catch {
        // ignore
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const firstName = useMemo(() => {
    const parts = profileName.trim().split(/\s+/).filter(Boolean);
    return parts[0] ?? "";
  }, [profileName]);

  const avatarInitials = useMemo(() => {
    const parts = profileName.trim().split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] ?? "";
    const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
    return (first + last).toUpperCase() || "U";
  }, [profileName]);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  const openInfo = useCallback((title: string, message: string) => {
    setInfoTitle(title);
    setInfoMessage(message);
    setInfoVisible(true);
  }, []);

  const tryHaptics = useCallback(
    (fn: () => Promise<unknown>) => {
      fn().catch(() => undefined);
    },
    []
  );

  const placeHelplineCall = useCallback(async () => {
    const url =
      Platform.OS === "ios"
        ? `telprompt:${CRISIS_HELPLINE.number}`
        : `tel:${CRISIS_HELPLINE.number}`;

    try {
      const opened = await openUrlSafely(url);
      if (!opened) {
        openInfo(
          "Unable to place call",
          "Calling is not available on this device."
        );
        return;
      }
    } catch {
      openInfo(
        "Unable to place call",
        "Something went wrong while trying to start the call."
      );
    }
  }, [openInfo]);

  const handleCallNow = useCallback(() => {
    tryHaptics(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium));
    setCallConfirmVisible(true);
  }, [tryHaptics]);

  // Tracks which mood pill is highlighted (null = none selected yet)
  const [selectedMood, setSelectedMood] = useState<MoodLabel | null>(null);

  const logoImage = require("../../assets/logos/brain.jpg");
  const heroImage = require("../../assets/images/image-1.jpg");
  const gridImage1 = require("../../assets/images/image-2.png");
  const gridImage2 = require("../../assets/images/image-3.jpg");

  const HERO_HEIGHT = SCREEN_WIDTH < 400 ? 190 : 230;
  const GRID_IMG_HEIGHT = SCREEN_WIDTH < 400 ? 120 : 148;
  const INSIGHT_CARD_WIDTH = Math.min(320, Math.max(248, Math.round(SCREEN_WIDTH * 0.72)));

  // ── Mood pill tap handler ────────────────────────────────────────────────
  const handleMoodSelect = (mood: (typeof MOODS)[number]) => {
    setSelectedMood(mood.label);

    tryHaptics(() => Haptics.selectionAsync());

    // Small delay so the user sees the pill highlight before navigation
    setTimeout(() => {
      router.push({
        pathname: "/(tabs)/chat",
        params: {
          mood: mood.label,
          // Pass the AI greeting as a param so the chat screen can use it
          // as the very first AI message instead of the generic one.
          aiGreeting: mood.aiGreeting,
        },
      });
    }, 300);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />

      {/* ══════════════════════════════════════════
          HEADER
      ══════════════════════════════════════════ */}
      <View className="flex-row items-center justify-between px-5 bg-card border-b border-border h-14">
        <View className="flex-row items-center gap-2.5">
          <View className="w-9 h-9 rounded-full overflow-hidden border border-border">
            <Image
              source={logoImage}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
              accessibilityLabel="Mentally logo"
            />
          </View>
          <View>
            <AppText
              unstyled
              className="text-foreground font-bold text-[18px] tracking-tight leading-tight"
            >
              Mentally
            </AppText>
            <AppText
              unstyled
              className="text-muted-foreground text-[11px] font-medium"
            >
              Your wellness companion
            </AppText>
          </View>
        </View>

        <View className="flex-row items-center gap-2.5">
          <TouchableOpacity
            className="w-9 h-9 rounded-full bg-muted items-center justify-center"
            accessibilityRole="button"
            accessibilityLabel="Notifications"
            activeOpacity={0.8}
          >
            <Ionicons
              name="notifications-outline"
              size={20}
              color={subtle}
            />
          </TouchableOpacity>
          <View
            className="w-9 h-9 rounded-full items-center justify-center border"
            style={{ backgroundColor: brand, borderColor: border }}
            accessibilityLabel="Profile"
          >
            <AppText unstyled className="text-white font-bold text-[13px]">
              {avatarInitials}
            </AppText>
          </View>
        </View>
      </View>

      {/* ══════════════════════════════════════════
          SCROLLABLE BODY
      ══════════════════════════════════════════ */}
      <ScrollView
        className="flex-1 bg-background"
        contentContainerStyle={{
          paddingHorizontal: SPACING.md,
          paddingTop: SPACING.lg,
          paddingBottom: SPACING.xl,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Greeting ─────────────────────────────── */}
        <View style={{ marginBottom: SPACING.xl }}>
          <AppText
            unstyled
            className="text-foreground text-2xl font-bold tracking-tight mb-1"
          >
            {greeting}
            {firstName ? `, ${firstName}` : ""} 👋
          </AppText>
          <AppText unstyled className="text-muted-foreground text-sm leading-5">
            How are you feeling right now? I’m here with you.
          </AppText>
        </View>

        {/* ── Mood check-in section ─────────────────── */}
        <View style={{ marginBottom: SPACING.xl }}>
          {/* Section label */}
          <View className="flex-row items-center gap-2 mb-3">
            <Ionicons name="happy-outline" size={16} color={brandAccent} />
            <AppText
              unstyled
              className="text-foreground font-bold text-sm tracking-tight"
            >
              How are you feeling right now?
            </AppText>
          </View>

          {/* Hint text — tells the user what tapping a pill does */}
          <AppText
            unstyled
            className="text-muted-foreground text-xs mb-3 leading-4"
          >
            Tap a mood and our AI will start a conversation tailored just for
            you.
          </AppText>

          {/* Pill row */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: SPACING.md, gap: 10 }}
          >
            {MOODS.map((mood) => {
              const isSelected = selectedMood === mood.label;
              return (
                <TouchableOpacity
                  key={mood.label}
                  activeOpacity={0.75}
                  onPress={() => handleMoodSelect(mood)}
                  className="flex-row items-center gap-1.5 px-4 py-2.5 rounded-full border"
                  style={{
                    backgroundColor: isSelected ? brand : surface,
                    borderColor: isSelected ? brand : border,
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={`Mood: ${mood.label}`}
                >
                  <AppText unstyled className="text-base">
                    {mood.emoji}
                  </AppText>
                  <AppText
                    unstyled
                    className="text-sm font-semibold"
                    style={{ color: isSelected ? "#FFFFFF" : text }}
                  >
                    {mood.label}
                  </AppText>
                  {/* Show a small arrow on selected to hint "navigating" */}
                  {isSelected && (
                    <Ionicons name="arrow-forward" size={13} color="#FFFFFF" />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* ── Hero image card ───────────────────────── */}
        <View
          className="rounded-2xl overflow-hidden border border-border bg-card"
          style={{ marginBottom: SPACING.lg }}
        >
          <ImageWithFallback
            source={heroImage}
            alt="People meditating in a peaceful setting"
            style={{ height: HERO_HEIGHT, width: "100%" }}
          />
          <View className="absolute inset-0" pointerEvents="none">
            <View className="flex-1" />
            <View style={{ height: HERO_HEIGHT * 0.55 }}>
              <View
                style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.08)" }}
              />
              <View
                style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.22)" }}
              />
              <View
                style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.42)" }}
              />
            </View>
          </View>

          <View className="absolute bottom-0 left-0 right-0 px-4 py-3">
            <AppText unstyled className="text-white font-bold text-base">
              A calmer moment, right now
            </AppText>
            <AppText unstyled className="text-white/80 text-xs mt-0.5">
              Small steps add up. You don’t have to do this alone.
            </AppText>
          </View>
        </View>

        <View
          className="rounded-2xl bg-card border border-border p-4"
          style={{ marginBottom: SPACING.lg }}
        >
          <View className="flex-row items-center gap-2 mb-2">
            <Ionicons
              name="bulb-outline"
              size={18}
              color={isDark ? "#4ADE80" : "#16A34A"}
            />
            <AppText unstyled className="text-green-600 font-bold text-sm">
              Daily Wellness Tip
            </AppText>
          </View>
          <AppText unstyled className="text-foreground text-[13px] leading-5">
            Try{" "}
            <AppText unstyled className="font-bold">
              4-7-8 breathing
            </AppText>
            : inhale 4, hold 7, exhale 8.
          </AppText>
        </View>

        {/* ── Image grid ────────────────────────────── */}
        <AppText
          unstyled
          className="text-foreground font-bold text-base tracking-tight"
          style={{ marginBottom: SPACING.sm }}
        >
          Wellness Insights
        </AppText>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="-mr-4"
        >
          <View className="flex-row pr-4">
            <PressableCard
              className="mr-3 bg-card border border-border rounded-2xl overflow-hidden"
              style={{ width: INSIGHT_CARD_WIDTH }}
            >
              <ImageWithFallback
                source={gridImage1}
                alt="Woman practising self care"
                style={{ height: GRID_IMG_HEIGHT, width: "100%" }}
              />
              <View className="p-3">
                <View className="flex-row items-center gap-1 mb-1">
                  <Ionicons
                    name="heart-outline"
                    size={12}
                    color={brandAccent}
                  />
                  <AppText
                    unstyled
                    className="text-brand text-[10px] font-bold uppercase tracking-wide"
                  >
                    Self-Care
                  </AppText>
                </View>
                <AppText
                  unstyled
                  className="text-foreground text-[13px] font-bold leading-5"
                >
                  Self-Care Matters
                </AppText>
                <AppText
                  unstyled
                  className="text-muted-foreground text-[11px] leading-4 mt-0.5"
                >
                  Prioritize your mental well-being every day
                </AppText>
              </View>
            </PressableCard>

            <PressableCard
              className="bg-card border border-border rounded-2xl overflow-hidden"
              style={{ width: INSIGHT_CARD_WIDTH }}
            >
              <ImageWithFallback
                source={gridImage2}
                alt="Mental health education"
                style={{ height: GRID_IMG_HEIGHT, width: "100%" }}
              />
              <View className="p-3">
                <View className="flex-row items-center gap-1 mb-1">
                  <Ionicons
                    name="flask-outline"
                    size={12}
                    color={isDark ? "#4ADE80" : "#16A34A"}
                  />
                  <AppText
                    unstyled
                    className="text-[10px] font-bold uppercase tracking-wide"
                    style={{ color: isDark ? "#4ADE80" : "#16A34A" }}
                  >
                    Research
                  </AppText>
                </View>
                <AppText
                  unstyled
                  className="text-foreground text-[13px] font-bold leading-5"
                >
                  Evidence-Based Support
                </AppText>
                <AppText
                  unstyled
                  className="text-muted-foreground text-[11px] leading-4 mt-0.5"
                >
                  Resources backed by scientific research
                </AppText>
              </View>
            </PressableCard>
          </View>
        </ScrollView>

        {/* ── Emergency banner ──────────────────────── */}
        <View
          className="rounded-2xl border p-4 flex-row items-center gap-3"
          style={{
            marginTop: SPACING.xl,
            borderColor: isDark ? "rgba(168,85,247,0.25)" : "rgba(124,58,237,0.25)",
            backgroundColor: isDark ? "rgba(168,85,247,0.10)" : "rgba(124,58,237,0.08)",
          }}
        >
          <View className="w-10 h-10 rounded-full items-center justify-center shrink-0" style={{ backgroundColor: isDark ? "rgba(168,85,247,0.18)" : "rgba(124,58,237,0.14)" }}>
            <Ionicons
              name="call"
              size={18}
              color={brandAccent}
            />
          </View>
          <View className="flex-1">
            <AppText
              unstyled
              className="text-foreground font-bold text-[13px] mb-0.5"
            >
              Need to talk to someone?
            </AppText>
            <AppText
              unstyled
              className="text-muted-foreground text-[11px] leading-4"
            >
              Free, confidential support is available 24/7.
            </AppText>
          </View>
          <Button text="Call" onPress={handleCallNow} className="h-11 px-4" />
        </View>

        <View className="h-6" />
      </ScrollView>

      <HomeDialogs
        callConfirmVisible={callConfirmVisible}
        onCloseCallConfirm={() => setCallConfirmVisible(false)}
        helplineName={CRISIS_HELPLINE.name}
        helplineNumber={CRISIS_HELPLINE.number}
        onConfirmCall={() => {
          setCallConfirmVisible(false);
          tryHaptics(() =>
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
          );
          placeHelplineCall().catch(() => undefined);
        }}
        infoVisible={infoVisible}
        infoTitle={infoTitle}
        infoMessage={infoMessage}
        onCloseInfo={() => setInfoVisible(false)}
      />
    </SafeAreaView>
  );
}
