import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import http from "http";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongodb-session";
import dotenv from "dotenv";

import mergedTypeDefs from "./typeDefs/index.js";
import mergedResolvers from "./resolvers/index.js";
import connectDB from "./db/connectDB.js";

dotenv.config();

await connectDB();

const app = express();
const httpServer = http.createServer(app);

app.use(express.json());

app.use((req, res, next) => {
  const query = req.body?.query;

  if (!query) return next();
  if (query.includes("__schema") || query.includes("IntrospectionQuery"))
    return next();
  if (req.path === "/favicon.ico") return next();

  console.log("\n🔥 GRAPHQL REQUEST:");
  console.log("Method:", req.method);
  console.log("Path:", req.path);
  console.log("Query:\n", query);

  next();
});

const MongoDBStore = MongoStore(session);

const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});

app.use(
  session({
    secret: process.env.SESSION_SECRET || "mysecret",
    resave: false,
    saveUninitialized: false,
    store,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    },
  })
);

const server = new ApolloServer({
  typeDefs: mergedTypeDefs,
  resolvers: mergedResolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

app.use(
  "/graphql",
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
  express.json(),
  expressMiddleware(server, {
    context: async ({ req, res }) => {
      const user = req.session?.user || null;

      return {
        req,
        res,
        currentUser: user,
      };
    },
  })
);

const PORT = process.env.PORT || 4000;

await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));

console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
