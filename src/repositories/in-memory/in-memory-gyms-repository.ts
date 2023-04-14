import { Gym, Prisma } from "@prisma/client";
import { FindManyNearbyParams, GymsRepository } from "../gyms-repository";
import { randomUUID } from "crypto";
import { getDistanceBetweenCoordinates } from "../../utils/get-distance-between-coordinates";

export class InMemoryGymsRepository implements GymsRepository{
  
  public items: Gym[] = [];
  
  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: data.id ? data.id : randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString())
    };
    
    this.items.push(gym);
    
    return gym;
  }
  
  async searchMany(query: string, page: number) {
    return this.items
      .filter(gym => gym.title.includes(query))
      .slice((page -1) * 20, page * 20)
  }

  async findById(id: string) {
    const gym = this.items.find(gym => gym.id === id);

    if(!gym)
      return null;

    return gym;
  }

  async findManyNearby(params: FindManyNearbyParams) {
    const gyms = this.items.filter(gym => {
      const distance_in_km = getDistanceBetweenCoordinates(
        { latitude: params.latitude, longitude: params.longitude },
        { latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber() }
      );

      return distance_in_km < 10
    });
    return gyms
  }
}