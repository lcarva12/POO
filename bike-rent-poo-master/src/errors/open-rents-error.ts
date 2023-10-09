export class OpenRentsError extends Error {
    constructor() {
      super("Existem aluguéis em aberto para este usuário.");
      this.name = "OpenRentsError";
    }
  }
  