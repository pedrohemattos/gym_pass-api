import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { PrismaUsersRepository } from "../../repositories/prisma-users-repository";
import { RegisterUseCase } from "../../use-cases/register";

export async function registerUser(request: FastifyRequest,reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { name, email, password } = registerBodySchema.parse(request.body);
  // caso não passe na validação do parse, ele retorna um throw new Error e não executa o que estiver abaixo;

  try {
    const usersRepository = new PrismaUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    await registerUseCase.execute({
      name,
      email,
      password
    })
  } catch (error) {
    return reply.status(409).send(error)
  }

  return reply.status(201).send();
}
