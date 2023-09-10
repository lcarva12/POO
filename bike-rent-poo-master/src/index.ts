import { App } from "./app";
import { Bike } from "./bike";
import { Rent } from "./rent";
import { User } from "./user";

const app = new App()
const bike = new Bike('caloi mountain', 'mountain bike', 100, 200, 150.5, 
    'My bike', 5, [])
const bikeId = app.registerBike(bike)
//console.log(app.bikes)
const user1 = new User('Jose', 'jose@mail.com', '1234')
const user2 = new User('Maria', 'maria@mail.com', '1234')
app.registerUser(user1)
app.registerUser(user2)

const yesterday = new Date()
yesterday.setDate(yesterday.getDate() - 1)
const today = new Date()
const tomorrow = new Date()
tomorrow.setDate(tomorrow.getDate() + 1)
const dayAfterTomorrow = new Date()
dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2)
const twoDaysFromToday = new Date()
twoDaysFromToday.setDate(twoDaysFromToday.getDate() + 3)

app.rentBike(bikeId, 'jose@mail.com', yesterday, today)

app.returnBike(bikeId, 'jose@mail.com')

// Listagem de usuários cadastrados
const allUsers = app.listUsers();
console.log("Usuários cadastrados:", allUsers);

// Listagem de reservas/aluguéis cadastrados
const allRents = app.listRents();
console.log("Reservas/Aluguéis cadastrados:", allRents);

// Listagem de bikes cadastradas
const allBikes = app.listBikes();
console.log("Bikes cadastradas:", allBikes);

// Teste de Login
const userEmail = 'jose@mail.com';
const userPassword = '1234';

const verificacao = app.authenticateUser(userEmail, userPassword);
console.log("acesso:", verificacao);

if (app.authenticateUser(userEmail, userPassword)) {
    console.log('Usuário autenticado com sucesso.');
} else {
    console.log('Autenticação falhou. Verifique o email e a senha.');
}





