import { AppText } from "@/components/ui";
import { useAuthTheme } from "@/hooks/use-auth-theme";
import { Moon, Smartphone, Sun } from "lucide-react-native";
import React from "react";
import { TouchableOpacity, View } from "react-native";

export type ThemeMode = "system" | "light" | "dark";

function ModeRow({
  title,
  subtitle,
  icon,
  selected,
  onPress,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      className="flex-row items-center justify-between py-3 px-2 active:opacity-90 rounded-lg"
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Set theme to ${title}`}
    >
      <View className="flex-row items-center flex-1">
        {icon}
        <View className="ml-3">
          <AppText unstyled className="font-medium text-foreground">
            {title}
          </AppText>
          <AppText unstyled className="text-sm text-muted-foreground">
            {subtitle}
          </AppText>
        </View>
      </View>
      <View
        className={[
          "w-5 h-5 rounded-full border",
          selected ? "bg-brand border-brand" : "border-border",
        ].join(" ")}
      />
    </TouchableOpacity>
  );
}

export function AppearanceCard({
  mode,
  onChangeMode,
}: {
  mode: ThemeMode;
  onChangeMode: (mode: ThemeMode) => void;
}) {
  const { subtle } = useAuthTheme();

  return (
    <View className="bg-card rounded-2xl p-6 mb-6 shadow-sm border border-border">
      <AppText unstyled className="font-semibold text-foreground text-lg mb-4">
        Appearance
      </AppText>

      <View className="space-y-3">
        <ModeRow
          title="System"
          subtitle="Match your device setting"
          icon={<Smartphone size={20} color={subtle} />}
          selected={mode === "system"}
          onPress={() => onChangeMode("system")}
        />

        <ModeRow
          title="Light"
          subtitle="Always use light mode"
          icon={<Sun size={20} color={subtle} />}
          selected={mode === "light"}
          onPress={() => onChangeMode("light")}
        />

        <ModeRow
          title="Dark"
          subtitle="Always use dark mode"
          icon={<Moon size={20} color={subtle} />}
          selected={mode === "dark"}
          onPress={() => onChangeMode("dark")}
        />
      </View>
    </View>
  );
}
