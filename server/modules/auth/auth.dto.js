export class LoginDTO {
    constructor({ email, password }) {
        this.email = email?.toLowerCase().trim();
        this.password = password;
    }

    validate() {
        if (!this.email || !this.password) {
            throw new Error('Correo electrónico y contraseña son obligatorios.');
        }
    }
}

export class RegisterDTO {
    constructor({ name, email, password }) {
        this.name = name?.trim();
        this.email = email?.toLowerCase().trim();
        this.password = password;
    }

    validate() {
        if (!this.name || !this.email || !this.password) {
            throw new Error('Todos los campos son obligatorios.');
        }
        if (this.password.length < 6) {
            throw new Error('La contraseña debe tener al menos 6 caracteres.');
        }
    }
}
