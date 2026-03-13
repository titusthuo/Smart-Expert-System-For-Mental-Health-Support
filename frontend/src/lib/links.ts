import { Linking } from "react-native";

export type OpenUrlOptions = {
  fallbackUrl?: string;
};

export async function openUrlSafely(
  url: string,
  options: OpenUrlOptions = {},
): Promise<boolean> {
  try {
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
      return true;
    }

    if (options.fallbackUrl) {
      const canOpenFallback = await Linking.canOpenURL(options.fallbackUrl);
      if (canOpenFallback) {
        await Linking.openURL(options.fallbackUrl);
        return true;
      }
    }

    return false;
  } catch {
    return false;
  }
}
