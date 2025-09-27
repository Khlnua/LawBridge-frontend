"use client";

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { ReactNode } from "react";
import { useAuth } from "@clerk/nextjs";

const httpLink = createHttpLink({
  uri:
    process.env.BACKEND_URL || "https://lawbridge-server.onrender.com/graphql",
});

export const ApolloWrapper = ({ children }: { children: ReactNode }) => {
  const { getToken } = useAuth();

  const authLink = setContext(async (_, { headers }) => {
    const token = await getToken();
    return {
      headers: {
        ...headers,
        Authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  const newClient = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });

  return <ApolloProvider client={newClient}>{children}</ApolloProvider>;
};
