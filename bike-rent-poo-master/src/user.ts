import bcrypt from 'bcrypt'

export class User {
    constructor(
        public name: string,
        public email: string,
        public password: string, // A senha em texto simples
        public id?: string
    ) {
        // Antes de salvar a senha, criptografe-a
        this.password = this.hashPassword(password);
    }

    // Método para criar o hash da senha usando bcrypt
    private hashPassword(password: string): string {
        const saltRounds = 10; // Número de "rounds" de salt (recomendado: 10)
        const salt = bcrypt.genSaltSync(saltRounds);
        return bcrypt.hashSync(password, salt);
    }
}
