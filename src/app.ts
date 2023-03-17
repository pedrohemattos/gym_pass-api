import fastify from "fastify";
import { z } from "zod";
import { prisma } from "./lib/prisma";

export const app = fastify();

app.post("/users", async (request, reply) => {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password_hash: z.string().min(6),
  });

  const { name, email, password_hash } = registerBodySchema.parse(request.body);
  // caso não passe na validação do parse, ele retorna um throw new Error e não executa o que estiver abaixo;

  await prisma.user.create({
    data: {
      name,
      email,
      password_hash,
    },
  });

  return reply.status(201).send();
});
