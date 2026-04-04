import { IconSymbol as Icon } from "@/components/ui/icon-symbol";
import { Input } from "@/components/ui/input";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onLocationPress: () => void;
  locationLoading?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  onLocationPress,
  locationLoading = false,
}) => {
  return (
    <View className="px-4 py-2 w-full bg-background">
      <View className="flex-row items-center bg-muted rounded-full px-1 py-1 shadow-sm">
        {/* Main Search Input */}
        <View className="flex-1">
          <Input
            placeholder="Search by name, specialty, or location..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="border-0 bg-transparent px-3 py-3 text-base"
            placeholderClassName="text-muted-foreground"
            iconName="search"
            // Remove default border and background since we're using the outer pill
          />
        </View>

        {/* Clear Button (appears only when there's text) */}
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchQuery("")}
            className="px-2"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        )}

        {/* Vertical divider */}
        <View className="w-px h-8 bg-border mx-1" />

        {/* Location Button */}
        <TouchableOpacity
          onPress={onLocationPress}
          disabled={locationLoading}
          className="px-3 py-3"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          {locationLoading ? (
            <ActivityIndicator size="small" color="#0d9488" />
          ) : (
            <Icon
              name="map-marker-radius-outline"
              size={24}
              color="hsl(var(--destructive))"
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};
