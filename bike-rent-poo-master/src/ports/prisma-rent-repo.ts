import { PrismaClient } from '@prisma/client'
import { Rent } from '../rent'
import { RentRepo } from './rent-repo'

const prisma = new PrismaClient()

export class PrismaRentRepo implements RentRepo {
  async add(rent: Rent): Promise<string> {
    const createdRent = await prisma.rent.create({
      data: {
        bike: { connect: { id: parseInt(rent.bike.id) } }, 
        user: { connect: { email: rent.user.email } },
        start: rent.start,
      },
    })

    return createdRent.id.toString()
  }

  async findOpen(bikeId: string, userEmail: string): Promise<Rent | null> {
    const openRent = await prisma.rent.findFirst({
      where: {
        bike: { id: parseInt(bikeId) },
        user: { email: userEmail },
        end: null, // Verifica se o aluguel está aberto
      },
    });

    return openRent ? this.mapToRent(openRent) : null;
  }

  async update(id: string, rent: Rent): Promise<void> {
    await prisma.rent.update({
      where: { id: parseInt(id) },
      data: {
        end: rent.end,
      },
    })
  }

  async findOpenRentsFor(userEmail: string): Promise<Rent[]> {
    const openRents = await prisma.rent.findMany({
      where: {
        user: { email: userEmail },
        end: null, // Verifica se o aluguel está aberto
      },
    })

    return openRents.map((openRent) => this.mapToRent(openRent));
  }

  private mapToRent(rentModel: any): Rent {
    return new Rent(
      rentModel.bike,
      rentModel.user.email,
      rentModel.start,
      rentModel.end,
    )
  }
}
