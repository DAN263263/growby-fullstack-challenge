// Integra Restify (servidor HTTP) y Apollo (GraphQL) con CORS y contexto JWT
import restify from "restify";
import cors from "cors";
import express, { Application } from "express";
import { ApolloServer } from "apollo-server-express";
import { typeDefs } from "./schema/typeDefs";
import { resolvers } from "./resolvers";
import jwt from "jsonwebtoken";
import * as http from "http";

const PORT = Number(process.env.PORT) || 4000;
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// Restify gestiona conexiones; Express aloja Apollo
const server = restify.createServer();
server.use(restify.plugins.bodyParser());
server.pre((req, res, next) => { res.setHeader("Access-Control-Allow-Origin", "*"); next(); });

const app: Application = express();
app.use(cors({ origin: true, credentials: true }));

// Extrae usuario desde Authorization: Bearer <token>
function contextExtractor(req: any) {
  const auth = req.headers.authorization || "";
  let user = null;
  if (auth.startsWith("Bearer ")) {
    try { user = jwt.verify(auth.replace("Bearer ", ""), JWT_SECRET); } catch {}
  }
  return { user, jwtSecret: JWT_SECRET };
}

async function start() {
  const apollo = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => contextExtractor(req),
  });
  await apollo.start();
  apollo.applyMiddleware({ app: app as unknown as any, path: "/graphql", cors: false });

  const expressServer = http.createServer(app);
  expressServer.listen(PORT, () => {
    console.log(`GraphQL ready at http://localhost:${PORT}/graphql`);
  });
}
start();
