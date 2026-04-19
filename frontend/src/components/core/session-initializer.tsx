import { gql } from "@apollo/client";
import { useEffect } from "react";

import { apolloClient } from "@/graphql/client";
import { useAuthSession } from "@/stores/useAuthSession";

const VERIFY_TOKEN = gql`
  mutation VerifyToken($token: String!) {
    verifyToken(token: $token) {
      payload
    }
  }
`;

export function SessionInitializer() {
  const session = useAuthSession((s) => s.session);
  const isHydrated = useAuthSession((s) => s.isHydrated);

  const clearSession = useAuthSession((s) => s.clearSession);

  // Background token verification — runs once after hydration.
  // Navigation is NOT blocked; the user sees the app immediately.
  // Only clears the session if the token is genuinely invalid.
  useEffect(() => {
    if (!isHydrated) return;

    const token = session?.jwt;
    if (__DEV__) {
      console.log("[SessionInitializer] start", {
        hasToken: Boolean(token && token.trim()),
      });
    }
    if (!token || !token.trim()) return;

    let cancelled = false;

    (async () => {
      try {
        const verifyPromise = apolloClient.mutate({
          mutation: VERIFY_TOKEN,
          variables: { token },
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        });

        // Avoid hanging due to slow/offline backend.
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error("verifyToken timeout")), 4000);
        });

        await Promise.race([verifyPromise, timeoutPromise]);

        if (cancelled) return;
        if (__DEV__) {
          console.log("[SessionInitializer] verifyToken success");
        }
      } catch (err) {
        if (cancelled) return;

        if (__DEV__) {
          console.log("[SessionInitializer] verifyToken error", err);
        }

        const maybeApolloErr = err as {
          networkError?: unknown;
          graphQLErrors?: { message?: string }[];
          message?: string;
        } | null;

        const isNetworkError = Boolean(
          maybeApolloErr && maybeApolloErr.networkError,
        );
        const graphQLErrorMessages = (maybeApolloErr?.graphQLErrors ?? [])
          .map((e) => (typeof e?.message === "string" ? e.message : ""))
          .filter(Boolean);
        const combinedMessage = [
          maybeApolloErr?.message,
          ...graphQLErrorMessages,
        ]
          .filter((m): m is string => typeof m === "string" && Boolean(m))
          .join(" | ")
          .toLowerCase();

        const isInvalidTokenError =
          combinedMessage.includes("invalid token") ||
          combinedMessage.includes("signature has expired") ||
          combinedMessage.includes("token has expired") ||
          combinedMessage.includes("expired signature") ||
          combinedMessage.includes("not enough segments") ||
          combinedMessage.includes("error decoding") ||
          (combinedMessage.includes("jwt") &&
            combinedMessage.includes("expired"));

        // Keep session on network / transient / unknown errors
        if (isNetworkError || !isInvalidTokenError) {
          if (__DEV__) {
            console.log("[SessionInitializer] keep session (transient/unknown error)");
          }
          return;
        }

        // Token is genuinely invalid → clear session (user will be redirected to sign-in)
        try {
          if (__DEV__) {
            console.log(
              "[SessionInitializer] clearing session (invalid token)",
            );
          }
          await clearSession();
          await apolloClient.resetStore();
        } catch {
          // ignored
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    clearSession,
    isHydrated,
    session?.jwt,
  ]);

  return null;
}
