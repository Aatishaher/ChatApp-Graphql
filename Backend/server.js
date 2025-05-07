import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import typeDefs from './typeDefs.js';
import resolvers from './resolver.js';
import connectDB from './Database/dbConnect.js';
import jwt from 'jsonwebtoken';

connectDB();

// Create the Apollo Server (only typeDefs & resolvers here)
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Start the standalone server and pass context here (✅ Correct placement)
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req }) => {
    const token = req.headers.authorization || '';

    if (!token) {

        console.error("Authorization token is missing");
    }

    try {
      const decodedToken = jwt.verify(token.replace('Bearer ', ''), '1234');
      return { userId: decodedToken.id };
    } catch (error) {
      
    }
  },
});

console.log(`🚀 Server ready at ${url}`);
