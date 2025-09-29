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
import { ReactNode, useMemo, useRef } from "react";
import { useAuth } from "@clerk/nextjs";

const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql",
});

// Create error link outside component to prevent recreation
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

export const ApolloWrapper = ({ children }: { children: ReactNode }) => {
  const { userId, getToken } = useAuth();

  // Create auth link that updates when userId changes
  const authLink = useMemo(
    () =>
      setContext(async (_, { headers }) => {
        // Get the current token from Clerk
        const token = await getToken();
        return {
          headers: {
            ...headers,
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
        };
      }),
    [userId, getToken]
  );

  // Create client with proper dependencies to ensure it updates when auth changes
  const client = useMemo(() => {
    return new ApolloClient({
      link: from([errorLink, authLink, httpLink]),
      cache: new InMemoryCache({
        typePolicies: {
          Query: {
            fields: {
              // Add field policies to prevent unnecessary refetches
              getLawyers: {
                merge(existing = [], incoming) {
                  return incoming;
                },
              },
              getChatRoomByUser: {
                merge(existing = [], incoming) {
                  return incoming;
                },
              },
            },
          },
        },
      }),
      defaultOptions: {
        watchQuery: {
          fetchPolicy: "cache-first",
          errorPolicy: "all",
        },
        query: {
          fetchPolicy: "cache-first",
          errorPolicy: "all",
        },
      },
    });
  }, [authLink]); // Include authLink as dependency to recreate when auth changes

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
