import { ExternalLink } from "@/components/external-link";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Collapsible } from "@/components/ui/collapsible";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Image } from "expo-image";
import { Platform, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabTwoScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ParallaxScrollView
        headerBackgroundColor={{
          light: "hsl(var(--card))",
          dark: "hsl(var(--card))",
        }}
        headerImage={
          <View className="absolute -bottom-[90px] -left-[35px]">
            <IconSymbol
              size={310}
              color="hsl(var(--muted-foreground))"
              name="chevron.left.forwardslash.chevron.right"
            />
          </View>
        }
      >
        <ThemedView className="flex-row items-center gap-2">
          <ThemedText type="title" className="font-rounded">
            Explore
          </ThemedText>
        </ThemedView>

        <ThemedText>
          This app includes example code to help you get started.
        </ThemedText>

        <Collapsible title="File-based routing">
          <ThemedText>
            This app has two screens:{" "}
            <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText>{" "}
            and{" "}
            <ThemedText type="defaultSemiBold">
              app/(tabs)/explore.tsx
            </ThemedText>
          </ThemedText>
          <ThemedText>
            The layout file in{" "}
            <ThemedText type="defaultSemiBold">
              app/(tabs)/_layout.tsx
            </ThemedText>{" "}
            sets up the tab navigator.
          </ThemedText>
          <ExternalLink href="https://docs.expo.dev/router/introduction">
            <ThemedText type="link">Learn more</ThemedText>
          </ExternalLink>
        </Collapsible>

        <Collapsible title="Android, iOS, and web support">
          <ThemedText>
            You can open this project on Android, iOS, and the web. To open the
            web version, press <ThemedText type="defaultSemiBold">w</ThemedText>{" "}
            in the terminal running this project.
          </ThemedText>
        </Collapsible>

        <Collapsible title="Images">
          <ThemedText>
            For static images, you can use the{" "}
            <ThemedText type="defaultSemiBold">@2x</ThemedText> and{" "}
            <ThemedText type="defaultSemiBold">@3x</ThemedText> suffixes to
            provide files for different screen density.
          </ThemedText>
          <Image
            source={require("@/assets/images/react-logo.png")}
            className="w-24 h-24 mx-auto my-4"
          />
          <ExternalLink href="https://reactnative.dev/docs/images">
            <ThemedText type="link">Learn more</ThemedText>
          </ExternalLink>
        </Collapsible>

        <Collapsible title="Light and dark mode components">
          <ThemedText>
            This template has light and dark mode support. Your components now
            automatically adapt using NativeWind and CSS variables.
          </ThemedText>
          <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
            <ThemedText type="link">Learn more</ThemedText>
          </ExternalLink>
        </Collapsible>

        <Collapsible title="Animations">
          <ThemedText>
            This template includes an example of an animated component. The{" "}
            <ThemedText type="defaultSemiBold" className="font-mono">
              components/HelloWave.tsx
            </ThemedText>{" "}
            component uses the powerful{" "}
            <ThemedText type="defaultSemiBold" className="font-mono">
              react-native-reanimated
            </ThemedText>{" "}
            library to create a waving hand animation.
          </ThemedText>

          {Platform.select({
            ios: (
              <ThemedText>
                The{" "}
                <ThemedText type="defaultSemiBold" className="font-mono">
                  components/ParallaxScrollView.tsx
                </ThemedText>{" "}
                component provides a parallax effect for the header image.
              </ThemedText>
            ),
          })}
        </Collapsible>
      </ParallaxScrollView>
    </SafeAreaView>
  );
}
