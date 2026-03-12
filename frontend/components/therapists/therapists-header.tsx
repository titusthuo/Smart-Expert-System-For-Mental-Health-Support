import { useAuthTheme } from "@/hooks/use-auth-theme";
import { locationOptions, specializationOptions } from "@/lib/therapists/options";
import { MapPin, Search } from "lucide-react-native";
import React from "react";
import { ScrollView, TextInput, View } from "react-native";

import { AppText } from "@/components/ui";

import { FilterDropdown } from "./filter-dropdown";

type TherapistsHeaderProps = {
  reason?: string;
  searchQuery: string;
  onChangeSearchQuery: (text: string) => void;

  specializationLabel: string;
  locationLabel: string;
  onChangeSpecialization: (value: string) => void;
  onChangeLocation: (value: string) => void;

  usingFallbackLocation: boolean;
};

export function TherapistsHeader({
  reason,
  searchQuery,
  onChangeSearchQuery,
  specializationLabel,
  locationLabel,
  onChangeSpecialization,
  onChangeLocation,
  usingFallbackLocation,
}: TherapistsHeaderProps) {
  const { subtle } = useAuthTheme();

  return (
    <View className="bg-card border-b border-border pb-4">
      <View className="px-4 pt-4">
        <AppText unstyled className="text-2xl font-serif text-foreground mb-4">
          Find a Therapist
        </AppText>

        {reason === "crisis" && (
          <View className="mb-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30 p-4">
            <AppText unstyled className="text-foreground font-semibold mb-2">
              You&apos;re not alone
            </AppText>
            <AppText unstyled className="text-muted-foreground">
              If you are in immediate danger, call 1190 (Kenya Red Cross Mental Health Hotline) or 999 right now.
            </AppText>
          </View>
        )}

        <View className="relative mb-4">
          <View className="absolute left-3 top-[14px] z-10">
            <Search size={20} color={subtle} />
          </View>
          <TextInput
            placeholder="Search for therapists or specializations..."
            value={searchQuery}
            onChangeText={onChangeSearchQuery}
            className="bg-card border border-border rounded-lg pl-11 py-3 text-base text-foreground"
            placeholderTextColor={subtle}
            accessibilityLabel="Search therapists"
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-3">
            <FilterDropdown
              label={specializationLabel}
              options={specializationOptions}
              onChange={onChangeSpecialization}
            />

            <FilterDropdown
              label={locationLabel}
              options={locationOptions}
              onChange={onChangeLocation}
            />
          </View>
        </ScrollView>

        <View className="flex-row items-center mt-3">
          <MapPin size={14} color={subtle} />
          <AppText unstyled className="text-sm text-muted-foreground ml-1">
            {usingFallbackLocation
              ? "Results based on a nearby default location"
              : "Results based on your location"}
          </AppText>
        </View>
      </View>
    </View>
  );
}
