import { App } from "./app";
import { Bike } from "./bike";
import { User } from "./user";

const app = new App();
const bike = new Bike('Caloi Mountain', 'mountain bike', 100, 200, 150.5, 
    'My bike', 5, []);
const bikeId = app.registerBike(bike);

const user1 = new User('Jose', 'jose@mail.com', '1234');
const user2 = new User('Maria', 'maria@mail.com', '1234');
app.registerUser(user1);
app.registerUser(user2);

// Aluguel de bicicleta
app.rentBike(bikeId, 'jose@mail.com', 3); // Jose aluga a bicicleta por 3 horas

// Devolução da bicicleta
const rentAmount = app.returnBike(bikeId, 'jose@mail.com'); // Jose devolve a bicicleta

console.log('Valor do aluguel:', rentAmount);

// Listagem de usuários cadastrados
const allUsers = app.listUsers();
console.log('Usuários cadastrados:', allUsers);

// Listagem de aluguéis cadastrados
const allRents = app.listRents();
console.log('Aluguéis cadastrados:', allRents);

// Listagem de bicicletas cadastradas
const allBikes = app.listBikes();
console.log('Bicicletas cadastradas:', allBikes);

// Teste de Login
const userEmail = 'jose@mail.com';
const userPassword = '1234';

const verificacao = app.authenticateUser(userEmail, userPassword);
console.log('Acesso:', verificacao);

if (verificacao) {
    console.log('Usuário autenticado com sucesso.');
} else {
    console.log('Autenticação falhou. Verifique o email e a senha.');
}
