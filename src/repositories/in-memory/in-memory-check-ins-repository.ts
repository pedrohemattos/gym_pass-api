import { CheckIn, Prisma } from "@prisma/client";
import { CheckInsRepository } from "../check-ins-repository";
import { randomUUID } from "crypto";
import dayjs from "dayjs";

export class InMemoryCheckInsRepository implements CheckInsRepository{
  
  public items: CheckIn[] = [];
  
  async findById(id: string) {
    const checkIn = this.items.find(checkIn => checkIn.id === id);
    
    if(!checkIn)
    return null;
    
    return checkIn;
  }

  async save(checkIn: CheckIn) {
    const checkInIndex = this.items.findIndex(item => item.id === checkIn.id);

    if(checkInIndex >= 0)
      this.items[checkInIndex] = checkIn;

    return checkIn;
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      created_at: new Date(),
      validated_at: data.validated_at ? new Date(data.validated_at) : null
    }
  
    this.items.push(checkIn)
  
    return checkIn
  }
  
  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('date');
    const endOfTheDay = dayjs(date).endOf('date');
    
    const checkInOnSameDay = this.items.find(checkIn => {
      const checkInDate = dayjs(checkIn.created_at);
      const isOnTheSameDay = checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay);
      
      return checkIn.user_id === userId && isOnTheSameDay;
    });
    
    if(!checkInOnSameDay) 
    return null;
    
    return checkInOnSameDay;
  }
  
  async findManyByUserId(userId: string, page: number) {
    return this.items
      .filter(checkIn => checkIn.user_id === userId)
      .slice((page -1) * 20, page * 20)
  } 

  async countByUserId(userId: string) {
    return this.items
      .filter(checkIn => checkIn.user_id === userId)
      .length
  }
}