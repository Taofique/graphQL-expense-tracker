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

// Connect to real MongoDB
await connectDB();

const app = express();
const httpServer = http.createServer(app);

// Session store setup with connect-mongodb-session
const MongoDBStore = MongoStore(session);
const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "sessions",
  // Convert ObjectId to string to avoid BSON issues
  serialize: (session) => {
    return JSON.stringify(session, (key, value) => {
      if (value && value._bsontype === "ObjectID") {
        return value.toString();
      }
      if (
        value &&
        value.toString &&
        value.toString().match(/^[0-9a-fA-F]{24}$/)
      ) {
        return value.toString();
      }
      return value;
    });
  },
  unserialize: (session) => {
    return JSON.parse(session);
  },
});

store.on("error", (error) => {
  console.log("Session store error:", error);
});

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "mysecret",
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    },
  })
);

// Apollo Server
const server = new ApolloServer({
  typeDefs: mergedTypeDefs,
  resolvers: mergedResolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

// Express middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
  express.json(),
  expressMiddleware(server, {
    context: async ({ req, res }) => ({
      req,
      res,
      currentUser: req.session?.user || null,
    }),
  })
);

const PORT = process.env.PORT || 4000;
await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
console.log(`💡 Connected to MongoDB Atlas with session store`);
