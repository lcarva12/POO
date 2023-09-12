import { Bike } from "./bike";
import { Rent } from "./rent";
import { User } from "./user";
import crypto from 'crypto'
import bcrypt from 'bcrypt'

export class App {
    users: User[] = []
    bikes: Bike[] = []
    currentRents: Rent[] = []

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
        bike.isAvailable = true // Marque a bicicleta como disponível
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
    
    rentBike(bikeId: string, userEmail: string, hours: number): void {
        const bike = this.bikes.find(bike => bike.id === bikeId)
        if (!bike) {
            throw new Error('Bike not found.')
        }
        const user = this.findUser(userEmail)
        if (!user) {
            throw new Error('User not found.')
        }
        if (!bike.isAvailable) {
            throw new Error('Bike is not available for rent.')
        }
        
        // Crie uma data para representar o início do aluguel
        const startDate = new Date();
        
        // Calcule a data de término do aluguel com base nas horas alugadas
        const endDate = new Date(startDate.getTime() + hours * 60 * 60 * 1000);
    
        // Calcule o valor do aluguel com base nas horas
        const rentAmount = bike.rate * hours
    
        // Atualize a disponibilidade da bicicleta
        bike.isAvailable = false
    
        // Registre o aluguel atual com 'amount'
        this.currentRents.push(new Rent(bike, user, startDate, endDate, rentAmount))
    }
    

    returnBike(bikeId: string, userEmail: string): number {
        const bike = this.bikes.find(bike => bike.id === bikeId);
        if (!bike) {
            throw new Error('Bike not found.');
        }
        const user = this.findUser(userEmail);
        if (!user) {
            throw new Error('User not found.');
        }
        const currentRentIndex = this.currentRents.findIndex(
            rent => rent.bike.id === bikeId && rent.user.email === userEmail
        );
        if (currentRentIndex !== -1) {
            const currentRent = this.currentRents[currentRentIndex];
            // Converta as datas para milissegundos e calcule a diferença
            const currentTime = new Date().getTime();
            const rentStartTime = currentRent.dateFrom.getTime();
            const millisecondsRented = currentTime - rentStartTime;
            // Converta o resultado de volta para horas
            const hoursRented = millisecondsRented / (1000 * 60 * 60);
            // Calcule o valor do aluguel com base nas horas
            const rentAmount = currentRent.amount;
            // Atualize a disponibilidade da bicicleta
            bike.isAvailable = true;
            // Remova o aluguel atual
            this.currentRents.splice(currentRentIndex, 1);
            return rentAmount;
        }
        throw new Error('Rent not found.');
    }
    // Método para listar todos os usuários cadastrados
    listUsers(): User[] {
        return this.users;
    }
    
    // Método para listar todas as reservas/aluguéis cadastrados
    listRents(): Rent[] {
        return this.currentRents;
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