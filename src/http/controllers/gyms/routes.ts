import { FastifyInstance } from "fastify";
import { verifyJWT } from "../../middlewares/verify-jwt";
import { searchGym } from "./search";
import { fetchNearbyGyms } from "./nearby";
import { createGym } from "./create";
import { verifyUserRole } from "../../middlewares/verify-user-role";

export async function gymsRoutes(app: FastifyInstance) {
  // middleware de authenticação para todas as rotas:
  app.addHook('onRequest', verifyJWT);

  app.get('/gyms/search', searchGym);
  app.get('/gyms/nearby', fetchNearbyGyms);
  
  app.post('/gyms', { onRequest: [verifyUserRole('ADMIN')] }, createGym);
}