import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import mergedTypeDefs from "./typeDefs/index.js";
import mergedResolvers from "./resolvers/index.js";

const context = {
  currentUser: null,
};

const server = new ApolloServer({
  typeDefs: mergedTypeDefs,
  resolvers: mergedResolvers,


});

// Start the server with context function
const { url } = await startStandaloneServer(server, {
  context: async () => {
    // Return the context for each request
    // In production, you'd extract user from session/cookie here
    return context;
  },
});

console.log(`🚀 Server ready at ${url}`);
