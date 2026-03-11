import { AppText } from "@/components/ui";
import React from "react";
import { ScrollView, TouchableOpacity } from "react-native";

export function CategoryTabs({
  categories,
  activeCategory,
  onChangeCategory,
}: {
  categories: string[];
  activeCategory: string;
  onChangeCategory: (value: string) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="px-5 pt-5 pb-4"
    >
      {categories.map((cat) => {
        const isActive = activeCategory === cat;
        return (
          <TouchableOpacity
            key={cat}
            onPress={() => onChangeCategory(cat)}
            className={`mr-3 px-5 py-2.5 rounded-full border ${
              isActive ? "bg-brand border-brand" : "bg-card border-border"
            }`}
            accessibilityRole="button"
            accessibilityLabel={`Filter by ${cat === "all" ? "All Topics" : cat}`}
          >
            <AppText
              unstyled
              className={`font-medium capitalize ${
                isActive ? "text-white" : "text-foreground"
              }`}
            >
              {cat === "all"
                ? "All Topics"
                : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </AppText>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
