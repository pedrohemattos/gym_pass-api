import { describe, expect, it, beforeEach } from "vitest";
import { InMemoryGymsRepository } from "../repositories/in-memory/in-memory-gyms-repository";
import { FetchNearbyGymsUseCase } from "./fetch-nearby-gyms";

let gymsRepository: InMemoryGymsRepository;
let fetchNearbyGyms: FetchNearbyGymsUseCase;

const userLatitude = -27.5906158;
const userLongitude = -48.5523341;

describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    fetchNearbyGyms = new FetchNearbyGymsUseCase(gymsRepository);
  });

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'near gym',
      description: '',
      phone: '',
      latitude: -27.5907332,
      longitude: -48.5560008
    });

    await gymsRepository.create({
      title: 'far gym',
      description: '',
      phone: '',
      latitude: -27.6755245,
      longitude: -48.5053035
    });

    const { gyms } = await fetchNearbyGyms.execute({
      userLatitude,
      userLongitude
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'near gym' })
    ]);
  });

})