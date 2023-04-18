import { CheckIn } from "@prisma/client";
import { CheckInsRepository } from "../repositories/check-ins-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface CheckInValidateUseCaseRequest {
  checkInId: string;
}

interface CheckInValidateUseCaseResponse {
  checkIn: CheckIn
}

export class CheckInValidateUseCase {
  constructor(
    private checkInRepository: CheckInsRepository,
  ) {}

  async execute({ checkInId }: CheckInValidateUseCaseRequest): Promise<CheckInValidateUseCaseResponse> {
    const checkIn = await this.checkInRepository.findById(checkInId);

    if(!checkIn)
      throw new ResourceNotFoundError();

    checkIn.validated_at = new Date();

    await this.checkInRepository.save(checkIn);

    return { checkIn };
  }
}