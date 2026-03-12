import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

import { getStoredString } from "@/lib/storage";

const graphqlUri = process.env.EXPO_PUBLIC_GRAPHQL_URL ?? "http://127.0.0.1:8000/graphql/";

const httpLink = new HttpLink({
  uri: graphqlUri,
});

const authLink = setContext(async (_, { headers }) => {
  const token = await getStoredString("authToken");
  return {
    headers: {
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : null),
    },
  };
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
