import * as Location from "expo-location";
import { useState } from "react";
import { Alert } from "react-native";

export const useCurrentLocation = () => {
  const [isLoading, setIsLoading] = useState(false);

  const getLocation = async () => {
    setIsLoading(true);

    try {
      // Request permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location permission is required to find nearby therapists.",
        );
        return null;
      }

      // Get current position with better accuracy
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const { latitude, longitude } = location.coords;

      // Reverse geocode to get approximate location name
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (reverseGeocode.length > 0) {
        const address = reverseGeocode[0];
        const locationText = [
          address.city || address.subregion || address.region || "Unknown Area",
          address.country || "Unknown Country",
        ]
          .filter(Boolean)
          .join(", ");

        if (locationText !== "Unknown Area, Unknown Country") {
          return locationText;
        } else {
          console.error("Could not determine city/county");
          Alert.alert("Location", "Could not determine your city/county.");
          return null;
        }
      } else {
        console.error("No reverse geocode results found");
        Alert.alert("Location", "Could not determine your location.");
        return null;
      }
    } catch (error) {
      console.error("Location error:", error);
      Alert.alert("Error", "Failed to get your location. Try again.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { getLocation, isLoading };
};
