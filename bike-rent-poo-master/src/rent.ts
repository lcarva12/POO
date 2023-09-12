import { Bike } from "./bike";
import { User } from "./user";

export class Rent {
    constructor(
        public bike: Bike,
        public user: User,
        public dateFrom: Date,
        public dateTo: Date,
        public amount: number, // Adicione o campo 'amount'
        public dateReturned?: Date
    ) {}
}
