import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import {
    getStoredString,
    removeStoredItem,
    setStoredString,
} from "@/lib/storage";

export type Session = {
  user: {
    id: string;
    username: string;
    email?: string | null;
    name?: string | null;
    phone?: string | null;
    country?: string | null;
  };
  jwt: string;
  profile: {
    name: string;
    email: string;
    phone: string;
    photoUri?: string | null;
  };
} | null;

export type AuthSessionState = {
  session: Session;
  loadingSession: boolean;
  isAuthenticated: boolean;
  isHydrated: boolean;
  lastAuthedPath: string | null;
  securityQuestionSetup: boolean;
  hasSeenOnboarding: boolean;
};

export type AuthSessionActions = {
  setSession: (
    updates: Partial<NonNullable<Session>> | Session,
  ) => Promise<void>;
  clearSession: () => Promise<void>;
  setLoadingSession: (loading: boolean) => void;
  setIsHydrated: (hydrated: boolean) => void;
  setIsAuthenticated: (authenticated: boolean) => void;
  setLastAuthedPath: (path: string | null) => void;
  setSecurityQuestionSetup: (setup: boolean) => void;
  setHasSeenOnboarding: (hasSeen: boolean) => void;
};

export const useAuthSession = create<AuthSessionState & AuthSessionActions>()(
  persist(
    (set, get) => ({
      session: null,
      loadingSession: true,
      isAuthenticated: false,
      isHydrated: false,
      lastAuthedPath: null,
      securityQuestionSetup: false,
      hasSeenOnboarding: false,

      setSession: async (updates) => {
        set((state) => {
          const current = state.session ?? ({} as NonNullable<Session>);
          const nextSession = (
            updates === null
              ? null
              : ({
                  ...current,
                  ...(updates as NonNullable<Session>),
                } as NonNullable<Session>)
          ) satisfies Session;

          const jwt =
            nextSession && typeof nextSession.jwt === "string"
              ? nextSession.jwt
              : "";
          const hasValidJwt = Boolean(jwt && jwt.trim());

          return {
            session: hasValidJwt ? (nextSession as NonNullable<Session>) : null,
            isAuthenticated: hasValidJwt,
            loadingSession: false,
          };
        });

        const jwt = get().session?.jwt ?? "";
        if (jwt && jwt.trim()) {
          await setStoredString("authToken", jwt);
        } else {
          await removeStoredItem("authToken");
        }
      },

      clearSession: async () => {
        set({
          session: null,
          isAuthenticated: false,
          loadingSession: false,
          lastAuthedPath: null,
          securityQuestionSetup: false,
        });
        await removeStoredItem("authToken");
      },

      setLoadingSession: (loadingSession) => set({ loadingSession }),
      setIsHydrated: (isHydrated) => set({ isHydrated }),
      setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setLastAuthedPath: (lastAuthedPath) => set({ lastAuthedPath }),
      setSecurityQuestionSetup: (securityQuestionSetup) =>
        set({ securityQuestionSetup }),
      setHasSeenOnboarding: (hasSeenOnboarding) =>
        set({ hasSeenOnboarding }),
    }),
    {
      name: "authSession",
      storage: createJSONStorage(() => ({
        getItem: async (key: string) => {
          const value = await getStoredString(key);
          return value;
        },
        setItem: async (key: string, value: string) => {
          await setStoredString(key, value);
        },
        removeItem: async (key: string) => {
          await removeStoredItem(key);
        },
      })),
      partialize: (state) => ({
        session: state.session,
        lastAuthedPath: state.lastAuthedPath,
        securityQuestionSetup: state.securityQuestionSetup,
        hasSeenOnboarding: state.hasSeenOnboarding,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;

        const hasJwt = Boolean(state.session?.jwt && state.session.jwt.trim());

        // Important: DO NOT mutate `state.*` here; call actions so Zustand updates properly.
        if (state.lastAuthedPath?.startsWith("/therapist-detail")) {
          state.setLastAuthedPath(null);
        }
        state.setIsHydrated(true);
        state.setIsAuthenticated(hasJwt);
        // Don't block navigation — let the auth navigator redirect immediately.
        // SessionInitializer will verify the token in the background and clear
        // the session only if the token is truly invalid.
        state.setLoadingSession(false);

        // Keep authToken key in sync for any legacy reads.
        if (hasJwt) {
          setStoredString("authToken", state.session!.jwt).catch(
            () => undefined,
          );
        } else {
          removeStoredItem("authToken").catch(() => undefined);
        }
      },
    },
  ),
);

