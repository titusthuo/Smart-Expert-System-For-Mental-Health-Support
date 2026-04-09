import { ApolloClient, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
// @ts-ignore - apollo-upload-client types issue
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

export const apolloClient = new ApolloClient({
  link: authLink.concat(uploadLink),
  cache: new InMemoryCache(),
});
