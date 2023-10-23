import { PrismaClient } from '@prisma/client'
import { User } from '../user'

const prisma = new PrismaClient()

export class PrismaUserRepo {
  async find(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } })
  }

  async add(user: User): Promise<User | number> {
    return prisma.user.create({ data: user })
  }

  async remove(email: string): Promise<void> {
    await prisma.user.delete({ where: { email } })
  }

  async list(): Promise<User[]> {
    return prisma.user.findMany();
  }
}
