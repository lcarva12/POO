import { BikeRepo } from "../../ports/bike-repo";
import { Bike } from "../../bike";
import prisma from "./db";

export class PrismaBikeRepo implements BikeRepo {
    async find(bikeId: string): Promise<Bike | null> {
        return await prisma.bike.findFirst({
            where: { id: bikeId },
        });
    }

    async add(bike: Bike): Promise<string> {
        const addedBike = await prisma.bike.create({
            data: { ...bike },
        });
        return addedBike.id;
    }

    async remove(bikeId: string): Promise<void> {
        await prisma.bike.delete({
            where: { id: bikeId },
        });
    }

    async list(): Promise<Bike[]> {
        return await prisma.bike.findMany({});
    }

    async update(bikeId: string, updatedBikeInfo: Partial<Bike>): Promise<void> {
        await prisma.bike.update({
            where: { id: bikeId },
            data: updatedBikeInfo,
        });
    }
}
