import { Ionicons } from "@expo/vector-icons";
import React, { createContext, useCallback, useContext, useRef, useState } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";

import { AppText } from "./text";
import { Button } from "./button";
import { useAuthTheme } from "@/hooks/use-auth-theme";

// ── Types ────────────────────────────────────────────────────────────────────

type AlertVariant = "default" | "success" | "error" | "warning";

type AlertAction = {
  text: string;
  onPress?: () => void;
  /** If true, renders as a subtle/secondary button */
  cancel?: boolean;
};

type AlertOptions = {
  title: string;
  message: string;
  variant?: AlertVariant;
  actions?: AlertAction[];
};

type AlertState = AlertOptions & { visible: boolean };

// ── Context ──────────────────────────────────────────────────────────────────

type AlertContextValue = {
  alert: (opts: AlertOptions) => void;
};

const AlertContext = createContext<AlertContextValue | null>(null);

/**
 * Call from any component to show a themed alert.
 * Drop-in replacement for `Alert.alert(title, message)`.
 */
export function useThemedAlert() {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error("useThemedAlert must be used within ThemedAlertProvider");
  return ctx.alert;
}

// ── Provider ─────────────────────────────────────────────────────────────────

export function ThemedAlertProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AlertState>({
    visible: false,
    title: "",
    message: "",
    variant: "default",
    actions: undefined,
  });

  const queueRef = useRef<AlertOptions[]>([]);

  const dismiss = useCallback(() => {
    setState((prev) => ({ ...prev, visible: false }));
    // Show next queued alert if any
    setTimeout(() => {
      if (queueRef.current.length > 0) {
        const next = queueRef.current.shift()!;
        setState({ ...next, visible: true });
      }
    }, 300);
  }, []);

  const alert = useCallback(
    (opts: AlertOptions) => {
      setState((prev) => {
        if (prev.visible) {
          queueRef.current.push(opts);
          return prev;
        }
        return { ...opts, visible: true };
      });
    },
    [],
  );

  return (
    <AlertContext.Provider value={{ alert }}>
      {children}
      <ThemedAlertModal {...state} onDismiss={dismiss} />
    </AlertContext.Provider>
  );
}

// ── Modal ────────────────────────────────────────────────────────────────────

function ThemedAlertModal({
  visible,
  title,
  message,
  variant = "default",
  actions,
  onDismiss,
}: AlertState & { onDismiss: () => void }) {
  const theme = useAuthTheme();

  const iconMap: Record<AlertVariant, { name: keyof typeof Ionicons.glyphMap; color: string; bg: string }> = {
    success: { name: "checkmark-circle", color: theme.success, bg: theme.successSoft },
    error: { name: "close-circle", color: theme.error, bg: theme.errorSoft },
    warning: { name: "warning", color: "#F59E0B", bg: "rgba(245,158,11,0.12)" },
    default: { name: "information-circle", color: theme.brand, bg: theme.brandSoft },
  };

  const icon = iconMap[variant];

  const resolvedActions: AlertAction[] =
    actions && actions.length > 0 ? actions : [{ text: "OK" }];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onDismiss}>
      <Pressable style={styles.backdrop} onPress={onDismiss}>
        <Pressable
          style={[
            styles.card,
            {
              backgroundColor: theme.isDark ? "hsl(0, 0%, 12%)" : "hsl(0, 0%, 100%)",
              borderColor: theme.isDark ? "hsl(0, 0%, 18%)" : "hsl(0, 0%, 90%)",
            },
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Icon badge */}
          <View style={[styles.iconBadge, { backgroundColor: icon.bg }]}>
            <Ionicons name={icon.name} size={28} color={icon.color} />
          </View>

          {/* Title */}
          <AppText
            variant="label"
            style={[styles.title, { color: theme.text }]}
          >
            {title}
          </AppText>

          {/* Message */}
          <AppText
            variant="body"
            style={[styles.message, { color: theme.subtle }]}
          >
            {message}
          </AppText>

          {/* Actions */}
          <View style={styles.actions}>
            {resolvedActions.map((action, i) => (
              <View key={i} style={resolvedActions.length > 1 ? styles.actionFlex : styles.actionFull}>
                {action.cancel ? (
                  <Pressable
                    style={[
                      styles.cancelBtn,
                      {
                        borderColor: theme.isDark ? "hsl(0, 0%, 22%)" : "hsl(0, 0%, 88%)",
                        backgroundColor: theme.isDark ? "hsl(0, 0%, 15%)" : "hsl(0, 0%, 96%)",
                      },
                    ]}
                    onPress={() => {
                      action.onPress?.();
                      onDismiss();
                    }}
                  >
                    <AppText style={[styles.cancelText, { color: theme.text }]}>
                      {action.text}
                    </AppText>
                  </Pressable>
                ) : (
                  <Button
                    text={action.text}
                    onPress={() => {
                      action.onPress?.();
                      onDismiss();
                    }}
                    className="h-12"
                  />
                )}
              </View>
            ))}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 28,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 20,
    alignItems: "center",
  },
  iconBadge: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 6,
  },
  message: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    marginBottom: 20,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
  },
  actionFlex: {
    flex: 1,
  },
  actionFull: {
    flex: 1,
  },
  cancelBtn: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelText: {
    fontSize: 15,
    fontWeight: "600",
  },
});
