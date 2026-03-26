export class AuthError extends Error {
    constructor(message, status = 401) {
        super(message);
        this.status = status;
        this.name = 'AuthError';
    }
}

export class InvalidCredentialsError extends AuthError {
    constructor(message = 'Credenciales inválidas.') {
        super(message, 401);
        this.name = 'InvalidCredentialsError';
    }
}

export class UserNotFoundError extends AuthError {
    constructor(message = 'Usuario no encontrado.') {
        super(message, 404);
        this.name = 'UserNotFoundError';
    }
}

export class AccountDisabledError extends AuthError {
    constructor(message = 'Esta cuenta ha sido desactivada.') {
        super(message, 403);
        this.name = 'AccountDisabledError';
    }
}
