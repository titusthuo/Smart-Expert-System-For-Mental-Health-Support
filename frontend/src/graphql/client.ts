import { ApolloClient, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
// @ts-expect-error — @types/apollo-upload-client exists but conflicts with package exports
import { createUploadLink } from "apollo-upload-client";

import { useAuthSession } from "@/stores/useAuthSession";

const graphqlUri =
  process.env.EXPO_PUBLIC_GRAPHQL_URL ?? "http://127.0.0.1:8001/graphql/";

const uploadLink = createUploadLink({
  uri: graphqlUri,
});

const authLink = setContext((_, { headers }) => {
  const token = useAuthSession.getState().session?.jwt;
  return {
    headers: {
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : null),
    },
  };
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      if (
        err.message === "Signature has expired" ||
        err.message === "Error decoding signature"
      ) {
        useAuthSession.getState().clearSession();
      }
    }
  }

  if (networkError && __DEV__) {
    console.warn("[Apollo Network Error]", networkError.message);
  }
});

export const apolloClient = new ApolloClient({
  link: errorLink.concat(authLink).concat(uploadLink),
  cache: new InMemoryCache(),
});
