import { AppText, Button } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center px-8">
          <View className="w-20 h-20 rounded-full bg-muted items-center justify-center mb-6">
            <Ionicons name="alert-circle-outline" size={40} color="#9CA3AF" />
          </View>
          <AppText
            variant="heading"
            className="text-foreground text-center mb-2"
          >
            Page Not Found
          </AppText>
          <AppText
            variant="body"
            className="text-muted-foreground text-center mb-8 leading-5"
          >
            The page you're looking for doesn't exist or has been moved.
          </AppText>
          <Button
            text="Go Home"
            rightIcon="home-outline"
            onPress={() => router.replace("/(tabs)")}
          />
        </View>
      </SafeAreaView>
    </>
  );
}
