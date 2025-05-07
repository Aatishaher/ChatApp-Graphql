const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { createServer } = require('http');
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer');
const { useServer } = require('graphql-ws/lib/use/ws');
const { WebSocketServer } = require('ws');
const cors = require('cors');
const typeDefs = require('./typeDefs.js');
const resolvers = require('./resolver.js');
const connectDB = require('./Database/dbConnect.js');

const app = express();
const httpServer = createServer(app);

// Connect to MongoDB
connectDB();

// Create schema
const schema = makeExecutableSchema({ typeDefs, resolvers });

// WebSocket Server
const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql',
  perMessageDeflate: false,
});

// GraphQL WS server
const serverCleanup = useServer(
  {
    schema, 
  },
  wsServer
);

// Apollo Server
const apolloServer = new ApolloServer({
  schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

// Start Apollo
async function startServer() {
  await apolloServer.start();

  app.use(
    '/graphql',
    cors({
      origin: 'http://localhost:5173',
      credentials: true,
    }),
    express.json(),
    expressMiddleware(apolloServer)
  );

  httpServer.listen(4000, () => {
    console.log('🚀 Server ready at http://localhost:4000/graphql');
  });
}

startServer();
