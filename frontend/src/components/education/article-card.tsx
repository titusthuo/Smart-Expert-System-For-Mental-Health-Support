import { AppText } from "@/components/ui";
import { Article } from "@/lib/education";
import { BookOpen, ExternalLink } from "lucide-react-native";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";

export function ArticleCard({
  article,
  subtle,
  brandAccent,
  onPressReadMore,
}: {
  article: Article;
  subtle: string;
  brandAccent: string;
  onPressReadMore: () => void;
}) {
  return (
    <View className="bg-card rounded-xl overflow-hidden shadow-sm border border-border">
      <Image
        source={{ uri: article.image }}
        className="w-full h-48"
        resizeMode="cover"
      />

      <View className="p-5">
        <View className="flex-row justify-between items-center mb-3">
          <View className="bg-brandSoft px-3 py-1 rounded-full">
            <AppText unstyled className="text-brand text-xs font-medium capitalize">
              {article.category}
            </AppText>
          </View>
          <AppText unstyled className="text-muted-foreground text-xs">
            {article.readTime}
          </AppText>
        </View>

        <AppText unstyled className="text-lg font-semibold text-foreground mb-2">
          {article.title}
        </AppText>

        <AppText
          unstyled
          className="text-muted-foreground text-sm mb-4"
          numberOfLines={3}
        >
          {article.summary}
        </AppText>

        <View className="flex-row flex-wrap justify-between items-center gap-3">
          <View className="flex-row items-center flex-1">
            <BookOpen size={16} color={subtle} />
            <AppText
              unstyled
              className="text-muted-foreground text-xs ml-1.5 flex-shrink"
              numberOfLines={1}
            >
              Source: {article.source}
            </AppText>
          </View>

          <TouchableOpacity
            onPress={onPressReadMore}
            className="flex-row items-center px-4 py-2 border border-brand rounded-lg flex-shrink-0"
            accessibilityRole="button"
            accessibilityLabel={`Read more: ${article.title}`}
          >
            <AppText unstyled className="text-brand font-medium text-sm mr-1.5">
              Read More
            </AppText>
            <ExternalLink size={16} color={brandAccent} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
