import { App } from "./app";
import { Bike } from "./bike";
import { Rent } from "./rent";
import { User } from "./user";
import sinon from 'sinon'

async function main() {
    const clock = sinon.useFakeTimers();
    const app = new App()
    const user1 = new User('Jose', 'jose@mail.com', '1234')
    await app.registerUser(user1)
    const bike = new Bike('caloi mountainbike', 'mountain bike',
    1234, 1234, 100.0, 'My bike', 5, [], true, undefined, 'Localização Inicial')
    app.registerBike(bike)
    console.log('Bike disponível: ', bike.available)
    console.log('Localização:', bike.location)
    app.rentBike(bike.id, user1.email)
    app.updateBikeLocation(bike.id, 'Nova Localização')
    console.log('Bike disponível: ', bike.available)
    console.log('Localização:', bike.location)
    clock.tick(1000 * 60 * 65)
    console.log(app.returnBike(bike.id, user1.email))
    app.updateBikeLocation(bike.id, 'Local Devolução')
    console.log('Localização:', bike.location)
    console.log('Bike disponível: ', bike.available)
}

main()