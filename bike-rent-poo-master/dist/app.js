"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const rent_1 = require("./rent");
const crypto_1 = __importDefault(require("crypto"));
class App {
    constructor() {
        this.users = [];
        this.bikes = [];
        this.rents = [];
    }
    findUser(email) {
        return this.users.find(user => user.email === email);
    }
    registerUser(user) {
        for (const rUser of this.users) {
            if (rUser.email === user.email) {
                throw new Error('Duplicate user.');
            }
        }
        user.id = crypto_1.default.randomUUID();
        this.users.push(user);
    }
    registerBike(bike) {
        this.bikes.push(bike);
    }
    removeUser(email) {
        const userIndex = this.users.findIndex(user => user.email === email);
        if (userIndex !== -1) {
            this.users.splice(userIndex, 1);
        }
    }
    rentBike(userId, bikeId, startDate, endDate) {
        const user = this.users.find(user => user.id === userId);
        const bike = this.bikes.find(bike => bike.id === bikeId);
        if (!user || !bike) {
            throw new Error('User or bike not found.');
        }
        const overlappingRent = this.rents.find(rent => (rent.bike.id === bikeId &&
            startDate <= rent.dateTo &&
            endDate >= rent.dateFrom));
        if (overlappingRent) {
            throw new Error('Bike is already rented during selected dates.');
        }
        const rent = rent_1.Rent.create(this.rents, bike, user, startDate, endDate);
        this.rents.push(rent);
    }
    returnBike(rentId) {
        const rent = this.rents.find(rent => rent.id === rentId);
        if (!rent) {
            throw new Error('Rent not found.');
        }
        const bike = rent.bike;
        bike.isRented = false;
        this.rents = this.rents.filter(rent => rent.id !== rentId);
    }
}
exports.App = App;
