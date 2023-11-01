import { PrismaUserRepo } from "../../src/conectors/mysql-user-repo";
import { User } from "../../src/user";
import crypto from 'crypto'

export class FakeUserRepo implements PrismaUserRepo {
    users: User[] = []

    async find(email: string): Promise<User> {
        return this.users.find(user => user.email === email)
    }

    private idCounter: number = 1; // Inicie o contador em 1 ou em um valor adequado
  
    async add(user: User): Promise<User | number> {
        const newId = this.idCounter++;
        user.id = newId;
        this.users.push(user);
        return newId;
      }
      

    async remove(email: string): Promise<void> {
        const userIndex = this.users.findIndex(user => user.email === email)
        if (userIndex !== -1) this.users.splice(userIndex, 1)
    }

    async list(): Promise<User[]> {
        return this.users
    }
}