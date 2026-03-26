export class UserError extends Error {
    constructor(message, status = 400) {
        super(message);
        this.status = status;
        this.name = 'UserError';
    }
}

export class UserNotFoundError extends UserError {
    constructor(message = 'Usuario no encontrado.') {
        super(message, 404);
        this.name = 'UserNotFoundError';
    }
}
