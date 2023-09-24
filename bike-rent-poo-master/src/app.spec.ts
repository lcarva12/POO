import sinon from "sinon"
import { App } from "./app"
import { Bike } from "./bike"
import { User } from "./user"
import { Location } from "./location"

describe('App', () => {
    it('should correctly register a user', async () => {
        const app = new App()
        const user = new User('Jose', 'jose@mail.com', '1234')
        const userId = await app.registerUser(user)
        const registeredUser = app.findUser(user.email)

        expect(registeredUser).toBeDefined()
        expect(registeredUser.id).toEqual(userId)
    })

    it('should throw an error when registering a duplicate user', async () => {
        const app = new App()
        const user = new User('Jose', 'jose@mail.com', '1234')
        await app.registerUser(user)

        // Use uma função anônima para chamar a função registerUser novamente, pois queremos capturar a exceção
        const registerDuplicateUser = async () => {
            await app.registerUser(user)
        }

        // Use o método expect().toThrow() para verificar se a exceção é lançada
        await expect(registerDuplicateUser).rejects.toThrow('Duplicate user.')
    })

    it('should correctly authenticate a user with the correct password', async () => {
        const app = new App()
        const user = new User('Jose', 'jose@mail.com', '1234')
        await app.registerUser(user)

        const isAuthenticated = await app.authenticate(user.email, '1234')
        expect(isAuthenticated).toBeTruthy()
    })

    it('should throw an error when authenticating a user with an incorrect password', async () => {
        const app = new App()
        const user = new User('Jose', 'jose@mail.com', '1234')
        await app.registerUser(user)
    
        const isAuthenticated = await app.authenticate(user.email, 'wrongpassword')
    
        expect(isAuthenticated).toBe(false)
    })    

    it('should correctly register a bike', () => {
        const app = new App()
        const bike = new Bike('caloi mountainbike', 'mountain bike', 1234, 1234, 100.0, 'My bike', 5, [])
        const bikeId = app.registerBike(bike)
        const registeredBike = app.findBike(bikeId)

        expect(registeredBike).toBeDefined()
        expect(registeredBike.id).toEqual(bikeId)
    })

    it('should correctly rent a bike', async () => {
        const app = new App()
        const user = new User('Alice', 'alice@mail.com', 'password123')
        const bike = new Bike('Caloi mountainbike', 'mountain bike',
            1234, 1234, 100.0, 'My bike', 5, [])
        
        // Registre o usuário e a bicicleta no aplicativo
        await app.registerUser(user)
        app.registerBike(bike)

        // Alugue a bicicleta
        app.rentBike(bike.id, user.email)

        // Verifique se a bicicleta não está mais disponível após o aluguel
        const rentedBike = app.findBike(bike.id)
        expect(rentedBike.available).toBe(false)

        // Verifique se uma nova locação foi criada corretamente
        const rents = app.listRents()
        expect(rents.length).toBe(1)
        const rent = rents[0]
        expect(rent.bike).toEqual(bike)
        expect(rent.user).toEqual(user)
        expect(rent.start).toBeInstanceOf(Date)
        expect(rent.end).toBe(undefined)
    })

    it('should correctly return a bike', async () => {
        const app = new App()
        const user = new User('Jose', 'jose@mail.com', '1234')
        await app.registerUser(user)

        const bike = new Bike('caloi mountainbike', 'mountain bike',
            1234, 1234, 100.0, 'My bike', 5, [])
        app.registerBike(bike)

        // Alugue a bicicleta
        app.rentBike(bike.id, user.email)

        // Devolva a bicicleta e calcule o valor da locação
        const rentAmount = app.returnBike(bike.id, user.email)

        // Verifique se a bicicleta está novamente disponível
        expect(bike.available).toBe(true)
    })

    it('should correctly calculate the rent amount', async () => {
        const app = new App()
        const user = new User('Jose', 'jose@mail.com', '1234')
        await app.registerUser(user)
        const bike = new Bike('caloi mountainbike', 'mountain bike',
            1234, 1234, 100.0, 'My bike', 5, [])
        app.registerBike(bike)
        const clock = sinon.useFakeTimers()
        app.rentBike(bike.id, user.email)
        const hour = 1000 * 60 * 60
        clock.tick(2 * hour)
        const rentAmount = app.returnBike(bike.id, user.email)
        expect(rentAmount).toEqual(200.0)
    })

    it('should be able to move a bike to a specific location', () => {
        const app = new App()
        const bike = new Bike('caloi mountainbike', 'mountain bike', 1234, 1234, 100.0, 'My bike', 5, [])
        app.registerBike(bike)
        const newYork = new Location(40.753056, -73.983056)

        app.moveBikeTo(bike.id, newYork)

        expect(bike.location.latitude).toEqual(newYork.latitude)
        expect(bike.location.longitude).toEqual(newYork.longitude)
    })

    it('should throw an exception when trying to move an unregistered bike', () => {
        const app = new App()
        const bikeId = 'unregistered-bike-id' // Um ID que não existe no app
        const newYork = new Location(40.753056, -73.983056)

        // Use uma função anônima para chamar a função moveBikeTo, pois queremos capturar a exceção
        const moveUnregisteredBike = () => {
            app.moveBikeTo(bikeId, newYork)
        }

        // Use o método expect().toThrow() para verificar se a exceção é lançada
        expect(moveUnregisteredBike).toThrow('Bike not found.')
    })

})
