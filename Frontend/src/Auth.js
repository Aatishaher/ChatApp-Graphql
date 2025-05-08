import { createClient } from 'graphql-ws';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'; // NEW
import { ApolloClient, InMemoryCache, createHttpLink, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getMainDefinition } from '@apollo/client/utilities';

// HTTP Link
const httpLink = createHttpLink({
  uri: 'https://chatapp-graphql.onrender.com/graphql',
});

// Auth middleware
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// WebSocket link using graphql-ws
const wsLink = new GraphQLWsLink(createClient({
  url: 'wss://chatapp-graphql.onrender.com/graphql',
  connectionParams: {
    authorization: `Bearer ${localStorage.getItem('token')}`,
  },
}));

// Split link for queries/mutations vs subscriptions
const splitLink = split(
  ({ query }) => {
    const def = getMainDefinition(query);
    return def.kind === 'OperationDefinition' && def.operation === 'subscription';
  },
  wsLink,
  authLink.concat(httpLink)
);

// Apollo Client
const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

export default client;
