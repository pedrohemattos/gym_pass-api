import { FastifyInstance } from "fastify";

import { verifyJWT } from "../../middlewares/verify-jwt";

import { registerUser } from "./register";
import { authenticate } from "./authenticate";
import { profile } from "./profile";
import { refresh } from "./refresht";

export async function userRoutes(app: FastifyInstance) {
  app.post("/users", registerUser);
  app.post("/sessions", authenticate);

  app.patch('/token/refresh', refresh)

  /* Authenticated */
  app.get('/me', { onRequest: [verifyJWT] }, profile);
}
