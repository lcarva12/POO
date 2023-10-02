export class RentError extends Error {
    public readonly name = 'RentError'

    constructor() {
        super('Rent not found.')
    }
}