import { Bike } from "./bike";
import { Rent } from "./rent";
import { User } from "./user";
import crypto from 'crypto'
import bcrypt from 'bcrypt'

export class App {
    users: User[] = []
    bikes: Bike[] = []
    rents: Rent[] = []

    findUser(email: string): User {
        return this.users.find(user => user.email === email)
    }

    registerUser(user: User): string {
        for (const rUser of this.users) {
            if (rUser.email === user.email) {
                throw new Error('Duplicate user.')
            }
        }
        const newId = crypto.randomUUID()
        user.id = newId
        this.users.push(user)
        return newId
    }

    registerBike(bike: Bike): string {
        const newId = crypto.randomUUID()
        bike.id = newId
        this.bikes.push(bike)
        return newId
    }

    removeUser(email: string): void {
        const userIndex = this.users.findIndex(user => user.email === email)
        if (userIndex !== -1) {
            this.users.splice(userIndex, 1)
            return
        }
        throw new Error('User does not exist.')
    }
    
    rentBike(bikeId: string, userEmail: string, startDate: Date, endDate: Date): void {
        const bike = this.bikes.find(bike => bike.id === bikeId)
        if (!bike) {
            throw new Error('Bike not found.')
        }
        const user = this.findUser(userEmail)
        if (!user) {
            throw new Error('User not found.')
        }
        const bikeRents = this.rents.filter(rent =>
            rent.bike.id === bikeId && !rent.dateReturned
        )
        const newRent = Rent.create(bikeRents, bike, user, startDate, endDate)
        this.rents.push(newRent)
    }

    returnBike(bikeId: string, userEmail: string) {
        const today = new Date()
        const rent = this.rents.find(rent => 
            rent.bike.id === bikeId &&
            rent.user.email === userEmail &&
            rent.dateReturned === undefined &&
            rent.dateFrom <= today
        )
        if (rent) {
            rent.dateReturned = today
            return
        }
        throw new Error('Rent not found.')
    }

    // Método para listar todos os usuários cadastrados
    listUsers(): User[] {
        return this.users;
    }
    
    // Método para listar todas as reservas/aluguéis cadastrados
    listRents(): Rent[] {
        return this.rents;
    }
    
    // Método para listar todas as bikes cadastradas
    listBikes(): Bike[] {
        return this.bikes;
    }

    authenticateUser(email: string, password: string): boolean {
        // Encontre o usuário com o email fornecido
        const user = this.findUser(email);

        if (user) {
            // Use bcrypt para comparar a senha fornecida com a senha armazenada
            const isPasswordValid = bcrypt.compareSync(password, user.password);

            if (isPasswordValid) {
                // A senha é válida, o usuário está autenticado
                return true;
            }
        }
        // Se o usuário não for encontrado ou a senha estiver incorreta, retorne falso
        return false;
    }
}