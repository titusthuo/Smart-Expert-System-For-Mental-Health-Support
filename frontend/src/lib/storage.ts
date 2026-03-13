import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

type StorageBackend = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
};

const webBackend: StorageBackend = {
  async getItem(key) {
    try {
      return typeof window !== "undefined"
        ? window.localStorage.getItem(key)
        : null;
    } catch {
      return null;
    }
  },
  async setItem(key, value) {
    try {
      if (typeof window !== "undefined")
        window.localStorage.setItem(key, value);
    } catch {
      // ignore
    }
  },
  async removeItem(key) {
    try {
      if (typeof window !== "undefined") window.localStorage.removeItem(key);
    } catch {
      // ignore
    }
  },
};

const nativeBackend: StorageBackend = {
  async getItem(key) {
    try {
      const secureValue = await SecureStore.getItemAsync(key);
      if (secureValue !== null) return secureValue;

      // Fallback for Expo Go / edge cases where SecureStore returns null unexpectedly.
      return await AsyncStorage.getItem(key);
    } catch {
      return null;
    }
  },
  async setItem(key, value) {
    try {
      await SecureStore.setItemAsync(key, value);
      await AsyncStorage.setItem(key, value);
    } catch {
      // ignore
    }
  },
  async removeItem(key) {
    try {
      await SecureStore.deleteItemAsync(key);
      await AsyncStorage.removeItem(key);
    } catch {
      // ignore
    }
  },
};

function backend(): StorageBackend {
  return Platform.OS === "web" ? webBackend : nativeBackend;
}

export async function getStoredString(key: string): Promise<string | null> {
  return backend().getItem(key);
}

export async function setStoredString(
  key: string,
  value: string,
): Promise<void> {
  await backend().setItem(key, value);
}

export async function removeStoredItem(key: string): Promise<void> {
  await backend().removeItem(key);
}

export async function getStoredJson<T>(key: string): Promise<T | null> {
  const stored = await getStoredString(key);
  if (!stored) return null;

  try {
    return JSON.parse(stored) as T;
  } catch {
    return null;
  }
}

export async function setStoredJson(
  key: string,
  value: unknown,
): Promise<void> {
  try {
    await setStoredString(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}
