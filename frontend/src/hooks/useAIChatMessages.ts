import { useMutation, useQuery } from "@apollo/client";
import {
    GetAiChatMessagesDocument,
    SendAiChatMessageDocument,
    SendAiChatMessageMutationVariables,
} from "../graphql/generated/graphql";

export const useAIChatMessages = () => {
  const { data, loading, error, refetch } = useQuery(
    GetAiChatMessagesDocument,
    {
      fetchPolicy: "cache-and-network",
    },
  );

  return {
    messages: data?.aiChatMessages || [],
    loading,
    error,
    refetch,
  };
};

export const useSendAIChatMessage = () => {
  const [mutate, { loading, error }] = useMutation(SendAiChatMessageDocument);

  const sendMessage = async (text: string, isFromUser: boolean = true) => {
    const variables: SendAiChatMessageMutationVariables = {
      text,
      isFromUser,
    };

    const result = await mutate({ variables });

    return {
      message: result.data?.sendAiChatMessage?.message,
      success: result.data?.sendAiChatMessage?.success,
      error: result.data?.sendAiChatMessage?.error,
    };
  };

  return { sendMessage, loading, error };
};
