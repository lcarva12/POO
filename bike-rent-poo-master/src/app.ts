import { Bike } from "./bike";
import { Rent } from "./rent";
import { User } from "./user";
import crypto from 'crypto'

export class App {
    users: User[] = []
    bikes: Bike[] = []
    rents: Rent[] = []

    findUser(email: string): User {
        return this.users.find(user => user.email === email)
    }

    registerUser(user: User): void {
        for (const rUser of this.users) {
            if (rUser.email === user.email) {
                throw new Error('Duplicate user.')
            }
        }
        user.id = crypto.randomUUID()
        this.users.push(user)
    }

    registerBike(bike: Bike): void {
        this.bikes.push(bike);
    }

    removeUser(email: string): void {
        const userIndex = this.users.findIndex(user => user.email === email);
        if (userIndex !== -1) {
            this.users.splice(userIndex, 1);
        }
    }

    rentBike(userId: string, bikeId: string, startDate: Date, endDate: Date): void {
        const user = this.users.find(user => user.id === userId);
        const bike = this.bikes.find(bike => bike.id === bikeId);

        if (!user || !bike) {
            throw new Error('User or bike not found.');
        }

        const overlappingRent = this.rents.find(rent => (
            rent.bike.id === bikeId &&
            startDate <= rent.dateTo &&
            endDate >= rent.dateFrom
        ));

        if (overlappingRent) {
            throw new Error('Bike is already rented during selected dates.');
        }

        const rent = Rent.create(this.rents, bike, user, startDate, endDate);
        this.rents.push(rent);
    }

    returnBike(rentId: string): void {
        const rent = this.rents.find(rent => rent.id === rentId);

        if (!rent) {
            throw new Error('Rent not found.');
        }

        const bike = rent.bike;
        bike.isRented = false;
        this.rents = this.rents.filter(rent => rent.id !== rentId);
    }
}