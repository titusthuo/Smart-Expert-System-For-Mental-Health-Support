import { useAuthSession } from "@/stores/useAuthSession";
import { GraphQLResponse } from "@/types/api";
import { useEffect, useState } from "react";

interface ChatSession {
  id: string;
  text: string;
  is_from_user: boolean;
  created_at: string;
}

interface ChatSessionsData {
  ai_chat_messages: ChatSession[];
}

export function useChatSessions() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { session, isAuthenticated } = useAuthSession();

  useEffect(() => {
    if (!isAuthenticated || !session) {
      setLoading(false);
      return;
    }

    const fetchChatSessions = async () => {
      try {
        const response = await fetch("http://192.168.100.44:8001/graphql/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.jwt}`,
          },
          body: JSON.stringify({
            query: `
              query {
                aiChatMessages {
                  id
                  text
                  is_from_user
                  created_at
                }
              }
            `,
          }),
        });

        const result: GraphQLResponse<ChatSessionsData> = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        if (result.data?.ai_chat_messages) {
          setSessions(result.data.ai_chat_messages);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch chat sessions",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchChatSessions();
  }, [isAuthenticated, session]);

  // Count user messages (sessions where user initiated)
  const userMessageCount = sessions.filter((msg) => msg.is_from_user).length;

  return {
    sessions,
    userMessageCount,
    loading,
    error,
    refetch: () => {
      setLoading(true);
      setError(null);
      // Refetch logic can be added here
    },
  };
}
