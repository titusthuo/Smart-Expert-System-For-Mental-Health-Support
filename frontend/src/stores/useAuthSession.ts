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
};

export const useAuthSession = create<AuthSessionState & AuthSessionActions>()(
  persist(
    (set, get) => ({
      session: null,
      loadingSession: true,
      isAuthenticated: false,
      isHydrated: false,
      lastAuthedPath: null,

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
        });
        await removeStoredItem("authToken");
      },

      setLoadingSession: (loadingSession) => set({ loadingSession }),
      setIsHydrated: (isHydrated) => set({ isHydrated }),
      setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setLastAuthedPath: (lastAuthedPath) => set({ lastAuthedPath }),
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
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;

        const hasJwt = Boolean(state.session?.jwt && state.session.jwt.trim());

        // Important: DO NOT mutate `state.*` here; call actions so Zustand updates properly.
        state.setIsHydrated(true);
        state.setIsAuthenticated(hasJwt);
        state.setLoadingSession(hasJwt);

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

export const waitForSession = async (): Promise<Session> => {
  const store = useAuthSession.getState();
  if (store.isHydrated && !store.loadingSession) {
    return store.session;
  }

  return await new Promise((resolve) => {
    const unsubscribe = useAuthSession.subscribe((state) => {
      if (state.isHydrated && !state.loadingSession) {
        unsubscribe();
        resolve(state.session);
      }
    });
  });
};

export const selectSession = (state: AuthSessionState & AuthSessionActions) =>
  state.session;
export const selectIsAuthenticated = (
  state: AuthSessionState & AuthSessionActions,
) => state.isAuthenticated;
