"use client";

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
  from,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { ReactNode, useMemo } from "react";
import { useAuth } from "@clerk/nextjs";

const httpLink = createHttpLink({
  uri: "https://lawbridge-server.onrender.com/graphql",
});

export const ApolloWrapper = ({ children }: { children: ReactNode }) => {
  const { userId } = useAuth();

  const authLink = useMemo(
    () =>
      setContext((_, { headers }) => {
        return {
          headers: {
            ...headers,
            Authorization: userId ? `Bearer ${userId}` : "",
            "Content-Type": "application/json",
          },
        };
      }),
    [userId]
  );

  const errorLink = useMemo(
    () =>
      onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors)
          graphQLErrors.forEach(({ message, locations, path }) =>
            console.log(
              `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            )
          );
        if (networkError) console.log(`[Network error]: ${networkError}`);
      }),
    []
  );

  const client = useMemo(
    () =>
      new ApolloClient({
        link: from([errorLink, authLink, httpLink]),
        cache: new InMemoryCache(),
      }),
    [errorLink, authLink]
  );

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
