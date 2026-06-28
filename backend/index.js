import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import http from "http";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongodb-session";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import mergedTypeDefs from "./typeDefs/index.js";
import mergedResolvers from "./resolvers/index.js";
import connectDB from "./db/connectDB.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

await connectDB();

const app = express();
const httpServer = http.createServer(app);

const isProd = process.env.NODE_ENV === "production";

app.use(
  cors({
    origin: isProd
      ? "https://graphql-expense-tracker-qthm.onrender.com"
      : "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

app.use(express.json());

const MongoDBStore = MongoStore(session);
const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});

store.on("error", (error) => {
  console.log("Session store error:", error);
});

app.use(
  session({
    secret: process.env.SESSION_SECRET || "mysecret",
    resave: false,
    saveUninitialized: false,
    store: store,
    name: "connect.sid",
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/",
    },
    rolling: true,
  })
);

app.use((req, res, next) => {
  const query = req.body?.query;
  if (!query) return next();
  if (query.includes("__schema") || query.includes("IntrospectionQuery"))
    return next();
  if (req.path === "/favicon.ico") return next();

  console.log("\n🔥 GRAPHQL REQUEST:");
  console.log("Method:", req.method);
  console.log("Path:", req.path);
  console.log("Cookies received:", req.headers.cookie);
  console.log("Session ID:", req.session?.id);
  next();
});

const server = new ApolloServer({
  typeDefs: mergedTypeDefs,
  resolvers: mergedResolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

app.use(
  "/graphql",
  expressMiddleware(server, {
    context: async ({ req, res }) => ({
      req,
      res,
      currentUser: req.session?.user || null,
    }),
  })
);

if (isProd) {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("{*path}", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
  });
}

const PORT = process.env.PORT || 4000;
await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));

console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
console.log(`💡 Running in ${isProd ? "production" : "development"} mode`);
