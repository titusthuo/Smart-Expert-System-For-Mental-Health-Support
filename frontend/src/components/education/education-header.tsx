import { AppText } from "@/components/ui";
import { BookOpen, Search } from "lucide-react-native";
import React from "react";
import { TextInput, View } from "react-native";

export function EducationHeader({
  searchQuery,
  onChangeSearchQuery,
  subtle,
}: {
  searchQuery: string;
  onChangeSearchQuery: (value: string) => void;
  subtle: string;
}) {
  return (
    <View className="bg-card border-b border-border">
      <View className="px-5 pt-5 pb-4">
        <View className="flex-row items-center mb-4">
          <BookOpen size={32} color={subtle} />
          <AppText unstyled className="text-2xl font-bold text-foreground ml-3">
            Mental Health Education
          </AppText>
        </View>

        <View className="relative">
          <View className="absolute left-3 top-[14px] z-10">
            <Search size={20} color={subtle} />
          </View>
          <TextInput
            placeholder="Search articles and resources..."
            value={searchQuery}
            onChangeText={onChangeSearchQuery}
            className="bg-card border border-border rounded-lg pl-11 py-3 text-base text-foreground"
            placeholderTextColor={subtle}
          />
        </View>
      </View>
    </View>
  );
}
