import { FastifyInstance } from "fastify";
import { verifyJWT } from "../../middlewares/verify-jwt";
import { searchGym } from "./search";
import { fetchNearbyGyms } from "./nearby";
import { createGym } from "./create";

export async function gymsRoutes(app: FastifyInstance) {
  // middleware de authenticação para todas as rotas:
  app.addHook('onRequest', verifyJWT);

  app.post('/gyms', createGym);
  app.get('/gyms/search', searchGym);
  app.get('/gyms/nearby', fetchNearbyGyms);

}