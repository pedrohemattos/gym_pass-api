import { hash } from "bcryptjs";
import { prisma } from "../lib/prisma";

interface registerProps {
  name: string;
  email: string;
  password: string;
}

export async function registerUseCase({ name, email, password }: registerProps) {
  const password_hash = await hash(password, 6);

  const userWithSameEmail = await prisma.user.findUnique({
    where: {
      email
    }
  });

  // if(userWithSameEmail) {
  //   return reply.status(409).send();
  // }

  if(userWithSameEmail) {
    throw new Error("E-mail already exists.")
  }

  await prisma.user.create({
    data: {
      name,
      email,
      password_hash
    },
  });
}