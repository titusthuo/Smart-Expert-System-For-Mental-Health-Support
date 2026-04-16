import { useAIChatMessages } from "./useAIChatMessages";

export function useChatSessions() {
  const { messages, loading, error, refetch } = useAIChatMessages();

  const userMessageCount = messages.filter(
    (msg: any) => msg.isFromUser,
  ).length;

  return {
    sessions: messages,
    userMessageCount,
    loading,
    error: error ? error.message : null,
    refetch,
  };
}
