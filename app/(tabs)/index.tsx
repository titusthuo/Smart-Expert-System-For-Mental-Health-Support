import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-green-500">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View className="items-center justify-center p-8 w-full bg-green-500">
          <Text className="text-foreground text-4xl font-bold mb-8 text-center">
            Welcome to Your Mental Health Support App
          </Text>

          <Text className="text-primary text-2xl mb-6 text-center">
            Primary accent text (your deep/dark blue from theme)
          </Text>

          <Text className="text-muted-foreground text-lg mb-10 text-center max-w-md">
            This is a test screen. Your custom colors and dark/light mode should
            now work perfectly. Toggle your phone display mode to see the
            switch!
          </Text>

          {/* Card example */}
          <View className="w-5/6 bg-card border border-border rounded-2xl p-6 shadow-lg items-center">
            <Text className="text-card-foreground text-xl font-medium mb-4">
              Sample Card
            </Text>
            <Text className="text-muted-foreground text-base text-center">
              This card uses your --card and --card-foreground variables. Add
              more content here as you build your app.
            </Text>
          </View>

          {/* Optional: Add a button test */}
          <View className="mt-10 bg-primary rounded-full px-8 py-4">
            <Text className="text-primary-foreground text-lg font-semibold">
              Primary Button Example
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
