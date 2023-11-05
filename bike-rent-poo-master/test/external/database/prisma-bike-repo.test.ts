import { PrismaBikeRepo } from "../../../src/external/database/prisma-bike-repo";
import { Bike } from "../../../src/bike";
import prisma from "../../../src/external/database/db";
import { Location } from "../../../src/location"; // Certifique-se de importar a classe Location corretamente

describe('PrismaBikeRepo', () => {
    beforeEach(async () => {
        await prisma.bike.deleteMany({});
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it('adds a bike in the database', async () => {
        const bikeToBePersisted = new Bike(
            'Bike Test',
            'Mountain',
            26,
            100,
            10,
            'Test bike description',
            0,
            [],
            true,
            { latitude: 0, longitude: 0 } // Adicione latitude e longitude aqui
        );
        const repo = new PrismaBikeRepo();
        const bikeId = await repo.add(bikeToBePersisted);
        expect(bikeId).toBeDefined();
        const persistedBike = await repo.find(bikeId);
        expect(persistedBike.name).toEqual(bikeToBePersisted.name);
    });

    it('removes a bike from the database', async () => {
        const bikeToBePersisted = new Bike(
            'Bike Test',
            'Mountain',
            26,
            100,
            10,
            'Test bike description',
            0,
            [],
            true,
            { latitude: 0, longitude: 0 } // Adicione latitude e longitude aqui
        );
        const repo = new PrismaBikeRepo();
        const bikeId = await repo.add(bikeToBePersisted);
        await repo.remove(bikeId);
        const removedBike = await repo.find(bikeId);
        expect(removedBike).toBeNull();
    });

    it('lists bikes in the database', async () => {
        const bike1 = new Bike(
            'Bike 1',
            'Mountain',
            26,
            100,
            10,
            'Description 1',
            0,
            [],
            true,
            { latitude: 0, longitude: 0 } // Adicione latitude e longitude aqui
        );
        const bike2 = new Bike(
            'Bike 2',
            'City',
            24,
            80,
            8,
            'Description 2',
            0,
            [],
            true,
            { latitude: 0, longitude: 0 } // Adicione latitude e longitude aqui
        );
        const repo = new PrismaBikeRepo();
        const bikeId1 = await repo.add(bike1);
        const bikeId2 = await repo.add(bike2);
        const bikeList = await repo.list();
        expect(bikeList.length).toEqual(2);
    });

    it('updates bike information in the database', async () => {
        const bikeToBePersisted = new Bike(
            'Bike Test',
            'Mountain',
            26,
            100,
            10,
            'Test bike description',
            0,
            [],
            true,
            { latitude: 0, longitude: 0 } // Adicione latitude e longitude aqui
        );
        const repo = new PrismaBikeRepo();
        const bikeId = await repo.add(bikeToBePersisted);
        
        const updatedBikeInfo = {
            ...bikeToBePersisted,
            name: 'Updated Bike',
            rate: 12,
        };

        await repo.update(bikeId, updatedBikeInfo);
        const updatedBike = await repo.find(bikeId);

        expect(updatedBike.name).toEqual(updatedBikeInfo.name);
        expect(updatedBike.rate).toEqual(updatedBikeInfo.rate);
    });
});
