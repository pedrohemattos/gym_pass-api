import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { EmailAlreadyExistsError } from "../../use-cases/errors/email-already-exists-error";
import { makeRegisterUseCase } from "../../use-cases/factories/make-register-use-case";

export async function registerUser(request: FastifyRequest,reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { name, email, password } = registerBodySchema.parse(request.body);
  // caso não passe na validação do parse, ele retorna um throw new Error e não executa o que estiver abaixo;

  try {
    const registerUseCase = makeRegisterUseCase();

    await registerUseCase.execute({
      name,
      email,
      password
    })
  } catch (error) {
    if(error instanceof EmailAlreadyExistsError) {
      return reply.status(409).send({message: error.message});
    }
    
    throw error
  }

  return reply.status(201).send();
}
