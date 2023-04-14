import { User } from "@prisma/client";
import { hash } from "bcryptjs";
import { UsersRepository } from "../repositories/users-repository";
import { EmailAlreadyExistsError } from "./errors/email-already-exists-error";

interface RegisterProps {
  name: string;
  email: string;
  password: string;
}

interface RegisterReponse {
  user: User
}

export class RegisterUseCase {

  constructor(private usersRepository: UsersRepository) {}

  async execute({ name, email, password }: RegisterProps): Promise<RegisterReponse> {
    const password_hash = await hash(password, 6);
    
    const userWithSameEmail = await this.usersRepository.findByEmail(email)
    
    if(userWithSameEmail) {
      throw new EmailAlreadyExistsError()
    }

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash
    })
    
    return { user };
  }
}

