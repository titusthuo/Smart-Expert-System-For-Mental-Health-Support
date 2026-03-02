import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export type TabStripColors = {
  border: string;
  subtle: string;
  brand: string;
};

export type TabItem = {
  key: string;
  label: string;
  onPress: () => void;
};

type TabStripProps = {
  tabs: [TabItem, TabItem];
  activeKey: string;
  colors: TabStripColors;
};

export function TabStrip({ tabs, activeKey, colors }: TabStripProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}
    >
      {tabs.map((tab) => {
        const isActive = tab.key === activeKey;
        return (
          <TouchableOpacity
            key={tab.key}
            onPress={tab.onPress}
            activeOpacity={isActive ? 1 : 0.7}
            style={{
              flex: 1,
              alignItems: "center",
              paddingVertical: 14,
              position: "relative",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: isActive ? "700" : "500",
                color: isActive ? colors.brand : colors.subtle,
              }}
            >
              {tab.label}
            </Text>

            {isActive && (
              <View
                style={{
                  position: "absolute",
                  bottom: -1,
                  left: "20%",
                  right: "20%",
                  height: 2,
                  borderRadius: 1,
                  backgroundColor: colors.brand,
                }}
              />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
