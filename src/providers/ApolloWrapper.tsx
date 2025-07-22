"use client";

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { useAuth } from "@clerk/nextjs";

const httpLink = createHttpLink({
  uri: process.env.BACKEND_URL || "http://localhost:4000/graphql",
});

export const ApolloWrapper = ({ children }: { children: ReactNode }) => {
  const { getToken } = useAuth();
  const [client, setClient] = useState<ApolloClient<any> | null>(null);

  useEffect(() => {
    const initApolloClient = async () => {
      const token = await getToken();

      const authLink = setContext((_, { headers }) => {
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

      setClient(newClient);
    };

    initApolloClient();
  }, [getToken]);

  if (!client) return null; // Or loading spinner

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
