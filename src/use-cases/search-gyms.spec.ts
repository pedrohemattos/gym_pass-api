import { describe, expect, it, beforeEach } from "vitest";
import { InMemoryGymsRepository } from "../repositories/in-memory/in-memory-gyms-repository";
import { SearchGymsUseCase } from "./search-gyms";

let gymsRepository: InMemoryGymsRepository
let searchGymsUseCase: SearchGymsUseCase

describe('Search Gyms Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    searchGymsUseCase = new SearchGymsUseCase(gymsRepository);
  })

  it('should be able to search gyms', async () => {
    await gymsRepository.create({
      title: 'gym-01',
      description: '',
      phone: '',
      latitude: 0,
      longitude: 0
    });

    const { gyms } = await searchGymsUseCase.execute({
      query: 'gym-01',
      page: 1
    });

    expect(gyms).toEqual([
      expect.objectContaining({ title: 'gym-01' })
    ]);
  })

  it('should be able to fetch paginated gyms', async () => {
    for(let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `gym-${i}`,
        description: '',
        phone: '',
        latitude: 0,
        longitude: 0
      });
    }

    const { gyms } = await searchGymsUseCase.execute({
      query: 'gym',
      page: 2
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'gym-21' }),
      expect.objectContaining({ title: 'gym-22' })
    ]);
  })
})