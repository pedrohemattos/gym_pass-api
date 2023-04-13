import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest';
import { InMemoryCheckInsRepository } from '../repositories/in-memory/in-memory-check-ins-repository';
import { CheckInUseCase } from './check-in';
import { InMemoryGymsRepository } from '../repositories/in-memory/in-memory-gyms-repository';
import { Decimal } from '@prisma/client/runtime';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { MaxDistanceError } from './errors/max-distance-error';
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error';

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let checkInUseCase: CheckInUseCase;

let latitudeSaoPaulo = -23.680534;
let longitudeSaoPaulo = -47.2191287;

describe('Check-in Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    checkInUseCase = new CheckInUseCase(checkInsRepository, gymsRepository);

    await gymsRepository.create({
      id: 'gym-id',
      title: 'test gym',
      description: '',
      phone: '',
      latitude: 0,
      longitude: 0
    })

    vi.useFakeTimers();
  })

  afterEach(() => {
    vi.useRealTimers();
  })

  it('should be able to check in', async () => {
    const { checkIn } = await checkInUseCase.execute({
      gymId: 'gym-id',
      userId: 'user-id',
      userLatitude: 0,
      userLongitude: 0
    });

    expect(checkIn.id).toEqual(expect.any(String))
  });

  it('should not be able to check in far from the gym', async () => {
    gymsRepository.items.push({
      id: 'gym-id-2',
      title: 'test gym',
      description: '',
      phone: '',
      latitude: new Decimal(latitudeSaoPaulo),
      longitude: new Decimal(longitudeSaoPaulo)
    });

    await expect(() => checkInUseCase.execute({
      gymId: 'gym-id-2',
      userId: 'user-id',
      userLatitude: 0,
      userLongitude: 0
    })).rejects.toBeInstanceOf(MaxDistanceError);

  });

  it('should not be able to check in twice in the same day', async () => {
    const date = new Date(2023, 0, 20, 8, 0, 0);
    vi.setSystemTime(date);

    await checkInUseCase.execute({
      gymId: 'gym-id',
      userId: 'user-id',
      userLatitude: 0,
      userLongitude: 0
    });

    await expect(() => checkInUseCase.execute({
      gymId: 'gym-id',
      userId: 'user-id',
      userLatitude: 0,
      userLongitude: 0
    })).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  });

  it('should be able to check in twice but in different days', async () => {
    let date = new Date(2023, 0, 20, 8, 0, 0);
    vi.setSystemTime(date);

    await checkInUseCase.execute({
      gymId: 'gym-id',
      userId: 'user-id',
      userLatitude: 0,
      userLongitude: 0
    });

    date = new Date(2023, 0, 21, 8, 0, 0);
    vi.setSystemTime(date);

    const { checkIn } = await checkInUseCase.execute({
      gymId: 'gym-id',
      userId: 'user-id',
      userLatitude: 0,
      userLongitude: 0
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });
  
})