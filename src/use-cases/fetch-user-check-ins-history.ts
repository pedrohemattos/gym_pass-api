import { CheckIn } from "@prisma/client";
import { CheckInsRepository } from "../repositories/check-ins-repository";

interface FetchUserCheckInsHistoryRequest {
  userId: string;
  page: number;
}

interface FetchUserCheckInsHistoryReponse {
  checkIns: CheckIn[];
}

export class FetchUserCheckInsHistoryUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({ userId, page }: FetchUserCheckInsHistoryRequest): Promise<FetchUserCheckInsHistoryReponse> {
    const checkIns = await this.checkInsRepository.findManyByUserId(userId, page);

    return {checkIns};
  }
}

