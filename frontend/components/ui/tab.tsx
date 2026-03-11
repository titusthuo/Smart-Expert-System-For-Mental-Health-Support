import { Text, TouchableOpacity, View } from "react-native";

type TabItem = {
  key: string;
  label: string;
  onPress: () => void;
};

type TabStripProps = {
  tabs: [TabItem, TabItem];
  activeKey: string;
  className?: string;
};

export function TabStrip({ tabs, activeKey, className }: TabStripProps) {
  return (
    <View
      className={["flex-row border-b border-border", className]
        .filter(Boolean)
        .join(" ")}
    >
      {tabs.map((tab) => {
        const isActive = tab.key === activeKey;
        return (
          <TouchableOpacity
            key={tab.key}
            onPress={tab.onPress}
            activeOpacity={isActive ? 1 : 0.7}
            className="flex-1 items-center py-3.5 relative"
          >
            <Text
              className={[
                "text-[14px]",
                isActive
                  ? "font-bold text-brand"
                  : "font-medium text-muted-foreground",
              ].join(" ")}
            >
              {tab.label}
            </Text>

            {isActive && (
              <View className="absolute -bottom-[1px] left-[20%] right-[20%] h-0.5 rounded bg-brand" />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
